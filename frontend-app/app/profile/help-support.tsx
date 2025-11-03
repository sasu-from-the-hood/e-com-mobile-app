import { View, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { ChevronLeft, Mail, Phone, MessageCircle, HelpCircle } from 'lucide-react-native';
import { ThemedText } from '@/components/themed-text';
import { AppTheme } from '@/constants/app-theme';

export default function HelpSupportScreen() {
  const router = useRouter();

  const contactOptions = [
    {
      icon: Phone,
      title: 'Call Us',
      subtitle: '+1 (800) 123-4567',
      action: () => Linking.openURL('tel:+18001234567'),
    },
    {
      icon: Mail,
      title: 'Email Us',
      subtitle: 'support@shop.com',
      action: () => Linking.openURL('mailto:support@shop.com'),
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      subtitle: 'Chat with our support team',
      action: () => {},
    },
  ];

  const faqs = [
    {
      question: 'How do I track my order?',
      answer: 'Go to My Orders and tap on any order to see tracking details.',
    },
    {
      question: 'What is your return policy?',
      answer: 'We accept returns within 30 days of delivery for most items.',
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3-5 business days.',
    },
  ];

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
          <ThemedText style={styles.sectionTitle}>Contact Us</ThemedText>
          {contactOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <TouchableOpacity
                key={index}
                style={styles.contactCard}
                onPress={option.action}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <Icon size={24} color={AppTheme.colors.primary} />
                </View>
                <View style={styles.contactInfo}>
                  <ThemedText style={styles.contactTitle}>{option.title}</ThemedText>
                  <ThemedText style={styles.contactSubtitle}>{option.subtitle}</ThemedText>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* FAQs */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Frequently Asked Questions</ThemedText>
          {faqs.map((faq, index) => (
            <View key={index} style={styles.faqCard}>
              <View style={styles.faqHeader}>
                <HelpCircle size={20} color={AppTheme.colors.primary} />
                <ThemedText style={styles.faqQuestion}>{faq.question}</ThemedText>
              </View>
              <ThemedText style={styles.faqAnswer}>{faq.answer}</ThemedText>
            </View>
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
  section: {
    marginBottom: AppTheme.spacing.xl,
  },
  sectionTitle: {
    fontSize: AppTheme.fontSize.lg,
    fontWeight: AppTheme.fontWeight.bold,
    marginBottom: AppTheme.spacing.md,
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
});