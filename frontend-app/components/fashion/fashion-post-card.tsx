import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Image, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';
import { Heart, Bookmark, Share2, Pencil } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { FashionScene3D } from './fashion-scene-3d';
import { CaptionDisplay } from './caption-display';
import { orpcClient } from '@/lib/orpc-client';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import { toast } from 'sonner-native';
import { URL } from '@/config';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FashionPost {
  id: string;
  userId: string;
  userName: string;
  userImage: string | null;
  caption: string | null;
  likesCount: number;
  sharesCount: number;
  savesCount: number;
  viewsCount: number;
  sceneMode: string;
  createdAt: string;
  items: any[];
  textElements: any[];
  isLiked: boolean;
  isSaved: boolean;
  isFollowing: boolean;
  isDraft?: boolean;
  isPublished?: boolean;
}

interface FashionPostCardProps {
  post: FashionPost;
  isActive: boolean;
  isOwnPost?: boolean;
}

export function FashionPostCard({ post, isActive, isOwnPost = false }: FashionPostCardProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [isFollowing, setIsFollowing] = useState(post.isFollowing);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [savesCount, setSavesCount] = useState(post.savesCount);
  const [sharesCount, setSharesCount] = useState(post.sharesCount);

  // Update state when post prop changes (e.g., when switching tabs)
  useEffect(() => {
    setIsLiked(post.isLiked);
    setIsSaved(post.isSaved);
    setIsFollowing(post.isFollowing);
    setLikesCount(post.likesCount);
    setSavesCount(post.savesCount);
    setSharesCount(post.sharesCount);
  }, [post.id, post.isLiked, post.isSaved, post.isFollowing, post.likesCount, post.savesCount, post.sharesCount]);

  // Track view when post becomes active
  useEffect(() => {
    if (isActive) {
      trackView();
    }
  }, [isActive]);

  const trackView = async () => {
    try {
      await orpcClient.viewPost(post.id);
    } catch (error) {
      console.error('Failed to track view:', error);
    }
  };

  const handleLike = async () => {
    try {
      const result = await orpcClient.likePost(post.id);
      setIsLiked(result.liked);
      setLikesCount(prev => result.liked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleSave = async () => {
    try {
      const result = await orpcClient.savePost(post.id);
      setIsSaved(result.saved);
      setSavesCount(prev => result.saved ? prev + 1 : prev - 1);
    } catch (error) {
      console.error('Failed to save post:', error);
    }
  };

  const handleShare = async () => {
    try {
      // Generate shareable link using base URL from config
      const shareLink = `${URL.BASE}/fashion/post/${post.id}`;
      
      // Copy to clipboard
      await Clipboard.setStringAsync(shareLink);
      
      // Increment share count
      await orpcClient.sharePost(post.id);
      setSharesCount(prev => prev + 1);
      
      // Show toast
      toast.success('Link Copied!', {
        description: 'Post link copied to clipboard',
        duration: 2000,
      });
    } catch (error) {
      console.error('Failed to share post:', error);
      toast.error('Share Failed', {
        description: 'Could not copy link',
        duration: 2000,
      });
    }
  };

  const handleFollow = async () => {
    try {
      const result = await orpcClient.followUser(post.userId);
      setIsFollowing(result.following);
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  };

  const handleProductTap = (productId: string) => {
    router.push(`/shop/product-detail?id=${productId}`);
  };

  const handleEdit = () => {
    router.push(`/fashion/create-post?editId=${post.id}`);
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <View style={styles.container}>
      {/* 3D Scene */}
      <FashionScene3D
        items={post.items}
        textElements={post.textElements}
        is3DMode={post.sceneMode === '3d'}
        backgroundColor={(post as any).backgroundColor || 'floor'}
        onTextElementMove={() => {}}
        onTextElementTap={() => {}}
      />

      {/* Gradient Overlay at Bottom */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.bottomGradient}
      />

      {/* User Info & Caption */}
      <View style={styles.infoContainer}>
        <TouchableOpacity style={styles.userInfo}>
          <View style={styles.avatarWithFollow}>
            {post.userImage ? (
              <Image source={{ uri: post.userImage }} style={styles.userAvatar} />
            ) : (
              <View style={[styles.userAvatar, styles.userAvatarPlaceholder]}>
                <ThemedText style={styles.userAvatarText}>
                  {post.userName?.charAt(0).toUpperCase() || 'U'}
                </ThemedText>
              </View>
            )}
            {/* Only show follow button for other users' posts when not following */}
            {!isOwnPost && !isFollowing && (
              <TouchableOpacity style={styles.followButtonBottom} onPress={handleFollow}>
                <ThemedText style={styles.followButtonText}>+</ThemedText>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.userDetails}>
            <ThemedText style={styles.userName}>{post.userName || 'User'}</ThemedText>
            
            {/* Product Names as Badges */}
            {post.items.length > 0 && (
              <View style={styles.productBadges}>
                {post.items.slice(0, 3).map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.productBadge}
                    onPress={() => handleProductTap(item.productId)}
                  >
                    <ThemedText style={styles.productBadgeText} numberOfLines={1}>
                      {item.productName || 'Product'}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
                {post.items.length > 3 && (
                  <View style={styles.productBadge}>
                    <ThemedText style={styles.productBadgeText}>
                      +{post.items.length - 3}
                    </ThemedText>
                  </View>
                )}
              </View>
            )}
            
            {post.caption && (
              <View style={styles.captionWrapper}>
                <CaptionDisplay caption={post.caption} maxLines={5} />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Right Side Actions */}
      <View style={styles.actionsContainer}>
        {/* Edit Button - Only for own posts */}
        {isOwnPost && (
          <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
            <Pencil size={24} color="#fff" />
          </TouchableOpacity>
        )}

        {/* Like */}
        <View style={styles.actionItem}>
          <TouchableOpacity onPress={handleLike}>
            <Heart 
              size={32} 
              color={isLiked ? "#ff4444" : "#000"}
              fill={isLiked ? "#ff4444" : "none"}
            />
          </TouchableOpacity>
          <ThemedText style={[styles.actionCount, styles.actionCountBlack]}>{formatCount(likesCount)}</ThemedText>
        </View>

        {/* Save */}
        <View style={styles.actionItem}>
          <TouchableOpacity onPress={handleSave}>
            <Bookmark 
              size={32} 
              color={isSaved ? AppTheme.colors.primary : "#000"}
              fill={isSaved ? AppTheme.colors.primary : "none"}
            />
          </TouchableOpacity>
          <ThemedText style={[styles.actionCount, styles.actionCountBlack]}>{formatCount(savesCount)}</ThemedText>
        </View>

        {/* Share - Hidden for own posts */}
        {!isOwnPost && (
          <View style={styles.actionItem}>
            <TouchableOpacity onPress={handleShare}>
              <Share2 size={32} color="#000" />
            </TouchableOpacity>
            <ThemedText style={[styles.actionCount, styles.actionCountBlack]}>{formatCount(sharesCount)}</ThemedText>
          </View>
        )}
      </View>

      {/* Published/Draft Badge - Only for own posts */}
      {isOwnPost && (
        <View style={styles.statusBadge}>
          <View style={[
            styles.badge,
            post.isDraft ? styles.badgeDraft : styles.badgePublished
          ]}>
            <ThemedText style={styles.badgeText}>
              {post.isDraft ? 'Draft' : 'Published'}
            </ThemedText>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 120, // Adjust for header and bottom bar
    backgroundColor: '#000',
    position: 'relative',
    overflow: 'hidden', // Prevent content from showing outside bounds
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    pointerEvents: 'none',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 80,
    padding: AppTheme.spacing.md,
    maxHeight: '40%',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: AppTheme.spacing.sm,
  },
  avatarWithFollow: {
    position: 'relative',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  userAvatarPlaceholder: {
    backgroundColor: AppTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: AppTheme.fontWeight.bold,
  },
  followButtonBottom: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  followButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: AppTheme.fontWeight.bold,
    lineHeight: 16,
  },
  userDetails: {
    flex: 1,
    gap: 4,
  },
  userName: {
    fontSize: AppTheme.fontSize.md,
    fontWeight: AppTheme.fontWeight.bold,
    color: '#fff',
  },
  productBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  productBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: AppTheme.borderRadius.full,
    maxWidth: 150,
  },
  productBadgeText: {
    fontSize: AppTheme.fontSize.xs,
    fontWeight: AppTheme.fontWeight.semibold,
    color: AppTheme.colors.foreground,
  },
  captionWrapper: {
    width: '100%',
    marginTop: 4,
  },
  actionsContainer: {
    position: 'absolute',
    right: AppTheme.spacing.md,
    bottom: 120,
    gap: AppTheme.spacing.lg,
    alignItems: 'center',
  },
  actionItem: {
    alignItems: 'center',
    gap: 4,
  },
  actionCount: {
    fontSize: AppTheme.fontSize.xs,
    color: '#fff',
    fontWeight: AppTheme.fontWeight.semibold,
  },
  actionCountBlack: {
    color: '#000',
  },
  editButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: AppTheme.spacing.md,
  },
  statusBadge: {
    position: 'absolute',
    top: AppTheme.spacing.md,
    right: AppTheme.spacing.md,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: AppTheme.borderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  badgePublished: {
    backgroundColor: '#10b981',
  },
  badgeDraft: {
    backgroundColor: '#f59e0b',
  },
  badgeText: {
    color: '#fff',
    fontSize: AppTheme.fontSize.xs,
    fontWeight: AppTheme.fontWeight.bold,
  },
});
