import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import { STYLE_PRESETS, API_BASE_URL } from '../constants/styles';

type Status = 'ready' | 'processing' | 'done' | 'error';

type Props = {
  imageUri: string;
  imageBase64: string;
  initialStyle: string;
  onBack: () => void;
};

export default function ReviewScreen({ imageUri, imageBase64, initialStyle, onBack }: Props) {
  const [selectedStyle, setSelectedStyle] = useState(initialStyle);
  const [status, setStatus] = useState<Status>('ready');
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const currentStyle = STYLE_PRESETS.find((s) => s.id === selectedStyle)!;

  const generate = async () => {
    setStatus('processing');
    try {
      // Resize before sending -- phone camera photos can be 5-10MB+, which
      // fails against the backend's upload size limit with a confusing
      // error otherwise.
      const resized = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 1600 } }],
        { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );

      const res = await fetch(`${API_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageDataUrl: `data:image/jpeg;base64,${resized.base64}`,
          styleId: selectedStyle,
        }),
      });

      // Guard against non-JSON responses (e.g. a plain-text "Request Entity
      // Too Large" page from the platform) instead of a confusing parse error.
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error(
          res.status === 413
            ? 'That photo was too large to upload. Try a different photo.'
            : `Unexpected server response (${res.status}): ${text.slice(0, 120)}`
        );
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setResultUrl(data.resultUrl);
      setStatus('done');
    } catch (err: any) {
      Alert.alert('Could not apply style', err.message);
      setStatus('error');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable onPress={onBack} style={{ marginBottom: 16 }}>
          <Text style={styles.backLink}>‹ BACK TO CAMERA</Text>
        </Pressable>

        <View style={styles.frame}>
          {status === 'done' && resultUrl ? (
            <View style={{ alignItems: 'center' }}>
              <Image source={{ uri: resultUrl }} style={styles.photo} resizeMode="cover" />
              <Text style={styles.resultLabel}>
                {currentStyle.code} · {currentStyle.name}
              </Text>
              <Pressable
                style={styles.secondaryButton}
                onPress={() => {
                  setStatus('ready');
                  setResultUrl(null);
                }}
              >
                <Text style={styles.secondaryButtonText}>TRY ANOTHER LOOK</Text>
              </Pressable>
            </View>
          ) : (
            <View style={{ alignItems: 'center' }}>
              <Image source={{ uri: imageUri }} style={styles.photo} resizeMode="cover" />
              {status === 'processing' && (
                <View style={{ marginTop: 16, alignItems: 'center' }}>
                  <ActivityIndicator color="#C77D4B" />
                  <Text style={styles.processingLabel}>
                    Developing in {currentStyle.name}...
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        <Text style={styles.sectionLabel}>CHOOSE A LOOK</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
          {STYLE_PRESETS.map((style) => {
            const selected = style.id === selectedStyle;
            return (
              <Pressable
                key={style.id}
                onPress={() => setSelectedStyle(style.id)}
                style={[styles.styleCard, selected && styles.styleCardSelected]}
              >
                <Image source={{ uri: style.referenceImage }} style={styles.styleThumb} />
                <Text style={styles.styleCode}>{style.code}</Text>
                <Text style={styles.styleName}>{style.name}</Text>
                <Text style={styles.styleDesc}>{style.description}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {status !== 'done' && (
          <Pressable
            style={[styles.primaryButton, status === 'processing' && { opacity: 0.5 }]}
            onPress={generate}
            disabled={status === 'processing'}
          >
            <Text style={styles.primaryButtonText}>
              {status === 'processing' ? 'DEVELOPING...' : 'APPLY LOOK'}
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const CHARCOAL = '#14110F';
const SURFACE = '#1E1A16';
const CREAM = '#F2ECE4';
const COPPER = '#C77D4B';
const HAIRLINE = '#3A332B';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: CHARCOAL },
  scroll: { padding: 20, paddingTop: 50, paddingBottom: 60 },
  backLink: { color: COPPER, fontSize: 11, letterSpacing: 1.5 },
  frame: {
    borderWidth: 1,
    borderColor: HAIRLINE,
    backgroundColor: SURFACE,
    padding: 16,
    marginBottom: 24,
    minHeight: 240,
    justifyContent: 'center',
  },
  photo: { width: '100%', height: 320, borderRadius: 2, backgroundColor: '#000' },
  resultLabel: { color: COPPER, fontSize: 11, letterSpacing: 2, marginTop: 14 },
  processingLabel: { color: COPPER, fontSize: 11, letterSpacing: 2, marginTop: 8 },
  sectionLabel: {
    color: 'rgba(242,236,228,0.4)',
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 12,
  },
  styleCard: {
    width: 150,
    marginRight: 12,
    borderWidth: 1,
    borderColor: HAIRLINE,
  },
  styleCardSelected: { borderColor: COPPER },
  styleThumb: { width: '100%', height: 90, backgroundColor: '#000' },
  styleCode: { color: COPPER, fontSize: 10, letterSpacing: 1.5, marginTop: 8, marginLeft: 10 },
  styleName: { color: CREAM, fontSize: 15, marginLeft: 10, marginTop: 2 },
  styleDesc: {
    color: 'rgba(242,236,228,0.4)',
    fontSize: 11,
    marginLeft: 10,
    marginTop: 2,
    marginBottom: 10,
    marginRight: 8,
  },
  primaryButton: {
    backgroundColor: COPPER,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: { color: CHARCOAL, fontSize: 13, fontWeight: '600', letterSpacing: 2 },
  secondaryButton: {
    borderWidth: 1,
    borderColor: HAIRLINE,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  secondaryButtonText: { color: 'rgba(242,236,228,0.7)', fontSize: 11, letterSpacing: 1.5 },
});
