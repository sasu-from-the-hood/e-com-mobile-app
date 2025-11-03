import { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, Camera } from 'lucide-react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { File } from 'expo-file-system';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/Avatar';
import { PrimaryButton } from '@/components/onboarding/primary-button';
import { AppTheme } from '@/constants/app-theme';
import { showToast } from '@/utils/toast';
import { authClient } from '@/lib/auth-client';
import { useAuth } from '@/hooks/useAuth';
import { ImagePickerBottomSheet } from '@/components/ui/ImagePickerBottomSheet';
import { orpcClient } from '@/lib/orpc-client';
import { authConfig } from '@/config/auth.config';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, checkAuth } = useAuth();
  const [name, setName] = useState(user?.user_metadata?.name || user?.name || user?.email || '');
  const [avatar, setAvatar] = useState(user?.image || user?.user_metadata?.avatar || user?.avatar);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [hasNewImage, setHasNewImage] = useState(false);

  // Track initial values
  const initialName = user?.name;
  const initialAvatar = user?.image;
  
  // Check for changes
  const nameChanged = name.trim() !== '' && name.trim() !== initialName;
  const imageChanged = hasNewImage && avatar && avatar !== initialAvatar;
  const passwordChanged = newPassword.trim().length > 0;
  
  const hasChanges = nameChanged || imageChanged || passwordChanged;

  const pickImage = () => {
    setShowImagePicker(true);
  };

  const handleCamera = () => {
    setShowImagePicker(false);
    openCamera();
  };

  const handleGallery = () => {
    setShowImagePicker(false);
    openGallery();
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      showToast('error', 'Camera permission required');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      cropImage(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showToast('error', 'Gallery permission required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      cropImage(result.assets[0].uri);
    }
  };

  const cropImage = async (uri: string) => {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 300, height: 300 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      setAvatar(manipResult.uri);
      setHasNewImage(true);
    } catch (error) {
      showToast('error', 'Failed to process image');
    }
  };

  const uploadAvatar = async (imageUri: string) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const base64Data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64.split(',')[1]); // Remove data:image/jpeg;base64, prefix
        };
        reader.readAsDataURL(blob);
      });
      
      const fileData = {
        data: base64Data,
        type: blob.type || 'image/jpeg',
        name: 'avatar.jpg',
        oldImageUrl: user?.image
      };
      
      
      const result = await orpcClient.uploadAvatar({ image: fileData });
      return `${authConfig.baseURL}${result.imageUrl}`;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload image');
    }
  };

  const handleUpdateProfile = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      showToast('error', 'Passwords do not match');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      showToast('error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = undefined;
      
      // Upload avatar only if image actually changed
      if (imageChanged) {
        imageUrl = await uploadAvatar(avatar);
      }
      
      await authClient.updateUser({
        name: name || user?.name || user?.user_metadata?.name || user?.email || '',
        image: imageUrl,
      });
      
      // If password change requested
      if (newPassword && currentPassword) {
        await authClient.changePassword({
          currentPassword,
          newPassword,
        });
        showToast('success', 'Password updated successfully');
      }
      
      showToast('success', 'Profile updated successfully');
      await checkAuth(); // Refresh user data
      router.back();
    } catch (error: any) {
      showToast('error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={AppTheme.colors.foreground} />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Edit Profile</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Profile Picture</ThemedText>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Avatar
                source={avatar || user?.image}
                name={user?.name || user?.email}
                size={120}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
                <Camera size={16} color="white" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={pickImage}>
              <ThemedText style={styles.changePhotoText}>Change Photo</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        <ImagePickerBottomSheet
          visible={showImagePicker}
          onClose={() => setShowImagePicker(false)}
          onCamera={handleCamera}
          onGallery={handleGallery}
        />

        <View style={styles.section}>
          <ThemedText style={styles.label}>Name</ThemedText>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder={"Before name '" + user?.name + "'"  || 'Enter your name'}
            placeholderTextColor={AppTheme.colors.mutedForeground}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Change Password</ThemedText>
          
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Current Password</ThemedText>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor={AppTheme.colors.mutedForeground}
                secureTextEntry={!showCurrentPassword}
              />
              <TouchableOpacity
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                style={styles.eyeButton}
              >
                {showCurrentPassword ? (
                  <EyeOff size={20} color={AppTheme.colors.mutedForeground} />
                ) : (
                  <Eye size={20} color={AppTheme.colors.mutedForeground} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>New Password</ThemedText>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor={AppTheme.colors.mutedForeground}
                secureTextEntry={!showNewPassword}
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                style={styles.eyeButton}
              >
                {showNewPassword ? (
                  <EyeOff size={20} color={AppTheme.colors.mutedForeground} />
                ) : (
                  <Eye size={20} color={AppTheme.colors.mutedForeground} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Confirm New Password</ThemedText>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor={AppTheme.colors.mutedForeground}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeButton}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color={AppTheme.colors.mutedForeground} />
                ) : (
                  <Eye size={20} color={AppTheme.colors.mutedForeground} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title={hasChanges ? "Update Profile" : "Back"}
          onPress={hasChanges ? handleUpdateProfile : () => router.back()}
          loading={loading}
        />
      </View>
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
  title: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.bold,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: AppTheme.spacing.md,
  },
  section: {
    marginBottom: AppTheme.spacing.xl,
  },
  sectionTitle: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.bold,
    marginBottom: AppTheme.spacing.md,
  },
  label: {
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.medium,
    marginBottom: AppTheme.spacing.sm,
    color: AppTheme.colors.foreground,
  },
  input: {
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.borderRadius.md,
    padding: AppTheme.spacing.md,
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.foreground,
  },
  inputContainer: {
    marginBottom: AppTheme.spacing.md,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.borderRadius.md,
  },
  passwordInput: {
    flex: 1,
    padding: AppTheme.spacing.md,
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.foreground,
  },
  eyeButton: {
    padding: AppTheme.spacing.md,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: AppTheme.spacing.md,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'visible',
    position: 'relative',
    marginBottom: AppTheme.spacing.sm,
    ...AppTheme.shadows.medium,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AppTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: AppTheme.colors.background,
    ...AppTheme.shadows.small,
  },
  changePhotoText: {
    color: AppTheme.colors.primary,
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.medium,
  },
  footer: {
    padding: AppTheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.border,
  },
});