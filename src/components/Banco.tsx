import { useEffect, useState } from "react";
import {
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TextInput,
  Modal,
  View,
} from "react-native";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import {launchImageLibrary} from 'react-native-image-picker';
import { db, storage } from "../../firebaseConfig";


interface File {
  url: string;
}

export default function Banco() {
  const [texto, setTexto] = useState<string>("");
  const [texto2, setTexto2] = useState<string>("");
  const [modalVisible1, setModalVisible1] = useState<boolean>(true);
  const [modalVisible2, setModalVisible2] = useState<boolean>(false);

  const [image, setImage] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [files, setFiles] = useState<File[]>([]);
  
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "imagens"), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          console.log("NOVO ARQUIVO", change.doc.data());
          setFiles((prevFiles) => [...prevFiles, change.doc.data()]);
        }
      });
    });
    return () => unsubscribe();
  }, []);

  async function pickImage() {
    let options = {
      storageOptions: {
        path: "image",
      },
    };
  
    launchImageLibrary(options, (response) => {
      if (!response.didCancel) {
        setImage(response.assets[0].uri);
        // manda a imagem
        uploadImage(response.assets[0].uri, "image");
      }
    });
  }

  async function uploadImage(uri: string, fileType: string) {
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, `${texto}/${texto2}/`);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    // Evento
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("upload esta " + progress + "% feito");
        setProgress(progress.toFixed());
      },
      (error) => {
        // pega o erro
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log("disponivel em: ", downloadURL);
          // save record
          await saveRecord(fileType, downloadURL, new Date().toISOString());
          setImage("");
        });
      }
    );
  }

  async function saveRecord(
    fileType: string,
    url: string,
    createdAt: string
  ) {
    try {
      const docRef = await addDoc(collection(db, "imagens"), {
        fileType,
        url,
        createdAt,
      });
      console.log("Documento salvo com sucesso", docRef.id);
    } catch (e) {
      console.log(e);
    }
  }

  const handleInputChange = (text: string) => {
    setTexto(text);
  };

  const handleInputChange2 = (text: string) => {
    setTexto2(text);
  };

  const abrirModal = () => {
    setModalVisible2(true);
  };

  const Confirmar = () => {
    console.log("Usuário clicou em Feito");
    setModalVisible1(false);
    setModalVisible2(true);
  };
  const Confirmar2 = () => {
    console.log("Usuário clicou em Feito");
    setModalVisible2(false);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        margin: 0,

      }}
    >
      <FlatList
        data={files}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => {
          return (
            <Image
              source={{ uri: item.url }}
              style={{ width: "34%", height: 130 }}
            />
          );
        }}
        numColumns={3}
        contentContainerStyle={{ gap: 2 }}
        columnWrapperStyle={{ gap: 2 }}
      />
      <TouchableOpacity
        onPress={abrirModal}
        style={{
          position: "absolute",
          bottom: 170,
          right: 30,
          width: 55,
          height: 55,
          backgroundColor: "black",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 25,
        }}
      >
        <Text style={{color: 'white', fontSize: 35}}>+</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={pickImage}
        style={{
          position: "absolute",
          bottom: 90,
          right: 30,
          width: 55,
          height: 55,
          backgroundColor: "black",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 25,
        }}
      >
        <Text style={{color: 'white', fontSize: 35}}>+</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible1} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.alerta}>
            <Text style={styles.label}>POR FAVOR DIGITE NA CAIXA</Text>
            <Text style={styles.label}>CASO CONTRARIO A FOTO NAO SERA ENVIADA</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={Confirmar}
                style={[styles.modalButton, styles.confirmButton]}
              >
                <Text style={{ fontSize: 16 }}>Entendi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={modalVisible2} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.label}>Digite o nome da Categoria</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleInputChange}
              value={texto}
            />
            <Text style={styles.modalText}>Digite o nome do produto</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleInputChange2}
              value={texto2}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={Confirmar2}
                style={[styles.modalButton, styles.confirmButton]}
              >
                <Text style={{ fontSize: 16 }}>Feito</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
      }

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: "#8E3200",
    textAlign: "center", // Centralize o texto horizontalmente
  },
  input: {
    width: "90%",
    padding: 1,
    color: "#8E3200",
    marginBottom: 20,
    backgroundColor: "rgba(0, 0, 102, 0.3)",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    width: "90%",
    height: 275,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 25,
    alignItems: "center",
  },
  alerta:{
    width: "90%",
    height: 190,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 25,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    color: "#8E3200"
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "45%",
  },
  confirmButton: {
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "transparent", // Defina o fundo como transparente
    borderWidth: 2, // Adicione uma borda com largura 2
    borderColor: "green", // Cor da borda verde
    margin: 9,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "green", // Adicione uma sombra verde
    shadowOffset: { width: -5, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 6, // Elevação para sombra no Android
  },
});