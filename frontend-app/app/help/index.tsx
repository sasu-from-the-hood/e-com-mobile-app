import { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';
import { Search, ChevronRight, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/lib/orpc-client';

export default function HelpScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Fetch app settings for contact info
  const { data: appSettings } = useQuery({
    queryKey: ['app-settings'],
    queryFn: () => orpc.getAppSettings({}),
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  const { data: articles, isLoading } = useQuery({
    queryKey: ['help-articles'],
    queryFn: async () => {
      const data = await orpc.getHelpArticles({});
      // Sort by createdAt descending (latest first)
      return data.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
  });

  // Group articles by category
  const categories = articles?.reduce((acc: any, article: any) => {
    if (!acc[article.category]) {
      acc[article.category] = [];
    }
    acc[article.category].push(article);
    return acc;
  }, {}) || {};

  const filteredArticles = articles?.filter((article: any) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayCategories = selectedCategory
    ? { [selectedCategory]: categories[selectedCategory] }
    : categories;

  const handlePhonePress = () => {
    const phone = appSettings?.contact_phone || '+251911234567';
    Linking.openURL(`tel:${phone.replace(/\s/g, '')}`);
  };

  const handleEmailPress = () => {
    const email = appSettings?.contact_email || 'support@shop.com';
    Linking.openURL(`mailto:${email}`);
  };

  const handleSocialPress = (platform: string) => {
    const url = appSettings?.[`${platform}_url`];
    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <ThemedText style={styles.title}>Help & Support</ThemedText>
        <ThemedText style={styles.subtitle}>
          Find answers to common questions
        </ThemedText>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color={AppTheme.colors.mutedForeground} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search help articles..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={AppTheme.colors.mutedForeground}
        />
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        <TouchableOpacity
          style={[
            styles.categoryChip,
            !selectedCategory && styles.categoryChipActive
          ]}
          onPress={() => setSelectedCategory(null)}
        >
          <ThemedText
            style={[
              styles.categoryText,
              !selectedCategory && styles.categoryTextActive
            ]}
          >
            All
          </ThemedText>
        </TouchableOpacity>
        {Object.keys(categories).map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <ThemedText
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive
              ]}
            >
              {category}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ThemedText>Loading help articles...</ThemedText>
          </View>
        ) : searchQuery ? (
          // Show search results
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>
              Search Results ({filteredArticles?.length || 0})
            </ThemedText>
            {filteredArticles?.map((article: any) => (
              <TouchableOpacity
                key={article.id}
                style={styles.articleCard}
                onPress={() => router.push(`/help/${article.id}`)}
              >
                <View style={styles.articleContent}>
                  <ThemedText style={styles.articleTitle}>
                    {article.title}
                  </ThemedText>
                  <ThemedText style={styles.articleCategory}>
                    {article.category}
                  </ThemedText>
                </View>
                <ChevronRight size={20} color={AppTheme.colors.mutedForeground} />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          // Show categories with articles
          Object.entries(displayCategories).map(([category, categoryArticles]: [string, any]) => (
            <View key={category} style={styles.section}>
              <ThemedText style={styles.sectionTitle}>{category}</ThemedText>
              {categoryArticles.map((article: any) => (
                <TouchableOpacity
                  key={article.id}
                  style={styles.articleCard}
                  onPress={() => router.push(`/help/${article.id}`)}
                >
                  <View style={styles.articleContent}>
                    <ThemedText style={styles.articleTitle}>
                      {article.title}
                    </ThemedText>
                  </View>
                  <ChevronRight size={20} color={AppTheme.colors.mutedForeground} />
                </TouchableOpacity>
              ))}
            </View>
          ))
        )}

        {!isLoading && articles?.length === 0 && (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              No help articles available yet
            </ThemedText>
          </View>
        )}
      </ScrollView>

      {/* Contact Section */}
      <View style={styles.contactSection}>
        <ThemedText style={styles.contactTitle}>Need More Help?</ThemedText>
        
        <View style={styles.contactButtons}>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={handlePhonePress}
            activeOpacity={0.7}
          >
            <Phone size={20} color={AppTheme.colors.primary} />
            <ThemedText style={styles.contactButtonText}>Call</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.contactButton}
            onPress={handleEmailPress}
            activeOpacity={0.7}
          >
            <Mail size={20} color={AppTheme.colors.primary} />
            <ThemedText style={styles.contactButtonText}>Email</ThemedText>
          </TouchableOpacity>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  header: {
    padding: AppTheme.spacing.lg,
    paddingBottom: AppTheme.spacing.md,
  },
  title: {
    fontSize: AppTheme.fontSize.xxxl,
    fontWeight: AppTheme.fontWeight.bold,
    marginBottom: AppTheme.spacing.xs,
  },
  subtitle: {
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.mutedForeground,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.secondary,
    marginHorizontal: AppTheme.spacing.lg,
    marginBottom: AppTheme.spacing.md,
    borderRadius: AppTheme.borderRadius.lg,
    paddingHorizontal: AppTheme.spacing.md,
  },
  searchIcon: {
    marginRight: AppTheme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.foreground,
  },
  categoryScroll: {
    maxHeight: 50,
  },
  categoryContainer: {
    paddingHorizontal: AppTheme.spacing.lg,
    gap: AppTheme.spacing.sm,
    marginBottom: AppTheme.spacing.md,
  },
  categoryChip: {
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.sm,
    borderRadius: AppTheme.borderRadius.full,
    backgroundColor: AppTheme.colors.secondary,
    marginRight: AppTheme.spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: AppTheme.colors.primary,
  },
  categoryText: {
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.medium,
    color: AppTheme.colors.foreground,
  },
  categoryTextActive: {
    color: AppTheme.colors.primaryForeground,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: AppTheme.spacing.xl,
    paddingHorizontal: AppTheme.spacing.lg,
  },
  sectionTitle: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.semibold,
    marginBottom: AppTheme.spacing.md,
  },
  articleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppTheme.colors.background,
    padding: AppTheme.spacing.md,
    borderRadius: AppTheme.borderRadius.lg,
    marginBottom: AppTheme.spacing.sm,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    ...AppTheme.shadows.small,
  },
  articleContent: {
    flex: 1,
  },
  articleTitle: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.medium,
    marginBottom: AppTheme.spacing.xs,
  },
  articleCategory: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.mutedForeground,
  },
  loadingContainer: {
    padding: AppTheme.spacing.xl,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: AppTheme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: AppTheme.fontSize.base,
    color: AppTheme.colors.mutedForeground,
    textAlign: 'center',
  },
  contactSection: {
    padding: AppTheme.spacing.lg,
    backgroundColor: AppTheme.colors.secondary,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.border,
  },
  contactTitle: {
    fontSize: AppTheme.fontSize.base,
    fontWeight: AppTheme.fontWeight.semibold,
    marginBottom: AppTheme.spacing.md,
    textAlign: 'center',
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
});
