import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';

export interface ProfileMenuItemProps {
  title: string;
  icon?: React.ReactNode;
  onPress: () => void;
  showChevron?: boolean;
}

export function ProfileMenuItem({ title, icon, onPress, showChevron = true }: ProfileMenuItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <ThemedText style={styles.title}>{title}</ThemedText>
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
  title: {
    flex: 1,
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.medium,
  },
});