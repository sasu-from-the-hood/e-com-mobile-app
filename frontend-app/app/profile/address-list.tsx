import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Plus, Edit, Trash2, MapPin, Navigation } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/onboarding/primary-button';
import { ProductSkeleton } from '@/components/shop/product-skeleton';
import { EthiopianPhoneInput } from '@/components/ui/ethiopian-phone-input';
import { MapPicker } from '@/components/ui/map-picker';
import { AppTheme } from '@/constants/app-theme';
import { validateRequired, validatePhone, validateZipCode } from '@/utils/validators';
import { useAddresses } from '@/hooks/useAddresses';
import { useAuth } from '@/hooks/useAuth';
import { getCurrentLocation } from '@/services/location';
import type { AddressForm } from '@/types/schema';

export default function AddressListScreen() {
  const { addresses, loading, addAddress, updateAddress, deleteAddress } = useAddresses();
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AddressForm>({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Ethiopia',
    latitude: '',
    longitude: '',
    instructions: '',
    isDefault: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddNew = async () => {
    const locationData = await getCurrentLocation();
    
    setFormData({
      fullName: user?.name || '',
      phone: user?.phone || '',
      addressLine1: '',
      addressLine2: '',
      city: locationData?.city || '',
      state: locationData?.state || '',
      zipCode: '',
      country: 'Ethiopia',
      latitude: locationData?.latitude?.toString() || '',
      longitude: locationData?.longitude?.toString() || '',
      instructions: '',
      isDefault: false
    });
    setEditingId(null);
    setErrors({});
    setShowAddModal(true);
  };

  const handleEdit = (address: AddressForm) => {
    setFormData(address);
    setEditingId(address.id || null);
    setErrors({});
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAddress(id);
    } catch (error) {
      console.error('Delete address error:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!validateRequired(formData.fullName)) newErrors.fullName = 'Name is required';
    if (formData.phone && !validatePhone(formData.phone)) newErrors.phone = 'Invalid phone number';
    if (!validateRequired(formData.addressLine1)) newErrors.addressLine1 = 'Address is required';
    if (!validateRequired(formData.city)) newErrors.city = 'City is required';
    if (!validateRequired(formData.state)) newErrors.state = 'State is required';
    if (!validateZipCode(formData.zipCode)) newErrors.zipCode = 'Invalid zip code';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLocationSelect = (latitude: number, longitude: number) => {
    setFormData({
      ...formData,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    });
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (editingId) {
        await updateAddress(editingId, formData);
      } else {
        await addAddress(formData);
      }
      setShowAddModal(false);
    } catch (error) {
      console.error('Save address error:', error);
    }
  };

  const renderAddress = ({ item }: { item: AddressForm }) => (
    <View style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <ThemedText style={styles.addressName}>{item.fullName}</ThemedText>
        {item.isDefault && (
          <View style={styles.defaultBadge}>
            <ThemedText style={styles.defaultText}>Default</ThemedText>
          </View>
        )}
      </View>
      <ThemedText style={styles.addressText}>{item.addressLine1}</ThemedText>
      {item.addressLine2 ? <ThemedText style={styles.addressText}>{item.addressLine2}</ThemedText> : null}
      <ThemedText style={styles.addressText}>
        {item.city}, {item.state} {item.zipCode}
      </ThemedText>
      <ThemedText style={styles.addressText}>{item.country}</ThemedText>
      <ThemedText style={styles.addressPhone}>{item.phone}</ThemedText>
      
      <View style={styles.addressActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleEdit(item)}>
          <Edit size={18} color={AppTheme.colors.primary} />
          <ThemedText style={styles.actionText}>Edit</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item.id!)}>
          <Trash2 size={18} color={AppTheme.colors.error} />
          <ThemedText style={[styles.actionText, { color: AppTheme.colors.error }]}>Delete</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>My Addresses</ThemedText>
        <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
          <Plus size={24} color={AppTheme.colors.primaryForeground} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.content}>
          <ProductSkeleton />
        </View>
      ) : addresses.length === 0 ? (
        <View style={styles.content}>
          <ThemedText style={styles.emptyText}>No addresses found</ThemedText>
        </View>
      ) : (
        <FlatList
          data={addresses}
          renderItem={renderAddress}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>
              {editingId ? 'Edit Address' : 'Add New Address'}
            </ThemedText>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <ThemedText style={styles.cancelText}>Cancel</ThemedText>
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView contentContainerStyle={styles.formContent}>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Full Name *</ThemedText>
                <TextInput
                  style={[styles.input, errors.fullName && styles.inputError]}
                  value={formData.fullName}
                  onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                  placeholder="Enter full name"
                  placeholderTextColor={AppTheme.colors.mutedForeground}
                />
                {errors.fullName ? <ThemedText style={styles.errorText}>{errors.fullName}</ThemedText> : null}
              </View>

              <EthiopianPhoneInput
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                error={errors.phone}
              />

              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Address Line 1 *</ThemedText>
                <TextInput
                  style={[styles.input, errors.addressLine1 && styles.inputError]}
                  value={formData.addressLine1}
                  onChangeText={(text) => setFormData({ ...formData, addressLine1: text })}
                  placeholder="Street address"
                  placeholderTextColor={AppTheme.colors.mutedForeground}
                />
                {errors.addressLine1 ? <ThemedText style={styles.errorText}>{errors.addressLine1}</ThemedText> : null}
              </View>

              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Address Line 2</ThemedText>
                <TextInput
                  style={styles.input}
                  value={formData.addressLine2}
                  onChangeText={(text) => setFormData({ ...formData, addressLine2: text })}
                  placeholder="Apartment, suite, etc. (optional)"
                  placeholderTextColor={AppTheme.colors.mutedForeground}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <ThemedText style={styles.label}>City *</ThemedText>
                  <TextInput
                    style={[styles.input, errors.city && styles.inputError]}
                    value={formData.city}
                    onChangeText={(text) => setFormData({ ...formData, city: text })}
                    placeholder="City"
                    placeholderTextColor={AppTheme.colors.mutedForeground}
                  />
                  {errors.city ? <ThemedText style={styles.errorText}>{errors.city}</ThemedText> : null}
                </View>

                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <ThemedText style={styles.label}>State *</ThemedText>
                  <TextInput
                    style={[styles.input, errors.state && styles.inputError]}
                    value={formData.state}
                    onChangeText={(text) => setFormData({ ...formData, state: text })}
                    placeholder="State"
                    placeholderTextColor={AppTheme.colors.mutedForeground}
                  />
                  {errors.state ? <ThemedText style={styles.errorText}>{errors.state}</ThemedText> : null}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Zip Code *</ThemedText>
                <TextInput
                  style={[styles.input, errors.zipCode && styles.inputError]}
                  value={formData.zipCode}
                  onChangeText={(text) => setFormData({ ...formData, zipCode: text })}
                  placeholder="Zip code"
                  placeholderTextColor={AppTheme.colors.mutedForeground}
                  keyboardType="number-pad"
                />
                {errors.zipCode ? <ThemedText style={styles.errorText}>{errors.zipCode}</ThemedText> : null}
              </View>

              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Location on Map</ThemedText>
                <TouchableOpacity 
                  style={styles.mapButton} 
                  onPress={() => setShowMapPicker(true)}
                >
                  <MapPin size={20} color={AppTheme.colors.primary} />
                  <ThemedText style={styles.mapButtonText}>
                    {formData.latitude && formData.longitude ? 'Update Location' : 'Select on Map'}
                  </ThemedText>
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Delivery Instructions</ThemedText>
                <TextInput
                  style={[styles.textArea]}
                  value={formData.instructions}
                  onChangeText={(text) => setFormData({ ...formData, instructions: text })}
                  placeholder="Special delivery instructions (optional)"
                  placeholderTextColor={AppTheme.colors.mutedForeground}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              <PrimaryButton title="Save Address" onPress={handleSave} />
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      <MapPicker
        visible={showMapPicker}
        onClose={() => setShowMapPicker(false)}
        onLocationSelect={handleLocationSelect}
        initialLatitude={formData.latitude ? parseFloat(formData.latitude) : 9.0320}
        initialLongitude={formData.longitude ? parseFloat(formData.longitude) : 38.7469}
      />
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
  headerTitle: {
    fontSize: AppTheme.fontSize.xxl,
    fontWeight: AppTheme.fontWeight.bold,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: AppTheme.spacing.md,
  },
  addressCard: {
    backgroundColor: AppTheme.colors.background,
    borderRadius: AppTheme.borderRadius.md,
    padding: AppTheme.spacing.md,
    marginBottom: AppTheme.spacing.md,
    ...AppTheme.shadows.small,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.sm,
  },
  addressName: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.bold,
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
  addressText: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.mutedForeground,
    marginBottom: 2,
  },
  addressPhone: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.foreground,
    marginTop: 4,
  },
  addressActions: {
    flexDirection: 'row',
    gap: AppTheme.spacing.md,
    marginTop: AppTheme.spacing.md,
    paddingTop: AppTheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.medium,
    color: AppTheme.colors.primary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  modalTitle: {
    fontSize: AppTheme.fontSize.xl,
    fontWeight: AppTheme.fontWeight.bold,
  },
  cancelText: {
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.primary,
    fontWeight: AppTheme.fontWeight.medium,
  },
  keyboardView: {
    flex: 1,
  },
  formContent: {
    padding: AppTheme.spacing.md,
    gap: AppTheme.spacing.md,
  },
  inputContainer: {
    gap: AppTheme.spacing.sm,
  },
  label: {
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.medium,
  },
  input: {
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.borderRadius.md,
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.md,
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.foreground,
  },
  inputError: {
    borderColor: AppTheme.colors.error,
  },
  errorText: {
    fontSize: AppTheme.fontSize.xs,
    color: AppTheme.colors.error,
  },
  row: {
    flexDirection: 'row',
    gap: AppTheme.spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.mutedForeground,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.sm,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.borderRadius.md,
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.md,
    backgroundColor: AppTheme.colors.background,
  },
  mapButtonText: {
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.primary,
    fontWeight: AppTheme.fontWeight.medium,
  },
  textArea: {
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.borderRadius.md,
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.md,
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.foreground,
    minHeight: 80,
  },
});