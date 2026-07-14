import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import CameraScreen from './components/CameraScreen';
import ReviewScreen from './components/ReviewScreen';
import { STYLE_PRESETS } from './constants/styles';

type Captured = { uri: string; base64: string } | null;

export default function App() {
  const [captured, setCaptured] = useState<Captured>(null);
  const [selectedStyle, setSelectedStyle] = useState(STYLE_PRESETS[0].id);

  const openLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Darkroom needs access to your photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      base64: true,
    });
    if (!result.canceled && result.assets[0]?.base64) {
      setCaptured({ uri: result.assets[0].uri, base64: result.assets[0].base64 });
    }
  };

  return (
    <>
      <StatusBar style="light" />
      {captured ? (
        <ReviewScreen
          imageUri={captured.uri}
          imageBase64={captured.base64}
          initialStyle={selectedStyle}
          onBack={() => setCaptured(null)}
        />
      ) : (
        <CameraScreen
          onCapture={(uri, base64) => setCaptured({ uri, base64 })}
          onOpenLibrary={openLibrary}
          selectedStyle={selectedStyle}
          onSelectStyle={setSelectedStyle}
        />
      )}
    </>
  );
}
