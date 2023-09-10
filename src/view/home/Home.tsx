import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Camera")}
      >
        <Text style={styles.buttonText}>PAGINA DA CAMERA</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Banco")}
      >
        <Text style={styles.buttonText}>PAGINA DO BANCO</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Localizacao")}
      >
        <Text style={styles.buttonText}>PAGINA DA LOCALIZACAO</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 10,
    height: 45,
    width: "95%",
  },
  buttonText: {
    color: "black",
    fontWeight: "bold"
  }
});