import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView
} from 'react-native';
import {
  TextInput,
  Appbar,
  Button,
  Snackbar,
  Provider as PaperProvider,
  ActivityIndicator,
  Portal, DefaultTheme,
} from "react-native-paper";
import {Notifications} from 'react-native-notifications';


export default function AddRestaurant({ navigation }) {

  /* setup variables */
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [telephone, setTelephone] = useState('');
  const [capacity, setCapacity] = useState('');
  const [email, setEmail] = useState('');

  const [errorMessage, setErrorMessage] = useState('')
  const [visibleErrorSnackBar, setVisibleErrorSnackBar] = useState(false);
  const onDismissSnackBar = () => setVisibleErrorSnackBar(false);

  const [loading, setLoading] = useState(false)

  /* Function that adds the Rest info to the DB */
  const Add = () => {

    setLoading(true)

    /* setup data do send */
    const url = DOMAIN + "/restaurants"
    const data = {
      "name": name,
      "address": address,
      "telephone": telephone,
      "maxCapacity": capacity,
      "email": email
    }

    /* fetch post said data */
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Authorization': TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then((res) => res.json()).then((json) => {

      /* Problem handler  */
      if (json.errors) {
        if (json.errors[0].message == "idUser_UNIQUE must be unique") {
          setLoading(false)
          setVisibleErrorSnackBar(true)
          setErrorMessage('Email já utilizado')
        } else {
          setLoading(false)
          setVisibleErrorSnackBar(true)
          setErrorMessage('Obrigatório preencher todos os campos')
        }

      } else if (json.message == 'Email not found') {
        setVisibleErrorSnackBar(true)
        setErrorMessage('Email não encontrado')
      } else {
        navigation.goBack()
        Notifications.postLocalNotification({
          title: name,
          body: "Restaurante criado",
        });
      }
    }).catch((error) => {
      console.error(Error, error);
    });


  };

  return (
    <>
      <PaperProvider>
      <Appbar.Header style={{ backgroundColor: '#9FD356' }}>
        <Appbar.BackAction color='white' onPress={() => { navigation.goBack() }} />
        <Appbar.Content color='white' title="Adicionar Restaurante" />
      </Appbar.Header>
      <View style={styles.container}>
        <ScrollView style={styles.inputs}
          contentInsetAdjustmentBehavior="automatic">
          <TextInput style={styles.input}
            mode="outlined"
            theme={{colors: {primary: '#9FD356', placeholder: 'black', text: "black"}}}
            label="Nome"
            value={name}
            onChangeText={name => setName(name)}
          />
          <TextInput style={styles.input}
            mode="outlined"
            theme={{colors: {primary: '#9FD356', placeholder: 'black', text: "black"}}}
            label="Morada"
            value={address}
            onChangeText={address => setAddress(address)}
          />
          <TextInput style={styles.input}
            keyboardType="phone-pad"
            mode="outlined"
            theme={{colors: {primary: '#9FD356', placeholder: 'black', text: "black"}}}
            label="Telefone"
            value={telephone}
            onChangeText={telephone => setTelephone(telephone)}
          />
          <TextInput style={styles.input}
            keyboardType="number-pad"
            mode="outlined"
            theme={{colors: {primary: '#9FD356', placeholder: 'black', text: "black"}}}
            label="Lotação Máxima"
            value={capacity}
            onChangeText={capacity => setCapacity(capacity)}
          />
          <TextInput style={styles.input}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoCapitalize="none"
            mode="outlined"
            theme={{colors: {primary: '#9FD356', placeholder: 'black', text: "black"}}}
            label="Email do utilizador"
            value={email}
            onChangeText={email => setEmail(email)}
          />
          <View style={styles.viewBtnAdicionar}>
            <Button style={styles.btnAdicionar}
              mode="contained"
              theme={{ colors: { primary: 'white', underlineColor: 'transparent', text: "white" } }}
              labelStyle={{ color: "white", fontSize: 16 }}
              onPress={Add}>
              Adicionar
            </Button>
          </View>
        </ScrollView>
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
      </View>
      </PaperProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    bottom: 0,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: 64,
    backgroundColor: '#9FD356'
  },
  input: {
    width: '100%',
    marginVertical: 5,
    backgroundColor: 'white',
  },
  inputs: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: '7.5%',
  },
  btnAdicionar: {
    marginTop: 10,
    width: 200,
    backgroundColor: '#9FD356',

  },
  viewBtnAdicionar: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

});
