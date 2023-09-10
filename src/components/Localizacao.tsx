import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Touchable } from 'react-native';
import { request, PERMISSIONS, PermissionStatus } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation'; // Importe a biblioteca de geolocalização
import { TouchableOpacity } from 'react-native-gesture-handler';
import  {firebase}  from "../../firebaseConfig";
import { useNavigation } from '@react-navigation/native';

const Localizacao: React.FC = () => {
  const todoRef = firebase.firestore().collection("newData");
  const navigation = useNavigation();

  const [locationPermission, setLocationPermission] = useState<PermissionStatus | null>(null);

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    const status: PermissionStatus = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    setLocationPermission(status);

    if (status === 'granted') {
      // Se a permissão for concedida, obtenha a localização
      Geolocation.getCurrentPosition(
        (position) => {
          const newCoordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setCoordinates((prevCoordinates) => [...prevCoordinates, newCoordinates]);
          console.log('MUDOU');
        },
        (error) => {
          console.error(error.message);
        },
        { enableHighAccuracy: true, timeout: 9000, maximumAge: 100 }
      );
    }
  };
  const addCampo = () => {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const data = {
      heading: 'localization',
      createAt: timestamp,
      coordinates: coordinates,
    };
        todoRef
          .add(data)
          alert("MANDOU COM SUCESSO")
      };


  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 20, padding: 10, color: "#8E3200" }}>
        Permissão de Localização: {locationPermission}
      </Text>
      <TouchableOpacity style={{ padding: 10, alignSelf: 'center', backgroundColor: "rgb(67,242,13)", borderRadius: 5,}} onPress={() => {addCampo(); }}>
            <Text style={{fontSize: 21, alignSelf: 'center',}}>Add</Text>
          </TouchableOpacity>
      {latitude !== null && longitude !== null && (
        <Text style={{ fontSize: 20, padding: 10 }}>
          Latitude: {latitude}, Longitude: {longitude}
        </Text>
      )}
      <View style={{ flex: 1 }}>
      <FlatList
        data={coordinates}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
          style={{
            padding: 14,
            width: "100%",
            borderBottomWidth: 1,
            borderBottomColor: "#000",
          }}
          onPress={() => {
            // Navegue para a próxima tela e passe os dados
            navigation.navigate('Detalhes', {
              latitude: item.latitude,
              longitude: item.longitude,
            });
          }}
        >

            <Text style={{fontSize: 21, padding: 10,}}>
              Latitude: {item.latitude}, Longitude: {item.longitude}
            </Text>
          </TouchableOpacity>
        )}
      />
      </View>
    </View>
  );
};

export default Localizacao;
