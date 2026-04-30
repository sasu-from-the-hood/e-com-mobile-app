import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, TextInput, Switch, Alert, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Keyboard, Image, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';
import { X, Check, Plus, ShoppingBag, MessageSquare, Mountain, Trash2 } from 'lucide-react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FashionScene3D } from '@/components/fashion/fashion-scene-3d';
import { ProductSelector } from '@/components/fashion/product-selector';
import { CaptionDisplay } from '@/components/fashion/caption-display';
import { ConfirmationModal } from '@/components/confirmation-modal';
import { orpcClient } from '@/lib/orpc-client';
import { useAuth } from '@/hooks/useAuth';

export interface PostItem {
  id: string;
  productId: string;
  modelId: string;
  leftLegFile: string;
  boneName: string;
  bodyPartType: string;
  scale: number;
  positionX: number;
  positionY: number;
  positionZ: number;
  productName?: string;
  productImage?: string;
}

export interface TextElement {
  id: string;
  content: string;
  positionX: number;
  positionY: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  rotation: number;
  zIndex: number;
}

export default function CreatePostScreen() {
  const { user } = useAuth();
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const isEditMode = !!editId;
  const captionInputRef = useRef<TextInput>(null);
  
  const [caption, setCaption] = useState('');
  const [is3DMode, setIs3DMode] = useState(true);
  const [attachedItems, setAttachedItems] = useState<PostItem[]>([]);
  
  // Debug: Log whenever attachedItems changes
  useEffect(() => {
    console.log('[CreatePost] attachedItems changed:', attachedItems.map(i => i.productId));
  }, [attachedItems]);
  const [isSaving, setIsSaving] = useState(false);
  const [showProductPanel, setShowProductPanel] = useState(false);
  const [showCaptionInput, setShowCaptionInput] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [mentionSuggestions, setMentionSuggestions] = useState<any[]>([]);
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [showPostConfirmation, setShowPostConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPlaceSelector, setShowPlaceSelector] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<'floor' | 'studio' | 'outdoor' | 'minimal'>('floor');
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [pendingProductIds, setPendingProductIds] = useState<Set<string>>(new Set());

  // Load existing post data when in edit mode
  useEffect(() => {
    if (isEditMode && editId) {
      loadPostData(editId);
    }
  }, [isEditMode, editId]);

  const loadPostData = async (postId: string) => {
    setIsLoadingPost(true);
    try {
      const post = await orpcClient.getPostById(postId);
      
      // Set caption
      if (post.caption) {
        setCaption(post.caption);
      }
      
      // Set scene mode
      setIs3DMode(post.sceneMode === '3d');
      
      // Set background/place (default to floor if not set)
      if (post.backgroundColor) {
        setSelectedPlace(post.backgroundColor as 'floor' | 'studio' | 'outdoor' | 'minimal');
      }
      
      // Set attached items
      if (post.items && post.items.length > 0) {
        setAttachedItems(post.items.map((item: any) => ({
          id: item.id,
          productId: item.productId,
          modelId: item.modelId,
          leftLegFile: item.leftLegFile,
          boneName: item.boneName,
          bodyPartType: item.bodyPartType,
          scale: Number(item.scale),
          positionX: Number(item.positionX),
          positionY: Number(item.positionY),
          positionZ: Number(item.positionZ),
          productName: item.productName,
          productImage: item.productImage,
        })));
      }
      
    } catch (error) {
      console.error('Failed to load post:', error);
      Alert.alert('Error', 'Failed to load post data');
      router.back();
    } finally {
      setIsLoadingPost(false);
    }
  };

  // Check if there are unsaved changes
  const hasUnsavedChanges = () => {
    return attachedItems.length > 0 || caption.trim().length > 0;
  };

  // Handle back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (hasUnsavedChanges()) {
        setShowExitConfirmation(true);
        return true; // Prevent default back action
      }
      return false; // Allow default back action
    });

    return () => backHandler.remove();
  }, [attachedItems, caption]);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
        setShowCaptionInput(false);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  // Load following users for mentions
  const loadFollowingUsers = async (query: string) => {
    try {
      const result = await orpcClient.getFollowLists({});
      const filtered = result.following.filter((u: any) => 
        u.name?.toLowerCase().includes(query.toLowerCase())
      );
      setMentionSuggestions(filtered.slice(0, 5));
    } catch (error) {
      console.error('Failed to load following users:', error);
      setMentionSuggestions([]);
    }
  };

  // Handle caption change and detect @ mentions
  const handleCaptionChange = (text: string) => {
    setCaption(text);
    
    // Check for @ mention
    const lastAtIndex = text.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const textAfterAt = text.substring(lastAtIndex + 1);
      const spaceIndex = textAfterAt.indexOf(' ');
      const query = spaceIndex === -1 ? textAfterAt : textAfterAt.substring(0, spaceIndex);
      
      if (query.length > 0 && spaceIndex === -1) {
        setMentionQuery(query);
        setShowMentionDropdown(true);
        loadFollowingUsers(query);
      } else if (query.length === 0) {
        setShowMentionDropdown(true);
        loadFollowingUsers('');
      } else {
        setShowMentionDropdown(false);
      }
    } else {
      setShowMentionDropdown(false);
    }
  };

  // Insert mention
  const insertMention = (username: string) => {
    const lastAtIndex = caption.lastIndexOf('@');
    const beforeAt = caption.substring(0, lastAtIndex);
    const newCaption = beforeAt + '@' + username + ' ';
    setCaption(newCaption);
    setShowMentionDropdown(false);
    captionInputRef.current?.focus();
  };

  const handleAttachProduct = (item: PostItem) => {
    console.log('[CreatePost] handleAttachProduct called with:', item.productId);
    
    // Use callback form to ensure we have latest state
    setAttachedItems(currentItems => {
      console.log('[CreatePost] Current attachedItems in callback:', currentItems.map(i => i.productId));
      
      // Check if product already attached
      const exists = currentItems.find(i => i.productId === item.productId);
      if (exists) {
        Alert.alert('Already Added', 'This product is already in your scene');
        return currentItems; // Return unchanged
      }
      
      const newItems = [...currentItems, item];
      console.log('[CreatePost] Setting new attachedItems in callback:', newItems.map(i => i.productId));
      return newItems;
    });
  };

  const handleRemoveProduct = (productId: string) => {
    console.log('[CreatePost] handleRemoveProduct called with:', productId);
    
    setAttachedItems(currentItems => {
      console.log('[CreatePost] Current attachedItems before remove:', currentItems.map(i => i.productId));
      const newItems = currentItems.filter(i => i.productId !== productId);
      console.log('[CreatePost] Setting new attachedItems after remove:', newItems.map(i => i.productId));
      return newItems;
    });
  };

  const handleSavePost = async (isDraft: boolean) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to create a post');
      return;
    }

    if (attachedItems.length === 0) {
      Alert.alert('No Products', 'Please add at least one product to your scene');
      return;
    }

    setIsSaving(true);
    setShowPostConfirmation(false);
    
    try {
      if (isEditMode && editId) {
        // Update existing post
        const updateData = {
          postId: editId,
          caption: caption.trim() || null,
          isDraft,
          sceneMode: (is3DMode ? '3d' : '2d') as '2d' | '3d',
          backgroundColor: selectedPlace,
          items: attachedItems.map(item => ({
            productId: item.productId,
            modelId: item.modelId,
            leftLegFile: item.leftLegFile || null,
            boneName: item.boneName,
            bodyPartType: item.bodyPartType,
            scale: item.scale,
            positionX: item.positionX,
            positionY: item.positionY,
            positionZ: item.positionZ,
          })),
          textElements: [],
        };
        
        await orpcClient.updatePost(updateData);

        setSuccessMessage('Post updated successfully!');
        setShowSuccessModal(true);
      } else {
        // Create new post
        await orpcClient.createPost({
          caption: caption.trim() || undefined,
          isDraft,
          sceneMode: (is3DMode ? '3d' : '2d') as '2d' | '3d',
          backgroundColor: selectedPlace,
          items: attachedItems.map(item => ({
            productId: item.productId,
            modelId: item.modelId,
            leftLegFile: item.leftLegFile,
            boneName: item.boneName,
            bodyPartType: item.bodyPartType,
            scale: item.scale,
            positionX: item.positionX,
            positionY: item.positionY,
            positionZ: item.positionZ,
          })),
          textElements: [],
        });

        setSuccessMessage(isDraft ? 'Post saved as draft' : 'Post published successfully!');
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Failed to save post:', error);
      Alert.alert('Error', 'Failed to save post. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePost = async () => {
    if (!editId) return;
    
    setShowDeleteConfirmation(false);
    setIsSaving(true);
    
    try {
      await orpcClient.deletePost(editId);
      setSuccessMessage('Post deleted successfully');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Failed to delete post:', error);
      Alert.alert('Error', 'Failed to delete post. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (hasUnsavedChanges()) {
      setShowExitConfirmation(true);
    } else {
      router.back();
    }
  };

  const handleConfirmExit = () => {
    setShowExitConfirmation(false);
    router.back();
  };

  const handlePost = () => {
    if (attachedItems.length === 0) {
      Alert.alert('No Products', 'Please add at least one product to your scene');
      return;
    }
    setShowPostConfirmation(true);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          <StatusBar style="light" />
          
          <SafeAreaView style={styles.safeArea} edges={['top']}>
            {/* Minimal Header */}
            <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
              <X size={24} color={AppTheme.colors.foreground} />
            </TouchableOpacity>
            
            <ThemedText style={styles.headerTitle}>
              {isEditMode ? 'Edit Post' : 'Create Post'}
            </ThemedText>
            
            <View style={styles.headerRight}>
              {isEditMode && (
                <TouchableOpacity 
                  onPress={() => setShowDeleteConfirmation(true)}
                  style={styles.deleteIconButton}
                >
                  <Trash2 size={20} color="#ff4444" />
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                onPress={handlePost} 
                style={styles.postButton}
                disabled={isSaving}
              >
                <Check size={20} color={AppTheme.colors.background} />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        <KeyboardAvoidingView 
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          {/* Full Screen 3D Scene */}
          <TouchableWithoutFeedback 
            onPress={() => {
              if (showProductPanel) setShowProductPanel(false);
              if (showCaptionInput) setShowCaptionInput(false);
            }}
          >
            <View style={styles.sceneContainer}>
              <FashionScene3D
                items={attachedItems}
                textElements={[]}
                is3DMode={is3DMode}
                backgroundColor={selectedPlace}
                isEditable={true}
                onTextElementMove={() => {}}
                onTextElementTap={() => {}}
              />
              
              {/* Floating Action Buttons */}
              <View style={styles.floatingButtons}>
                {/* Toggle Product Panel Button */}
                <TouchableOpacity 
                  style={[styles.floatingButton, showProductPanel && styles.floatingButtonActive]} 
                  onPress={() => setShowProductPanel(!showProductPanel)}
                >
                  <ShoppingBag 
                    size={20} 
                    color={showProductPanel ? AppTheme.colors.background : AppTheme.colors.foreground} 
                  />
                </TouchableOpacity>

                {/* Place Selector Button */}
                <TouchableOpacity 
                  style={[styles.floatingButton, showPlaceSelector && styles.floatingButtonActive]} 
                  onPress={() => setShowPlaceSelector(!showPlaceSelector)}
                >
                  <Mountain 
                    size={20} 
                    color={showPlaceSelector ? AppTheme.colors.background : AppTheme.colors.foreground} 
                  />
                </TouchableOpacity>

                {/* Toggle Caption Button */}
                <TouchableOpacity 
                  style={[styles.floatingButton, showCaptionInput && styles.floatingButtonActive]} 
                  onPress={() => {
                    setShowCaptionInput(true);
                    setTimeout(() => {
                      captionInputRef.current?.focus();
                    }, 100);
                  }}
                >
                  <MessageSquare 
                    size={20} 
                    color={showCaptionInput ? AppTheme.colors.background : AppTheme.colors.foreground} 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>

          {/* Caption Display (TikTok style - always shows at bottom when there's text) */}
          {caption.length > 0 && (
            <View style={styles.captionDisplay} pointerEvents="none">
              <CaptionDisplay caption={caption} maxLines={3} />
            </View>
          )}

          {/* Product Selector (Collapsible Right Panel) */}
          {showProductPanel && (
            <View style={styles.productPanel}>
              <ProductSelector
                onSelectProduct={handleAttachProduct}
                onRemoveProduct={handleRemoveProduct}
                attachedProductIds={attachedItems.map(i => i.productId)}
              />
            </View>
          )}

          {/* Place Selector Panel */}
          {showPlaceSelector && (
            <View style={styles.placePanel}>
              <ThemedText style={styles.placePanelTitle}>Scene Background</ThemedText>
              <View style={styles.placeOptions}>
                <TouchableOpacity
                  style={[styles.placeOption, selectedPlace === 'floor' && styles.placeOptionSelected]}
                  onPress={() => {
                    setSelectedPlace('floor');
                    setShowPlaceSelector(false);
                  }}
                >
                  <View style={[styles.placePreview, { backgroundColor: '#8B7355' }]} />
                  <ThemedText style={styles.placeOptionText}>Floor</ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.placeOption, selectedPlace === 'studio' && styles.placeOptionSelected]}
                  onPress={() => {
                    setSelectedPlace('studio');
                    setShowPlaceSelector(false);
                  }}
                >
                  <View style={[styles.placePreview, { backgroundColor: '#E8E8E8' }]} />
                  <ThemedText style={styles.placeOptionText}>Studio</ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.placeOption, selectedPlace === 'outdoor' && styles.placeOptionSelected]}
                  onPress={() => {
                    setSelectedPlace('outdoor');
                    setShowPlaceSelector(false);
                  }}
                >
                  <View style={[styles.placePreview, { backgroundColor: '#87CEEB' }]} />
                  <ThemedText style={styles.placeOptionText}>Outdoor</ThemedText>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.placeOption, selectedPlace === 'minimal' && styles.placeOptionSelected]}
                  onPress={() => {
                    setSelectedPlace('minimal');
                    setShowPlaceSelector(false);
                  }}
                >
                  <View style={[styles.placePreview, { backgroundColor: '#FFFFFF' }]} />
                  <ThemedText style={styles.placeOptionText}>Minimal</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Caption Input (Hidden, opens keyboard) */}
          {showCaptionInput && (
            <View style={[styles.captionInputContainer, { bottom: keyboardHeight }]}>
              <View style={styles.captionInputHeader}>
                <View style={styles.captionHelper}>
                  <ThemedText style={styles.captionHelperText}>
                    Use @ to mention users, # for hashtags
                  </ThemedText>
                </View>
                <TouchableOpacity 
                  onPress={() => {
                    setShowCaptionInput(false);
                    setShowMentionDropdown(false);
                  }}
                  style={styles.captionCloseButton}
                >
                  <X size={20} color={AppTheme.colors.foreground} />
                </TouchableOpacity>
              </View>
              <TextInput
                ref={captionInputRef}
                style={styles.captionInput}
                placeholder="Add a caption..."
                placeholderTextColor={AppTheme.colors.mutedForeground}
                value={caption}
                onChangeText={handleCaptionChange}
                multiline
                maxLength={500}
                onBlur={() => {
                  setTimeout(() => {
                    setShowCaptionInput(false);
                    setShowMentionDropdown(false);
                  }, 200);
                }}
              />
              <ThemedText style={styles.captionCount}>{caption.length}/500</ThemedText>

              {/* Mention Dropdown */}
              {showMentionDropdown && (
                <View style={styles.mentionDropdown}>
                  {mentionSuggestions.length > 0 ? (
                    <ScrollView style={styles.mentionList} keyboardShouldPersistTaps="handled">
                      {mentionSuggestions.map((user) => (
                        <TouchableOpacity
                          key={user.id}
                          style={styles.mentionItem}
                          onPress={() => insertMention(user.name)}
                        >
                          {user.image ? (
                            <Image source={{ uri: user.image }} style={styles.mentionAvatar} />
                          ) : (
                            <View style={[styles.mentionAvatar, styles.mentionAvatarPlaceholder]}>
                              <ThemedText style={styles.mentionAvatarText}>
                                {user.name?.charAt(0).toUpperCase() || 'U'}
                              </ThemedText>
                            </View>
                          )}
                          <ThemedText style={styles.mentionName}>{user.name}</ThemedText>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  ) : (
                    <View style={styles.mentionEmpty}>
                      <ThemedText style={styles.mentionEmptyText}>No users found</ThemedText>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}
        </KeyboardAvoidingView>

        {/* Exit Confirmation Modal */}
        <ConfirmationModal
          visible={showExitConfirmation}
          title="Discard Changes?"
          message="You have unsaved changes. Are you sure you want to leave? Your work will be lost."
          confirmText="Discard"
          cancelText="Keep Editing"
          onConfirm={handleConfirmExit}
          onCancel={() => setShowExitConfirmation(false)}
          type="warning"
        />

        {/* Post Confirmation Modal */}
        <ConfirmationModal
          visible={showPostConfirmation}
          title={isEditMode ? "Update Post?" : "Publish Post?"}
          message={isEditMode ? "Your changes will be saved and visible to your followers." : "Your post will be visible to all your followers. Ready to share?"}
          confirmText={isEditMode ? "Update" : "Publish"}
          cancelText="Cancel"
          onConfirm={() => handleSavePost(false)}
          onCancel={() => setShowPostConfirmation(false)}
          type="info"
        />

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          visible={showDeleteConfirmation}
          title="Delete Post?"
          message="This action cannot be undone. Are you sure you want to delete this post?"
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDeletePost}
          onCancel={() => setShowDeleteConfirmation(false)}
          type="warning"
        />

        {/* Success Modal */}
        <ConfirmationModal
          visible={showSuccessModal}
          title="Success"
          message={successMessage}
          confirmText="OK"
          onConfirm={() => {
            setShowSuccessModal(false);
            router.back();
          }}
          type="info"
          showCancel={false}
        />
        </View>
      </GestureHandlerRootView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  safeArea: {
    backgroundColor: AppTheme.colors.card,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.sm,
    backgroundColor: AppTheme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  headerButton: {
    padding: AppTheme.spacing.xs,
    width: 40,
  },
  headerTitle: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.bold,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.sm,
  },
  deleteIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppTheme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sceneContainer: {
    flex: 1,
    position: 'relative',
  },
  floatingButtons: {
    position: 'absolute',
    right: AppTheme.spacing.md,
    top: '50%',
    transform: [{ translateY: -66 }], // Adjusted for 3 buttons
    gap: AppTheme.spacing.sm,
  },
  floatingButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  floatingButtonActive: {
    backgroundColor: AppTheme.colors.primary,
    borderColor: AppTheme.colors.primary,
  },
  productPanel: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderLeftWidth: 1,
    borderLeftColor: AppTheme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  placePanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.border,
    padding: AppTheme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  placePanelTitle: {
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.bold,
    marginBottom: AppTheme.spacing.md,
  },
  placeOptions: {
    flexDirection: 'row',
    gap: AppTheme.spacing.md,
    justifyContent: 'center',
  },
  placeOption: {
    alignItems: 'center',
    gap: AppTheme.spacing.xs,
    padding: AppTheme.spacing.sm,
    borderRadius: AppTheme.borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 80,
  },
  placeOptionSelected: {
    borderColor: AppTheme.colors.primary,
    backgroundColor: AppTheme.colors.secondary,
  },
  placePreview: {
    width: 48,
    height: 48,
    borderRadius: AppTheme.borderRadius.md,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  placeOptionText: {
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.medium,
  },
  captionDisplay: {
    position: 'absolute',
    bottom: AppTheme.spacing.lg,
    left: AppTheme.spacing.md,
    right: AppTheme.spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.sm,
    borderRadius: AppTheme.borderRadius.md,
    maxHeight: 100,
  },
  captionInputContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: AppTheme.colors.card,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.border,
    padding: AppTheme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  captionInputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.xs,
  },
  captionHelper: {
    flex: 1,
  },
  captionHelperText: {
    fontSize: AppTheme.fontSize.xs,
    color: AppTheme.colors.mutedForeground,
    fontStyle: 'italic',
  },
  captionCloseButton: {
    padding: AppTheme.spacing.xs,
    marginLeft: AppTheme.spacing.sm,
  },
  captionInput: {
    color: AppTheme.colors.foreground,
    fontSize: AppTheme.fontSize.sm,
    minHeight: 60,
    maxHeight: 120,
    backgroundColor: AppTheme.colors.card,
    borderRadius: AppTheme.borderRadius.md,
    padding: AppTheme.spacing.sm,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  captionCount: {
    color: AppTheme.colors.mutedForeground,
    fontSize: AppTheme.fontSize.xs,
    textAlign: 'right',
    marginTop: AppTheme.spacing.xs,
  },
  mentionDropdown: {
    maxHeight: 200,
    backgroundColor: AppTheme.colors.card,
    borderRadius: AppTheme.borderRadius.md,
    marginTop: AppTheme.spacing.sm,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  mentionList: {
    maxHeight: 200,
  },
  mentionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: AppTheme.spacing.sm,
    gap: AppTheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  mentionAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  mentionAvatarPlaceholder: {
    backgroundColor: AppTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mentionAvatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: AppTheme.fontWeight.bold,
  },
  mentionName: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.foreground,
  },
  mentionEmpty: {
    padding: AppTheme.spacing.md,
    alignItems: 'center',
  },
  mentionEmptyText: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.mutedForeground,
    fontStyle: 'italic',
  },
});
