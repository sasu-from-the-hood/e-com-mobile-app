import { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { ChevronLeft, CreditCard, Plus } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';
import type { PaymentMethodData } from '@/types/schema';

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodData[]>([]);

  const handleAddPayment = () => {
    Alert.alert('Add Payment Method', 'This feature will allow you to add a new payment method.');
  };

  const handleSelectPayment = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color={AppTheme.colors.foreground} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Payment Methods</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Add New Payment Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddPayment} activeOpacity={0.7}>
          <View style={styles.addIconContainer}>
            <Plus size={24} color={AppTheme.colors.primary} />
          </View>
          <ThemedText style={styles.addButtonText}>Add New Payment Method</ThemedText>
        </TouchableOpacity>

        {/* Payment Methods List */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Saved Cards</ThemedText>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentCard,
                method.isDefault && styles.paymentCardActive,
              ]}
              onPress={() => handleSelectPayment(method.id)}
              activeOpacity={0.7}
            >
              <View style={styles.cardIconContainer}>
                <CreditCard size={24} color={AppTheme.colors.primary} />
              </View>
              <View style={styles.cardInfo}>
                <ThemedText style={styles.cardType}>{method.type}</ThemedText>
                <ThemedText style={styles.cardNumber}>{method.cardNumber}</ThemedText>
                <ThemedText style={styles.cardExpiry}>Expires {method.expiryDate}</ThemedText>
              </View>
              {method.isDefault && (
                <View style={styles.defaultBadge}>
                  <ThemedText style={styles.defaultText}>Default</ThemedText>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppTheme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.bold,
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: AppTheme.spacing.md,
    paddingBottom: 100,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: AppTheme.spacing.md,
    backgroundColor: AppTheme.colors.secondary,
    borderRadius: AppTheme.borderRadius.md,
    marginBottom: AppTheme.spacing.xl,
    borderWidth: 2,
    borderColor: AppTheme.colors.primary,
    borderStyle: 'dashed',
  },
  addIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: AppTheme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: AppTheme.spacing.md,
  },
  addButtonText: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.semibold,
    color: AppTheme.colors.primary,
  },
  section: {
    marginBottom: AppTheme.spacing.xl,
  },
  sectionTitle: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.bold,
    marginBottom: AppTheme.spacing.md,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: AppTheme.spacing.md,
    backgroundColor: AppTheme.colors.background,
    borderRadius: AppTheme.borderRadius.md,
    marginBottom: AppTheme.spacing.sm,
    borderWidth: 2,
    borderColor: AppTheme.colors.border,
    ...AppTheme.shadows.small,
  },
  paymentCardActive: {
    borderColor: AppTheme.colors.primary,
    backgroundColor: AppTheme.colors.secondary,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: AppTheme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: AppTheme.spacing.md,
  },
  cardInfo: {
    flex: 1,
  },
  cardType: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.semibold,
    marginBottom: 2,
  },
  cardNumber: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.mutedForeground,
    marginBottom: 2,
  },
  cardExpiry: {
    fontSize: AppTheme.fontSize.xs,
    color: AppTheme.colors.mutedForeground,
  },
  defaultBadge: {
    backgroundColor: AppTheme.colors.primary,
    paddingHorizontal: AppTheme.spacing.sm,
    paddingVertical: 4,
    borderRadius: AppTheme.borderRadius.sm,
  },
  defaultText: {
    color: AppTheme.colors.primaryForeground,
    fontSize: AppTheme.fontSize.xs,
    fontWeight: AppTheme.fontWeight.semibold,
  },
});