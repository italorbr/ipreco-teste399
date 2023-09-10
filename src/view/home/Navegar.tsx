import { Button } from "react-native";

import CameraComponent from '../../components/CameraComponent';
import Home from './Home';
import Banco from '../../components/Banco';
import Localizacao from '../../components/Localizacao';
import Detalhes from '../../components/Detalhes'


import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";


const Stack = createStackNavigator();

export default function Navegar() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShadowVisible: false,
          headerTitleStyle: { color: "#f4a100" },
          headerTitleAlign: "center",
        }}
        initialRouteName="Home"
      >
        <Stack.Screen
          name="Pagina inicial"
          component={Home}
        />
        <Stack.Screen
          options={({ navigation }) => ({
            headerRight: () => (
              <Button
                title="Início"
                onPress={() => {
                  navigation.navigate("Pagina inicial");
                }}
              />
            ),
          })}
          name="Camera"
          component={CameraComponent}
        />
        <Stack.Screen name="Banco" component={Banco} />
        <Stack.Screen name="Localizacao" component={Localizacao} />
        <Stack.Screen name="Detalhes" component={Detalhes} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}