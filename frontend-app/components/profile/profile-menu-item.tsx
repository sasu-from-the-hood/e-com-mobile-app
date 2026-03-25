import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';

export interface ProfileMenuItemProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onPress: () => void;
  showChevron?: boolean;
  destructive?: boolean;
}

export function ProfileMenuItem({ title, subtitle, icon, onPress, showChevron = true, destructive = false }: ProfileMenuItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <View style={styles.textContainer}>
        <ThemedText style={[styles.title, destructive && styles.destructiveText]}>{title}</ThemedText>
        {subtitle && <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>}
      </View>
      {showChevron && <ChevronRight size={20} color={AppTheme.colors.mutedForeground} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: AppTheme.spacing.md,
    backgroundColor: AppTheme.colors.background,
    borderRadius: AppTheme.borderRadius.md,
    marginBottom: AppTheme.spacing.sm,
    ...AppTheme.shadows.small,
  },
  iconContainer: {
    marginRight: AppTheme.spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.medium,
  },
  subtitle: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.mutedForeground,
    marginTop: 2,
  },
  destructiveText: {
    color: AppTheme.colors.destructive,
  },
});