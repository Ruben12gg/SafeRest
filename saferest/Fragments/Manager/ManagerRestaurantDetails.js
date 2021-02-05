import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, TouchableHighlight, Linking, ScrollView, LogBox } from 'react-native';
import { Button, IconButton, Portal, Provider as PaperProvider, Snackbar, ActivityIndicator } from "react-native-paper";
import { CommonActions, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RestaurantDetails() {
  LogBox.ignoreAllLogs();

  const [loading, setLoading] = useState(true)

  const navigation = useNavigation();

  /* Setup Variables */
  const [name, setName] = useState('');
  const [maxCap, setMaxCap] = useState('∞');
  const [currentCap, setCurrentCap] = useState('∞');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [map, setMap] = useState('')
  const [image, setImage] = useState(null)

  const [errorMessage, setErrorMessage] = useState('')
  const [visibleErrorSnackBar, setVisibleErrorSnackBar] = useState(false);
  const onDismissSnackBar = () => setVisibleErrorSnackBar(false);

  const urlRestInfo = DOMAIN + '/restaurants/' + IDRESTAURANT
  const urlRestInOuts = DOMAIN + '/inouts/restaurant/' + IDRESTAURANT
  const urlPostInOuts = DOMAIN + '/inouts'

  useEffect(() => {
    /* Fetch get restaurant infos */
    fetch(urlRestInfo, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Authorization': TOKEN,
        'Content-Type': 'application/json'
      },
    }).then((res) => res.json()).then((json) => {
      setName(json.name);
      setMaxCap(json.maxCapacity);
      setPhone(json.telephone);
      setAddress(json.address);
      setLatitude(json.latitude);
      setLongitude(json.longitude);
      setImage(json.images)
      setMap('https://maps.googleapis.com/maps/api/staticmap?center=' + json.latitude + ',' + json.longitude + '&zoom=15&size=370x150&markers=color:green%7C' + json.latitude + ',' + json.longitude + '&key=AIzaSyBpQKv-QiFU5HiayBwqKeeqh0_LHYlZTEI')
      setLoading(false)
    }).catch((error) => {
      console.error(Error, error);
    });
    getInOuts()
  })

  /* Function that gets the restaurant's capacity */
  const getInOuts = (() => {
    fetch(urlRestInOuts, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Authorization': TOKEN,
        'Content-Type': 'application/json'
      },
    }).then((res) => res.json()).then((json) => {
      setCurrentCap(json.inOuts);
    }).catch((error) => {
      console.error(Error, error);
    });
  })

  /* Function that manually adds an entry to the restaurant's capacity */
  const inRest = (() => {
    const data = {
      "type": 'in',
      "idRestaurant": IDRESTAURANT
    }

    /* Fetch post of the entry data */
    fetch(urlPostInOuts, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then((res) => res.json()).then((json) => {
      setErrorMessage('Entrada com sucesso')
      setVisibleErrorSnackBar(true)
      getInOuts()
    }).catch((error) => {
      console.error('Error:', error);
    });
  })

  /* Function that manually removes an entry to the restaurant's capacity */
  const outRest = (() => {
    const data = {
      "type": 'out',
      "idRestaurant": IDRESTAURANT
    }


    /* Fetch post of the removal of the entry data */
    fetch(urlPostInOuts, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then((res) => res.json()).then((json) => {
      setErrorMessage('Saída com sucesso')
      setVisibleErrorSnackBar(true)
      getInOuts()
    }).catch((error) => {
      console.error('Error:', error);
    });
  })

  /* Function that handles logout */
  const logout = () => {
    /* Erase toke and send userto login screen */
    TOKEN = ''
    IDUSER = ''
    AsyncStorage.removeItem('@token');
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'Login' },

        ],
      })
    );
  }

  return (
    <>
      <PaperProvider>
        <Portal>
          <IconButton style={styles.logoutButton}
            icon="logout"
            color="white"
            size={25}
            onPress={logout} />
        </Portal>
        <View style={styles.container}>

          {
            image == null ?
              <Image style={styles.img} source={require('../../src/img/indisponivel.png')} /> :
              <Image style={styles.img} source={{ uri: image }} />
          }
          <ScrollView>
            <View style={styles.nameInfoRest}>
              <View style={styles.vName}>
                <Text style={styles.tName}>{name}</Text>
              </View>
              <View style={styles.infoRest}>
                <View style={styles.vCapacity}>
                  <Text style={styles.capacity}>{currentCap}/{maxCap}</Text>
                  <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Lotação</Text>
                </View>
                <View style={styles.vTelephone}>
                  <Text onPress={() => { Linking.openURL(`tel:${phone}`); }} style={styles.telephone}>{phone}</Text>
                  <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Telefone</Text>
                </View>
              </View>
              <Text style={styles.address}>{address}</Text>
              <TouchableHighlight style={{ marginTop: 10 }} onPress={() => { Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`) }}>
                <Image style={styles.map} source={{ uri: map }} />
              </TouchableHighlight>
              <View style={styles.inOutsBtn}>
                <Button style={styles.btnIn} mode="contained"
                  labelStyle={{ color: "white", fontSize: 13 }}
                  onPress={inRest}>
                  Entrada
              </Button>
                <Button style={styles.btnOut} mode="contained"
                  labelStyle={{ color: "white", fontSize: 13 }}
                  onPress={outRest}>
                  Saída
              </Button>
              </View>
              <Button style={styles.btnEditar} mode="outlined"
                labelStyle={{ color: "#9FD356", fontSize: 13 }}
                onPress={() => navigation.navigate('RestaurantInfoEdit')}>
                Editar
            </Button>
            </View>

          </ScrollView>
        </View>
        <Snackbar
          visible={visibleErrorSnackBar}
          onDismiss={onDismissSnackBar}
          theme={{ colors: { onSurface: "white", surface: 'black' } }}>
          {errorMessage}
        </Snackbar>
        {
          loading == true ? <Portal>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', bottom: 0, backgroundColor: 'black', opacity: 0.5}}>
              <ActivityIndicator animating={true} color={'white'} size={'large'} />
            </View>
          </Portal> : []
        }
      </PaperProvider>
    </>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    bottom: 0
  },
  img: {
    height: 200,
    width: '100%',
  },
  nameInfoRest: {
    paddingHorizontal: 20
  },
  vName: {
    alignItems: 'center',
    paddingVertical: 10
  },
  tName: {
    fontWeight: 'bold',
    fontSize: 25
  },
  infoRest: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vCapacity: {
    width: '40%',

  },
  capacity: {
    backgroundColor: '#9FD356',
    padding: 10,
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    color: 'white'
  },
  vTelephone: {
    width: '40%'
  },
  telephone: {
    backgroundColor: '#9FD356',
    padding: 10,
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    color: 'white'
  },
  address: {
    width: '100%',
    marginTop: 10,
    backgroundColor: '#9FD356',
    padding: 10,
    color: 'white',
  },
  map: {
    width: '100%',
    height: 150
  },
  inOutsBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  btnIn: {
    width: '45%',
    backgroundColor: '#9FD356',
  },
  btnOut: {
    width: '45%',
    backgroundColor: '#9FD356',
  },
  btnEditar: {
    width: '100%',
    borderColor: '#9FD356',
    marginTop: 10,
    marginBottom: 10
  },
  logoutButton: {
    backgroundColor: '#9FD356',
    right: 0,
    position: 'absolute',
  },
});
