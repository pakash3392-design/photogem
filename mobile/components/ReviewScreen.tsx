import { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Alert,
  useWindowDimensions,
} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import { STYLE_PRESETS } from '../constants/styles';
import FilteredImage from './FilteredImage';

type Props = {
  imageUri: string;
  imageBase64: string;
  initialStyle: string;
  onBack: () => void;
};

export default function ReviewScreen({ imageUri, initialStyle, onBack }: Props) {
  const [selectedStyle, setSelectedStyle] = useState(initialStyle);
  const [imgSize, setImgSize] = useState<{ w: number; h: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const captureViewRef = useRef<View>(null);
  const { width: screenWidth } = useWindowDimensions();

  useEffect(() => {
    Image.getSize(
      imageUri,
      (w, h) => setImgSize({ w, h }),
      () => setImgSize({ w: 3, h: 4 }) // fallback aspect ratio if it fails
    );
  }, [imageUri]);

  const currentStyle = STYLE_PRESETS.find((s) => s.id === selectedStyle)!;

  const displayWidth = screenWidth - 40;
  const displayHeight = imgSize ? (displayWidth * imgSize.h) / imgSize.w : displayWidth;

  const saveToPhotos = async () => {
    setSaving(true);
    try {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Darkroom needs access to save photos to your library.');
        setSaving(false);
        return;
      }
      const uri = await captureRef(captureViewRef, {
        format: 'jpg',
        quality: 0.95,
      });
      await MediaLibrary.saveToLibraryAsync(uri);
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
          {imgSize ? (
            <FilteredImage
              ref={captureViewRef}
              uri={imageUri}
              filter={currentStyle.filter}
              width={displayWidth}
              height={displayHeight}
            />
          ) : (
            <View style={{ width: displayWidth, height: displayWidth }} />
          )}
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
        </View>

        <Text style={styles.sectionLabel}>CHOOSE A LOOK — APPLIES INSTANTLY</Text>
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
    alignItems: 'center',
  },
  resultLabel: { color: COPPER, fontSize: 11, letterSpacing: 2, marginTop: 14 },
  primaryButton: {
    backgroundColor: COPPER,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 999,
    marginTop: 16,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  primaryButtonText: { color: CHARCOAL, fontSize: 12, fontWeight: '600', letterSpacing: 1.5 },
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
});
