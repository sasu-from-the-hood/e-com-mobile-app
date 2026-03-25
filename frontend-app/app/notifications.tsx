import { FlatList, View, TouchableOpacity, StyleSheet, SectionList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Package, Tag, Bell, CheckCheck } from 'lucide-react-native';
import { useState, useRef } from 'react';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';
import { formatDate, formatTime } from '@/utils/formatters';
import { useNotifications } from '@/hooks/useNotifications';
import type { Notification } from '@/types/schema';

export default function NotificationsScreen() {
  const { notifications, markAsRead, markAllAsRead, unreadCount, loading, refetch } = useNotifications();
  const [refreshing, setRefreshing] = useState(false);
  
  const groupedNotifications = notifications.reduce((acc: any, notification: any) => {
    const category = notification.category || 'general';
    if (!acc[category]) acc[category] = [];
    acc[category].push(notification);
    return acc;
  }, {});
  
  const sections = Object.keys(groupedNotifications).map(category => ({
    title: category.charAt(0).toUpperCase() + category.slice(1),
    data: groupedNotifications[category]
  }));
  const getIcon = (type: string) => {
    switch (type) {
      case 'Order Update':
        return <Package size={24} color={AppTheme.colors.primary} />;
      case 'Promotional':
        return <Tag size={24} color={AppTheme.colors.warning} />;
      default:
        return <Bell size={24} color={AppTheme.colors.info} />;
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationCard, !item.read && styles.notificationUnread]}
      activeOpacity={0.7}
      onPress={() => !item.read && markAsRead(item.id)}
    >
      <View style={styles.iconContainer}>
        {getIcon(item.type)}
      </View>
      <View style={styles.content}>
        <View style={styles.notificationHeader}>
          <ThemedText style={styles.title}>{item.title}</ThemedText>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        <ThemedText style={styles.message}>{item.message}</ThemedText>
        <ThemedText style={styles.timestamp}>
          {formatDate(new Date(item.createdAt))} at {formatTime(new Date(item.createdAt))}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.pageHeader}>
        <ThemedText style={styles.headerTitle}>Notifications</ThemedText>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
            <CheckCheck size={16} color={AppTheme.colors.primary} />
            <ThemedText style={styles.markAllText}>Mark All Read</ThemedText>
          </TouchableOpacity>
        )}
      </View>

      <SectionList
        sections={sections}
        renderItem={renderNotification}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, notifications.length === 0 && styles.emptyContainer]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyState}>
              <Bell size={64} color={AppTheme.colors.mutedForeground} />
              <ThemedText style={styles.emptyTitle}>No Notifications Yet</ThemedText>
              <ThemedText style={styles.emptyMessage}>
                You'll see notifications about your orders and promotions here
              </ThemedText>
            </View>
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await refetch();
              setRefreshing(false);
            }}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  markAllText: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.primary,
    fontWeight: AppTheme.fontWeight.medium,
  },
  sectionHeader: {
    paddingVertical: AppTheme.spacing.sm,
    paddingHorizontal: AppTheme.spacing.md,
    backgroundColor: AppTheme.colors.secondary,
  },
  sectionTitle: {
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.bold,
    color: AppTheme.colors.mutedForeground,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: AppTheme.fontSize.xxl,
    fontWeight: AppTheme.fontWeight.bold,
  },
  listContent: {
    padding: AppTheme.spacing.md,
  },
  notificationCard: {
    flexDirection: 'row',
    padding: AppTheme.spacing.md,
    backgroundColor: AppTheme.colors.background,
    borderRadius: AppTheme.borderRadius.md,
    marginBottom: AppTheme.spacing.md,
    ...AppTheme.shadows.small,
  },
  notificationUnread: {
    backgroundColor: AppTheme.colors.notificationUnread,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: AppTheme.borderRadius.md,
    backgroundColor: AppTheme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: AppTheme.spacing.md,
  },
  content: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.semibold,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppTheme.colors.primary,
    marginLeft: AppTheme.spacing.sm,
  },
  message: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.mutedForeground,
    marginBottom: 4,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: AppTheme.fontSize.xs,
    color: AppTheme.colors.mutedForeground,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: AppTheme.spacing.xxl * 2,
  },
  emptyTitle: {
    fontSize: AppTheme.fontSize.xl,
    fontWeight: AppTheme.fontWeight.bold,
    marginTop: AppTheme.spacing.lg,
    marginBottom: AppTheme.spacing.sm,
  },
  emptyMessage: {
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.mutedForeground,
    textAlign: 'center',
    paddingHorizontal: AppTheme.spacing.xl,
  },
});