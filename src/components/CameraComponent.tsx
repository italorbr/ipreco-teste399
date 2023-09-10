import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

const CameraComponent: React.FC = () => {
  const devices = useCameraDevices();
  const device = devices.back;
  const camera = useRef<Camera | null>(null);
  const [imageData, setImageData] = useState<string>('');
  const [takePhotoClicked, setTakePhotoClicked] = useState<boolean>(false);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const newCameraPermission = await Camera.requestCameraPermission();
    console.log(newCameraPermission);
  };

  if (device == null) return <ActivityIndicator />;

  const takePicture = async () => {
    if (camera.current != null) {
      const photo = await camera.current.takePhoto();
      setImageData(photo.path); // Defina imageData com o caminho da foto tirada

      setTakePhotoClicked(false);
    }
  };

  return (
    <View style={{ flex: 1, alignContent: 'center', justifyContent: "center" }}>
      {takePhotoClicked ? (
        <View style={{ flex: 1 }}>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFillObject}
            device={device}
            isActive={true}
            photo
          />
          <TouchableOpacity
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: '#ff0037',
              position: 'absolute',
              bottom: 50,
              alignSelf: 'center',
            }}
            onPress={() => {
              takePicture();
            }}
          />
        </View>
      ) : (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 75 }}
        >
          {imageData !== '' && (
            <Image
              source={{ uri: 'file://' + imageData }}
              style={{ width: '130%', height: "55%", transform: [{ rotate: '-90deg' }], // Rotate the image 90 degrees
              }}
            />
          )}
          <TouchableOpacity
            style={{
              width: '90%',
              height: 50,
              borderWidth: 1,
              alignSelf: 'center',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              setTakePhotoClicked(true);
            }}
          ><Text>Tirar foto</Text></TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CameraComponent;
