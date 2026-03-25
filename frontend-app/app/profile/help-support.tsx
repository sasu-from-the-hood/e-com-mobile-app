import { View, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { ChevronLeft, Mail, Phone, HelpCircle, ChevronRight, Facebook, Instagram, Twitter } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';
import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/lib/orpc-client';

export default function HelpSupportScreen() {
  const router = useRouter();

  // Fetch app settings for contact info
  const { data: appSettings } = useQuery({
    queryKey: ['app-settings'],
    queryFn: () => orpc.getAppSettings({}),
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  // Fetch help articles (FAQs) - sorted by latest first
  const { data: helpArticles, isLoading: articlesLoading } = useQuery({
    queryKey: ['help-articles'],
    queryFn: async () => {
      const articles = await orpc.getHelpArticles({});
      // Sort by createdAt descending (latest first)
      return articles.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
  });

  const contactOptions = [
    {
      icon: Phone,
      title: 'Call',
      action: () => {
        const phone = appSettings?.contact_phone || '+251911234567';
        Linking.openURL(`tel:${phone.replace(/\s/g, '')}`);
      },
    },
    {
      icon: Mail,
      title: 'Email',
      action: () => {
        const email = appSettings?.contact_email || 'support@shop.com';
        Linking.openURL(`mailto:${email}`);
      },
    },
  ];

  const handleSocialPress = (platform: string) => {
    const url = appSettings?.[`${platform}_url`];
    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color={AppTheme.colors.foreground} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Help & Support</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Contact Options */}
        <View style={styles.section}>
          <View style={styles.contactButtons}>
            {contactOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.contactButton}
                  onPress={option.action}
                  activeOpacity={0.7}
                >
                  <Icon size={20} color={AppTheme.colors.primary} />
                  <ThemedText style={styles.contactButtonText}>{option.title}</ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Social Media */}
          <View style={styles.socialContainer}>
            <ThemedText style={styles.socialTitle}>Follow Us</ThemedText>
            <View style={styles.socialButtons}>
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialPress('facebook')}
                activeOpacity={0.7}
              >
                <Facebook size={24} color={AppTheme.colors.primaryForeground} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialPress('instagram')}
                activeOpacity={0.7}
              >
                <Instagram size={24} color={AppTheme.colors.primaryForeground} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.socialButton}
                onPress={() => handleSocialPress('twitter')}
                activeOpacity={0.7}
              >
                <Twitter size={24} color={AppTheme.colors.primaryForeground} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Browse Help Articles */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Help Articles</ThemedText>
            <TouchableOpacity onPress={() => router.push('/help')}>
              <ThemedText style={styles.viewAllText}>View All</ThemedText>
            </TouchableOpacity>
          </View>
          
          {articlesLoading ? (
            <View style={styles.loadingContainer}>
              <ThemedText style={styles.loadingText}>Loading articles...</ThemedText>
            </View>
          ) : helpArticles && helpArticles.length > 0 ? (
            <>
              {helpArticles.slice(0, 3).map((article: any) => (
                <TouchableOpacity
                  key={article.id}
                  style={styles.articleCard}
                  onPress={() => router.push(`/help/${article.id}`)}
                  activeOpacity={0.7}
                >
                  <View style={styles.articleContent}>
                    <ThemedText style={styles.articleTitle}>{article.title}</ThemedText>
                    <ThemedText style={styles.articleCategory}>{article.category}</ThemedText>
                  </View>
                  <ChevronRight size={20} color={AppTheme.colors.mutedForeground} />
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <HelpCircle size={48} color={AppTheme.colors.mutedForeground} />
              <ThemedText style={styles.emptyText}>No help articles available yet</ThemedText>
            </View>
          )}
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
  section: {
    marginBottom: AppTheme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.md,
  },
  sectionTitle: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.bold,
  },
  viewAllText: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.primary,
    fontWeight: AppTheme.fontWeight.medium,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: AppTheme.spacing.md,
    marginBottom: AppTheme.spacing.lg,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: AppTheme.spacing.sm,
    padding: AppTheme.spacing.md,
    backgroundColor: AppTheme.colors.background,
    borderRadius: AppTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  contactButtonText: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.medium,
  },
  socialContainer: {
    alignItems: 'center',
  },
  socialTitle: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.mutedForeground,
    marginBottom: AppTheme.spacing.sm,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: AppTheme.spacing.md,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: AppTheme.borderRadius.full,
    backgroundColor: AppTheme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...AppTheme.shadows.small,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: AppTheme.spacing.md,
    backgroundColor: AppTheme.colors.background,
    borderRadius: AppTheme.borderRadius.md,
    marginBottom: AppTheme.spacing.sm,
    ...AppTheme.shadows.small,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: AppTheme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: AppTheme.spacing.md,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.semibold,
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.mutedForeground,
  },
  faqCard: {
    padding: AppTheme.spacing.md,
    backgroundColor: AppTheme.colors.secondary,
    borderRadius: AppTheme.borderRadius.md,
    marginBottom: AppTheme.spacing.sm,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.sm,
    gap: AppTheme.spacing.sm,
  },
  faqQuestion: {
    flex: 1,
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.semibold,
  },
  faqAnswer: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.mutedForeground,
    lineHeight: 20,
  },
  articleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: AppTheme.spacing.md,
    backgroundColor: AppTheme.colors.background,
    borderRadius: AppTheme.borderRadius.md,
    marginBottom: AppTheme.spacing.sm,
    ...AppTheme.shadows.small,
  },
  articleContent: {
    flex: 1,
  },
  articleTitle: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.medium,
    marginBottom: 4,
  },
  articleCategory: {
    fontSize: AppTheme.fontSize.xs,
    color: AppTheme.colors.mutedForeground,
  },
  loadingContainer: {
    padding: AppTheme.spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.mutedForeground,
  },
  emptyContainer: {
    padding: AppTheme.spacing.xl,
    alignItems: 'center',
    gap: AppTheme.spacing.md,
  },
  emptyText: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.mutedForeground,
    textAlign: 'center',
  },
});