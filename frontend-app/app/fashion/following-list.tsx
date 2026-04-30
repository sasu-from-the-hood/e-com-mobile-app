import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft, UserPlus, UserMinus } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';
import { orpcClient } from '@/lib/orpc-client';

interface User {
  id: string;
  name: string;
  image: string | null;
  email: string;
  followedAt: string;
}

export default function FollowingListScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>('following');
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadFollowLists();
  }, []);

  const loadFollowLists = async () => {
    try {
      const result = await orpcClient.getFollowLists({});
      setFollowers(result.followers);
      setFollowing(result.following);
      setFollowingIds(new Set(result.following.map((u: User) => u.id)));
    } catch (error) {
      console.error('Failed to load follow lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      const result = await orpcClient.followUser(userId);
      
      if (result.following) {
        setFollowingIds(prev => new Set([...prev, userId]));
      } else {
        setFollowingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      }
      
      // Reload lists to update counts
      await loadFollowLists();
    } catch (error) {
      console.error('Failed to follow/unfollow user:', error);
    }
  };

  const renderUser = (user: User) => {
    const isFollowing = followingIds.has(user.id);
    
    return (
      <View key={user.id} style={styles.userItem}>
        <View style={styles.userInfo}>
          {user.image ? (
            <Image source={{ uri: user.image }} style={styles.userAvatar} />
          ) : (
            <View style={[styles.userAvatar, styles.userAvatarPlaceholder]}>
              <ThemedText style={styles.userAvatarText}>
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </ThemedText>
            </View>
          )}
          <View style={styles.userDetails}>
            <ThemedText style={styles.userName}>{user.name || 'User'}</ThemedText>
            <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
          </View>
        </View>
        
        <TouchableOpacity
          style={[styles.followButton, isFollowing && styles.followingButton]}
          onPress={() => handleFollow(user.id)}
        >
          {isFollowing ? (
            <>
              <UserMinus size={16} color="#666" />
              <ThemedText style={styles.followingButtonText}>Following</ThemedText>
            </>
          ) : (
            <>
              <UserPlus size={16} color="#fff" />
              <ThemedText style={styles.followButtonText}>Follow</ThemedText>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar style="dark" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={AppTheme.colors.foreground} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Connections</ThemedText>
          <View style={styles.headerRight} />
        </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'followers' && styles.tabActive]}
          onPress={() => setActiveTab('followers')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'followers' && styles.tabTextActive]}>
            Followers ({followers.length})
          </ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'following' && styles.tabActive]}
          onPress={() => setActiveTab('following')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'following' && styles.tabTextActive]}>
            Following ({following.length})
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AppTheme.colors.primary} />
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'followers' ? (
            followers.length === 0 ? (
              <View style={styles.emptyState}>
                <ThemedText style={styles.emptyText}>No followers yet</ThemedText>
              </View>
            ) : (
              followers.map(renderUser)
            )
          ) : (
            following.length === 0 ? (
              <View style={styles.emptyState}>
                <ThemedText style={styles.emptyText}>Not following anyone yet</ThemedText>
              </View>
            ) : (
              following.map(renderUser)
            )
          )}
        </ScrollView>
      )}
    </SafeAreaView>
    </>
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
    paddingVertical: AppTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  backButton: {
    padding: AppTheme.spacing.xs,
  },
  headerTitle: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.bold,
  },
  headerRight: {
    width: 40,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: AppTheme.spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: AppTheme.colors.primary,
  },
  tabText: {
    fontSize: AppTheme.fontSize.md,
    color: AppTheme.colors.mutedForeground,
  },
  tabTextActive: {
    color: AppTheme.colors.primary,
    fontWeight: AppTheme.fontWeight.semibold,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: AppTheme.spacing.xxl,
  },
  emptyText: {
    fontSize: AppTheme.fontSize.md,
    color: AppTheme.colors.mutedForeground,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: AppTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: AppTheme.spacing.sm,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userAvatarPlaceholder: {
    backgroundColor: AppTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: AppTheme.fontWeight.bold,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: AppTheme.fontSize.md,
    fontWeight: AppTheme.fontWeight.semibold,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.mutedForeground,
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: AppTheme.colors.primary,
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.sm,
    borderRadius: AppTheme.borderRadius.full,
  },
  followButtonText: {
    color: '#fff',
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.semibold,
  },
  followingButton: {
    backgroundColor: AppTheme.colors.secondary,
  },
  followingButtonText: {
    color: '#666',
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.semibold,
  },
});
