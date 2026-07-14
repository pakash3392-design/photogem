import { useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Image, ScrollView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { STYLE_PRESETS, StylePreset } from '../constants/styles';

const CHARCOAL = '#14110F';
const CREAM = '#F2ECE4';
const COPPER = '#C77D4B';
const HAIRLINE = '#3A332B';

type Props = {
  onCapture: (uri: string, base64: string) => void;
  onOpenLibrary: () => void;
  selectedStyle: string;
  onSelectStyle: (id: string) => void;
};

export default function CameraScreen({
  onCapture,
  onOpenLibrary,
  selectedStyle,
  onSelectStyle,
}: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const cameraRef = useRef<CameraView>(null);
  const [capturing, setCapturing] = useState(false);

  const currentStyle = STYLE_PRESETS.find((s) => s.id === selectedStyle) as StylePreset;

  const takePhoto = async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });
      if (photo?.uri && photo?.base64) {
        onCapture(photo.uri, photo.base64);
      }
    } finally {
      setCapturing(false);
    }
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.permissionText}>
          Darkroom needs camera access to show you a live preview of each look.
        </Text>
        <Pressable style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>ALLOW CAMERA</Text>
        </Pressable>
        <Pressable onPress={onOpenLibrary} style={{ marginTop: 16 }}>
          <Text style={styles.libraryLink}>Or choose a photo from your library instead</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraWrap}>
        <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} />

        {/* Live style preview: an approximate color tint, not the real AI look.
            The real AI result is generated after you tap capture. */}
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: currentStyle.previewTint,
              opacity: currentStyle.previewOpacity,
            },
          ]}
        />
        {currentStyle.previewDesaturate && (
          <View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, { backgroundColor: '#808080', opacity: 0.25 }]}
          />
        )}

        <View style={styles.topBar}>
          <Text style={styles.previewLabel}>
            LIVE PREVIEW · {currentStyle.code} {currentStyle.name.toUpperCase()}
          </Text>
          <Pressable
            onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
            style={styles.flipButton}
          >
            <Text style={styles.flipButtonText}>FLIP</Text>
          </Pressable>
        </View>
      </View>

      {/* Style picker */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filmstrip}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {STYLE_PRESETS.map((style) => {
          const selected = style.id === selectedStyle;
          return (
            <Pressable
              key={style.id}
              onPress={() => onSelectStyle(style.id)}
              style={[styles.styleChip, selected && styles.styleChipSelected]}
            >
              <Image source={{ uri: style.referenceImage }} style={styles.chipThumb} />
              <Text style={[styles.chipText, selected && { color: COPPER }]}>{style.name}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Controls */}
      <View style={styles.controls}>
        <Pressable onPress={onOpenLibrary} style={styles.libraryButton}>
          <Text style={styles.libraryButtonText}>LIBRARY</Text>
        </Pressable>

        <Pressable
          onPress={takePhoto}
          disabled={capturing}
          style={[styles.shutter, capturing && { opacity: 0.5 }]}
        >
          <View style={styles.shutterInner} />
        </Pressable>

        <View style={{ width: 70 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: CHARCOAL },
  centered: { justifyContent: 'center', alignItems: 'center', padding: 30 },
  permissionText: { color: CREAM, textAlign: 'center', fontSize: 15, marginBottom: 20 },
  permissionButton: { backgroundColor: COPPER, paddingVertical: 14, paddingHorizontal: 28 },
  permissionButtonText: { color: CHARCOAL, fontSize: 13, fontWeight: '600', letterSpacing: 1.5 },
  libraryLink: { color: 'rgba(242,236,228,0.5)', fontSize: 13, textDecorationLine: 'underline' },
  cameraWrap: { flex: 1 },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewLabel: {
    color: COPPER,
    fontSize: 10,
    letterSpacing: 1.5,
    backgroundColor: 'rgba(20,17,15,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  flipButton: {
    backgroundColor: 'rgba(20,17,15,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  flipButtonText: { color: CREAM, fontSize: 10, letterSpacing: 1.5 },
  filmstrip: { maxHeight: 76, backgroundColor: CHARCOAL, paddingTop: 10 },
  styleChip: { alignItems: 'center', marginRight: 16, opacity: 0.6 },
  styleChipSelected: { opacity: 1 },
  chipThumb: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: HAIRLINE,
  },
  chipText: { color: CREAM, fontSize: 10 },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: CHARCOAL,
  },
  libraryButton: { width: 70 },
  libraryButtonText: { color: 'rgba(242,236,228,0.6)', fontSize: 10, letterSpacing: 1.5 },
  shutter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: COPPER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COPPER,
  },
});
