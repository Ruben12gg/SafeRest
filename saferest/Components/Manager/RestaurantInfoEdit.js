import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, TouchableHighlight, PermissionsAndroid, BackHandler } from "react-native";
import { TextInput, IconButton, Button, Provider as PaperProvider, Portal, ActivityIndicator, } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { utils } from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import {launchImageLibrary} from 'react-native-image-picker';
import {Notifications} from 'react-native-notifications';

export default function RestaurantInfoEdit() {

  const [loading, setLoading] = useState(true)

  const navigation = useNavigation();

  const [capacity, setCapacity] = useState('');
  const [telephone, setTelephone] = useState('');
  const [name, setName] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [address, setAddress] = useState('');
  const [idUser, setIdUser] = useState('');
  const [image, setImage] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)

  const reference = storage().ref('/restaurants/images/'+name);
  const url = DOMAIN + '/restaurants/' + IDRESTAURANT

  useEffect(() => {

    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Authorization': TOKEN,
        'Content-Type': 'application/json'
      },
    }).then((res) => res.json()).then((json) => {

      setCapacity(json.maxCapacity.toString());
      setTelephone(json.telephone);
      setName(json.name);
      setLat(json.latitude);
      setLng(json.longitude);
      setAddress(json.address);
      setIdUser(json.idUser);
      setImage(json.images)

      setLoading(false)


    }).catch((error) => {
      console.error(Error, error);
    });

  }, []);

  const ImagePicker = () => {

    const requestStoragePermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          chooseFile()
        }
      } catch (err) {
        console.warn(err);
      }
    };

    const chooseFile = () => {
      let options = {
        mediaType: 'photo',
        quality: 1,
      };
      launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          setSelectedImage(image)
        }
        setSelectedImage(response.uri);
      });
    };
    requestStoragePermission()
  }

  const uploadImage = () => {
      const task = reference.putFile(selectedImage)

      task.on('state_changed', taskSnapshot => {
        console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
      });

      task.then(async () => {
        console.log('Image uploaded to the bucket!');
        setImage(await reference.getDownloadURL())
        setTimeout(function(){
          putData()
        }, 1000);
      });
    }

  const Save = () => {
    setLoading(true)
  if (selectedImage !== null) {
    uploadImage()
  } else {
    putData()
  }


  }

  const putData = () => {
    const data = {
      maxCapacity: capacity,
      telephone: telephone,
      name: name,
      latitude: lat,
      longitude: lng,
      address: address,
      idUser: idUser,
      images: image
    }

    console.log(data);

    fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Authorization': TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then((res) => res.json()).then((json) => {
      navigation.goBack();
      Notifications.postLocalNotification({
        title: name,
        body: "Restaurante atualizado",
      });
    }).catch((error) => {
      console.error('Error:', error);
    });
  }

  return (
    <>
      <PaperProvider>
        <View style={styles.container}>
          <Portal>
            <IconButton
                        icon="chevron-left"
                        color="black"
                        size={30}
                        onPress={() => { navigation.goBack() }}
            />
          </Portal>
          <View style={styles.vImage}>
            <Portal>
              <IconButton
                icon="pencil"
                color="white"
                style={{backgroundColor: '#9FD356',
                        opacity: 0.65,
                        top: 87.5,
                        marginHorizontal: '45%'}}
                size={25}
                onPress={ImagePicker}
                /*onPress={() => { console.log('BTN EDIT')}}*/
              />
            </Portal>
            {
              image == null && selectedImage == null ?
                <Image style={styles.img} source={require('../../src/img/indisponivel.png')} />
                : selectedImage !== null ?
                <Image style={styles.img} source={{ uri: selectedImage }} />
                : <Image style={styles.img} source={{ uri: image }} />
            }
          </View>
          <View style={styles.inputs}>
            <TextInput style={styles.input}
                       keyboardType="number-pad"
                       mode="outlined"
                       theme={{colors: {primary: '#9FD356',
                           placeholder: 'black',
                           underlineColor: 'black',
                           text: "black"}}}
                       label="Capacidade Máxima"
                       value={capacity}
                       onChangeText={capacity => setCapacity(capacity)}
            />
            <TextInput style={styles.input}
                       keyboardType="phone-pad"
                       mode="outlined"
                       theme={{colors: {primary: '#9FD356',
                           placeholder: 'black',
                           underlineColor: 'black',
                           text: "black"}}}
                       label="Telefone"
                       value={telephone}
                       onChangeText={telephone => setTelephone(telephone)}
            />
          </View>
          <Button style={styles.btnSave} mode="contained"
                  theme={{colors: {primary: '#9FD356'}}}
                  labelStyle={{ color: "#FFFFFF", fontSize: 16 }}
                  onPress={Save}>
            Guardar
          </Button>
          {
            loading == true ? <Portal>
              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', bottom: 0, backgroundColor: 'black', opacity: 0.5}}>
                <ActivityIndicator animating={true} color={'white'} size={'large'} />
              </View>
            </Portal> : []
          }
        </View>
      </PaperProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
  },
  vImage: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center'
  },
  img: {
    height: 200,
    width: '100%',

  },
  inputs: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  input: {
    backgroundColor: 'white',
    marginVertical: 10
  },
  btnBack: {
    position: 'relative',
    marginTop: 20,
    marginStart: 20,
    backgroundColor: '#9FD356',

  },
  btnSave: {
    marginTop: 10,
    width: 200,
    marginStart: 'auto',
    marginEnd: 'auto'
  }
});
