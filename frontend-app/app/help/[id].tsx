import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';
import { ArrowLeft } from 'lucide-react-native';
import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/lib/orpc-client';
import { URL } from '@/config';

export default function HelpArticleScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { data: article, isLoading } = useQuery({
    queryKey: ['help-article', id],
    queryFn: () => orpc.getHelpArticle({ id: id as string }),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ThemedText>Loading article...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (!article) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ThemedText>Article not found</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={AppTheme.colors.foreground} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Help Article</ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {article.image && (
          <Image
            source={{ uri: URL.IMAGE + article.image }}
            style={styles.image}
            contentFit="cover"
          />
        )}

        <View style={styles.articleContent}>
          <View style={styles.categoryBadge}>
            <ThemedText style={styles.categoryText}>
              {article.category}
            </ThemedText>
          </View>

          <ThemedText style={styles.title}>{article.title}</ThemedText>

          <ThemedText style={styles.date}>
            {new Date(article.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </ThemedText>

          <View style={styles.divider} />

          <ThemedText style={styles.contentText}>
            {article.content}
          </ThemedText>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  backButton: {
    padding: AppTheme.spacing.xs,
  },
  headerTitle: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.semibold,
  },
  content: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: AppTheme.colors.secondary,
  },
  articleContent: {
    padding: AppTheme.spacing.lg,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: AppTheme.colors.primary + '20',
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.xs,
    borderRadius: AppTheme.borderRadius.full,
    marginBottom: AppTheme.spacing.md,
  },
  categoryText: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.primary,
    fontWeight: AppTheme.fontWeight.medium,
  },
  title: {
    fontSize: AppTheme.fontSize.xxl,
    fontWeight: AppTheme.fontWeight.bold,
    marginBottom: AppTheme.spacing.sm,
    lineHeight: 32,
  },
  date: {
    fontSize: AppTheme.fontSize.sm,
    color: AppTheme.colors.mutedForeground,
    marginBottom: AppTheme.spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: AppTheme.colors.border,
    marginBottom: AppTheme.spacing.lg,
  },
  contentText: {
    fontSize: AppTheme.fontSize.base,
    lineHeight: 24,
    color: AppTheme.colors.foreground,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
