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
import { File, Paths } from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { STYLE_PRESETS, API_BASE_URL } from '../constants/styles';

type Status = 'ready' | 'processing' | 'done' | 'error';

type Props = {
  imageUri: string;
  imageBase64: string;
  initialStyle: string;
  onBack: () => void;
};

export default function ReviewScreen({ imageUri, initialStyle, onBack }: Props) {
  const [selectedStyle, setSelectedStyle] = useState(initialStyle);
  const [status, setStatus] = useState<Status>('ready');
  const [resultUri, setResultUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const currentStyle = STYLE_PRESETS.find((s) => s.id === selectedStyle)!;

  const generate = async () => {
    setStatus('processing');
    try {
      // Resize before sending -- phone camera photos can be 5-10MB+, which
      // fails against the backend's upload size limit otherwise.
      const resized = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 1536 } }],
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

      // data.resultUrl is a data: URL (base64) -- write it to a real local
      // file so it can be displayed and saved to the camera roll.
      const base64 = data.resultUrl.split(',')[1];
      const file = new File(Paths.cache, `darkroom-${Date.now()}.png`);
      file.write(base64, { encoding: 'base64' });

      setResultUri(file.uri);
      setStatus('done');
    } catch (err: any) {
      Alert.alert('Could not edit photo', err.message);
      setStatus('error');
    }
  };

  const saveToPhotos = async () => {
    if (!resultUri) return;
    setSaving(true);
    try {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Darkroom needs access to save photos to your library.');
        return;
      }
      await MediaLibrary.saveToLibraryAsync(resultUri);
      Alert.alert('Saved', 'Your styled photo was saved to your camera roll.');
    } catch (err: any) {
      Alert.alert('Could not save', err.message || 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable onPress={onBack} style={{ marginBottom: 16 }}>
          <Text style={styles.backLink}>‹ BACK TO CAMERA</Text>
        </Pressable>

        <View style={styles.frame}>
          {status === 'done' && resultUri ? (
            <View style={{ alignItems: 'center' }}>
              <Image source={{ uri: resultUri }} style={styles.photo} resizeMode="cover" />
              <Text style={styles.resultLabel}>
                {currentStyle.code} · {currentStyle.name}
              </Text>
              <Pressable
                onPress={saveToPhotos}
                disabled={saving}
                style={[styles.primaryButton, saving && { opacity: 0.5 }]}
              >
                <Text style={styles.primaryButtonText}>
                  {saving ? 'SAVING...' : 'SAVE TO PHOTOS'}
                </Text>
              </Pressable>
              <Pressable
                style={styles.secondaryButton}
                onPress={() => {
                  setStatus('ready');
                  setResultUri(null);
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
                    Editing in {currentStyle.name}...
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
              {status === 'processing' ? 'EDITING...' : 'APPLY LOOK'}
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
  photo: { width: '100%', height: 320, borderRadius: 8, backgroundColor: '#000' },
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
    borderRadius: 12,
    overflow: 'hidden',
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
    borderRadius: 999,
    marginTop: 8,
    alignSelf: 'stretch',
  },
  primaryButtonText: { color: CHARCOAL, fontSize: 13, fontWeight: '600', letterSpacing: 2 },
  secondaryButton: {
    borderWidth: 1,
    borderColor: HAIRLINE,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 10,
    borderRadius: 999,
  },
  secondaryButtonText: { color: 'rgba(242,236,228,0.7)', fontSize: 11, letterSpacing: 1.5 },
});
