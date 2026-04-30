import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AppTheme } from '@/constants/app-theme';
import { router } from 'expo-router';

interface CaptionDisplayProps {
  caption: string;
  maxLines?: number;
}

interface ParsedSegment {
  type: 'text' | 'mention' | 'hashtag';
  content: string;
}

export function CaptionDisplay({ caption, maxLines = 3 }: CaptionDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const parseCaption = (text: string): ParsedSegment[] => {
    const segments: ParsedSegment[] = [];
    const regex = /(@\w+)|(#\w+)|([^@#]+)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match[1]) {
        // Mention (@username)
        segments.push({ type: 'mention', content: match[1] });
      } else if (match[2]) {
        // Hashtag (#tag)
        segments.push({ type: 'hashtag', content: match[2] });
      } else if (match[3]) {
        // Regular text
        segments.push({ type: 'text', content: match[3] });
      }
    }

    return segments;
  };

  const handleMentionPress = (username: string) => {
    // Remove @ symbol and navigate to user profile
    const cleanUsername = username.replace('@', '');
    console.log('Navigate to user profile:', cleanUsername);
    // TODO: Navigate to user profile when implemented
    // router.push(`/profile/${cleanUsername}`);
  };

  const segments = parseCaption(caption);

  return (
    <View style={styles.container}>
      <Text 
        style={styles.captionText} 
        numberOfLines={isExpanded ? undefined : maxLines}
        onTextLayout={(e) => {
          if (e.nativeEvent.lines.length > maxLines) {
            setShowMore(true);
          }
        }}
      >
        {segments.map((segment, index) => {
          if (segment.type === 'mention') {
            return (
              <Text
                key={index}
                style={styles.mention}
                onPress={() => handleMentionPress(segment.content)}
              >
                {segment.content}
              </Text>
            );
          } else if (segment.type === 'hashtag') {
            return (
              <Text key={index} style={styles.hashtag}>
                {segment.content}
              </Text>
            );
          } else {
            return (
              <Text key={index} style={styles.text}>
                {segment.content}
              </Text>
            );
          }
        })}
      </Text>
      {showMore && !isExpanded && (
        <TouchableOpacity onPress={() => setIsExpanded(true)}>
          <Text style={styles.moreButton}>more</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  captionText: {
    fontSize: AppTheme.fontSize.sm,
    lineHeight: AppTheme.fontSize.sm * 1.4,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: AppTheme.fontWeight.normal,
  },
  mention: {
    color: AppTheme.colors.primary,
    fontWeight: AppTheme.fontWeight.semibold,
  },
  hashtag: {
    color: '#FFFFFF',
    fontWeight: AppTheme.fontWeight.bold,
  },
  moreButton: {
    color: AppTheme.colors.mutedForeground,
    fontSize: AppTheme.fontSize.sm,
    fontWeight: AppTheme.fontWeight.semibold,
    marginTop: 4,
  },
});
