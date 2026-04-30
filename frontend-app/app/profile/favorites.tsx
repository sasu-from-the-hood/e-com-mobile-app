import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, FlatList, ViewToken } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useFocusEffect } from 'expo-router';
import { Plus, Users, Inbox } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';
import { BottomTabBar } from '@/components/navigation/bottom-tab-bar';
import { FashionPostCard } from '@/components/fashion/fashion-post-card';
import { useFashionFeed } from '@/hooks/useFashionFeed';
import { orpcClient } from '@/lib/orpc-client';
import { Toaster } from 'sonner-native';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

type TabType = 'feed' | 'you';

export default function FashionFeedScreen() {
  const router = useRouter();
  const { posts: feedPosts, loading: feedLoading, loadMore: loadMoreFeed, refetch: refetchFeed } = useFashionFeed();
  const [activeTab, setActiveTab] = useState<TabType>('feed');
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [myPostsLoading, setMyPostsLoading] = useState(false);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  // Load user's own posts when switching to "You" tab
  const loadMyPosts = async () => {
    setMyPostsLoading(true);
    try {
      const posts = await orpcClient.getMyPosts({ limit: 20, offset: 0 });
      setMyPosts(posts);
    } catch (error) {
      console.error('Failed to load my posts:', error);
      setMyPosts([]);
    } finally {
      setMyPostsLoading(false);
    }
  };

  // Auto-refresh "You" tab when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (activeTab === 'you') {
        loadMyPosts();
      }
    }, [activeTab])
  );

  // Load my posts when tab changes to "You"
  React.useEffect(() => {
    if (activeTab === 'you') {
      loadMyPosts();
    }
  }, [activeTab]);

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const visiblePost = viewableItems[0];
      setActivePostId(visiblePost.item.id);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const currentPosts = activeTab === 'feed' ? feedPosts : myPosts;
  const currentLoading = activeTab === 'feed' ? feedLoading : myPostsLoading;

  const handleRefresh = () => {
    if (activeTab === 'feed') {
      refetchFeed();
    } else {
      loadMyPosts();
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Inbox size={64} color={AppTheme.colors.mutedForeground} />
      <ThemedText style={styles.emptyTitle}>
        {activeTab === 'feed' ? 'No Posts Yet' : 'No Posts'}
      </ThemedText>
      <ThemedText style={styles.emptyMessage}>
        {activeTab === 'feed' 
          ? 'Follow users to see their fashion posts here'
          : 'Create your first fashion post to get started'}
      </ThemedText>
      {activeTab === 'you' && (
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => router.push('/fashion/create-post')}
        >
          <Plus size={20} color="#fff" />
          <ThemedText style={styles.emptyButtonText}>Create Post</ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Header with Tabs */}
      <View style={styles.header}>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'feed' && styles.tabActive]}
            onPress={() => setActiveTab('feed')}
          >
            <ThemedText style={[styles.tabText, activeTab === 'feed' && styles.tabTextActive]}>
              Feed
            </ThemedText>
            {activeTab === 'feed' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'you' && styles.tabActive]}
            onPress={() => setActiveTab('you')}
          >
            <ThemedText style={[styles.tabText, activeTab === 'you' && styles.tabTextActive]}>
              You
            </ThemedText>
            {activeTab === 'you' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerRight}>
          {/* Create Post Button - Only show on "You" tab */}
          {activeTab === 'you' && (
            <TouchableOpacity
              style={styles.createButtonHeader}
              onPress={() => router.push('/fashion/create-post')}
            >
              <Plus size={24} color="#fff" />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.userButton}
            onPress={() => router.push('/fashion/following-list')}
          >
            <Users size={24} color={AppTheme.colors.foreground} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Feed */}
      <View style={styles.feedContainer}>
        {currentPosts.length === 0 && !currentLoading ? (
          renderEmptyState()
        ) : currentLoading && currentPosts.length === 0 ? (
          <View style={styles.loadingContainer}>
            <View style={styles.dotsContainer}>
              <View style={[styles.dot, styles.dot1]} />
              <View style={[styles.dot, styles.dot2]} />
              <View style={[styles.dot, styles.dot3]} />
            </View>
          </View>
        ) : (
            <FlatList
              ref={flatListRef}
              data={currentPosts}
              renderItem={({ item, index }) => (
                <View style={[
                  styles.postWrapper,
                  index === currentPosts.length - 1 && styles.lastPostWrapper
                ]}>
                  <FashionPostCard
                    post={item}
                    isActive={activePostId === item.id}
                    isOwnPost={activeTab === 'you'}
                  />
                </View>
              )}
              keyExtractor={(item) => item.id}
              pagingEnabled
              showsVerticalScrollIndicator={false}
              snapToInterval={SCREEN_HEIGHT - 120}
              snapToAlignment="start"
              decelerationRate="fast"
              disableIntervalMomentum={true}
              bounces={false}
              overScrollMode="never"
              scrollEventThrottle={16}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={viewabilityConfig}
              onEndReached={activeTab === 'feed' ? loadMoreFeed : undefined}
              onEndReachedThreshold={0.5}
              onRefresh={handleRefresh}
              refreshing={currentLoading}
              getItemLayout={(data, index) => ({
                length: SCREEN_HEIGHT - 120,
                offset: (SCREEN_HEIGHT - 120) * index,
                index,
              })}
              initialScrollIndex={0}
              removeClippedSubviews={true}
              contentContainerStyle={{ paddingBottom: 0 }}
            />
        )}
      </View>

      <BottomTabBar isVisible={true} />
      <Toaster position="bottom-center" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.background,
  },
  feedContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  postWrapper: {
    height: SCREEN_HEIGHT - 120,
    width: SCREEN_WIDTH,
    overflow: 'hidden',
  },
  lastPostWrapper: {
    marginBottom: 80, // Extra space to push last item above nav bar
  },
  tabs: {
    flexDirection: 'row',
    flex: 1,
    gap: AppTheme.spacing.xl,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.sm,
  },
  createButtonHeader: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AppTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tab: {
    paddingVertical: AppTheme.spacing.sm,
    position: 'relative',
  },
  tabActive: {
    // Active state handled by indicator
  },
  tabText: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.medium,
    color: AppTheme.colors.mutedForeground,
  },
  tabTextActive: {
    color: AppTheme.colors.foreground,
    fontWeight: AppTheme.fontWeight.bold,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -AppTheme.spacing.sm - 1,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: AppTheme.colors.primary,
    borderRadius: 2,
  },
  userButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AppTheme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: AppTheme.spacing.xl,
  },
  emptyTitle: {
    fontSize: AppTheme.fontSize.xxl,
    fontWeight: AppTheme.fontWeight.bold,
    marginTop: AppTheme.spacing.lg,
    marginBottom: AppTheme.spacing.sm,
  },
  emptyMessage: {
    fontSize: AppTheme.fontSize.md,
    color: AppTheme.colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: AppTheme.spacing.xl,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.sm,
    backgroundColor: AppTheme.colors.primary,
    paddingHorizontal: AppTheme.spacing.lg,
    paddingVertical: AppTheme.spacing.md,
    borderRadius: AppTheme.borderRadius.full,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: AppTheme.fontSize.md,
    fontWeight: AppTheme.fontWeight.semibold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: AppTheme.colors.primary,
  },
  dot1: {
    animation: 'pulse 1.4s infinite ease-in-out',
    animationDelay: '0s',
  },
  dot2: {
    animation: 'pulse 1.4s infinite ease-in-out',
    animationDelay: '0.2s',
  },
  dot3: {
    animation: 'pulse 1.4s infinite ease-in-out',
    animationDelay: '0.4s',
  },
});
