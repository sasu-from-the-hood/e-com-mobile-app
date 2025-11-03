import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';

export interface TabNavigationProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <TouchableOpacity
            key={tab}
            style={styles.tab}
            onPress={() => onTabChange(tab)}
            activeOpacity={0.7}
          >
            <ThemedText style={[styles.tabText, isActive && styles.tabTextActive]}>
              {tab}
            </ThemedText>
            {isActive && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: AppTheme.spacing.md,
    marginBottom: AppTheme.spacing.md,
    gap: AppTheme.spacing.xl,
  },
  tab: {
    paddingVertical: AppTheme.spacing.sm,
    position: 'relative',
  },
  tabText: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.semibold,
    color: AppTheme.colors.mutedForeground,
  },
  tabTextActive: {
    color: AppTheme.colors.foreground,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: AppTheme.colors.primary,
    borderRadius: 2,
  },
});