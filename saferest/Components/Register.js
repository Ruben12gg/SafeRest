import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView
} from 'react-native';
import {
  TextInput,
  Button,
  ActivityIndicator,
  IconButton,
  Snackbar,
  Provider as PaperProvider,
  Portal,
} from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from "@react-navigation/native";

const Register = ({ navigation }) => {

  /* Setup variables */
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState(true)
  const [passwordVisibilityIcon, setPasswordVisibilityIcon] = useState("eye")
  const [errorMessage, setErrorMessage] = useState('')
  const [visibleErrorSnackBar, setVisibleErrorSnackBar] = useState(false);
  const onDismissSnackBar = () => setVisibleErrorSnackBar(false);
  const [loading, setLoading] = useState(false)

  const Auth = () => {
    setLoading(true)
    /* Setup profile data */
    const url = DOMAIN + "/users"
    const data = {
      "name": name,
      "email": email,
      "password": password
    }

    /* Fetch post of the profile data */
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then((res) => res.json()).then((json) => {
      console.log(json);
      if (json.errors) {
        console.log(json.errors[0].message);
        setLoading(false)
        /* Check if user is already registered */
        if (json.errors[0].message == "email_UNIQUE must be unique") {
          setErrorMessage('Email já registado')
          setVisibleErrorSnackBar(true)
        }

        /* If everything's alright, call login function after registration */
      } else {
        Login()
      }

    }).catch((error) => {
      console.error('Error:', error);
    });

  }

  /* Function that handles the login */
  const Login = () => {
    const saveToken = async (value) => {
      try {
        await AsyncStorage.setItem('@token', value)
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              { name: 'AppClient' },

            ],
          })
        );
      } catch (e) {
        // saving error
      }
    }

    /* Setting up login credentials */
    const url = DOMAIN + "/auth"
    const data = {
      "email": email,
      "password": password
    }

    /*  Fecth post of login data */
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then((res) => res.json()).then((json) => {
      saveToken(json.token)
    }).catch((error) => {
      console.error('Error:', error);
    });
  }

  return (
    <>
      <PaperProvider>
      <View style={styles.backBtn}>
        <IconButton
          icon="chevron-left"
          color="white"
          size={30}
          onPress={() => navigation.goBack()}
        />
      </View>
      <View style={styles.container}>
        <Image style={styles.logo} source={require('../src/img/logo.png')} />
        <View style={styles.inputs}>
          <TextInput style={styles.input}
            autoCompleteType="name"
            mode="outlined"
            theme={{ colors: { primary: 'white', underlineColor: 'transparent', text: "white" } }}
            label="Nome"
            value={name}
            onChangeText={name => setName(name)}
          />
          <TextInput style={styles.input}
                     keyboardType="email-address"
                     textContentType="emailAddress"
                     autoCapitalize="none"
                     autoCompleteType="email"
                     mode="outlined"
                     theme={{ colors: { primary: 'white', underlineColor: 'transparent', text: "white" } }}
                     label="Email"
                     value={email}
                     onChangeText={email => setEmail(email)}
          />
          <TextInput style={styles.input}
            secureTextEntry={passwordVisibility}
            autoCompleteType="password"
            mode="outlined"
            theme={{ colors: { primary: 'white', underlineColor: 'transparent', text: "white" } }}
            label="Password"
            value={password}
            onChangeText={password => setPassword(password)}
            right={<TextInput.Icon name={passwordVisibilityIcon} onPress={() => {
              if (passwordVisibilityIcon == "eye" && passwordVisibility == true) {
                setPasswordVisibilityIcon("eye-off")
                setPasswordVisibility(false)
              } else if (passwordVisibilityIcon == "eye-off" && passwordVisibility == false) {
                setPasswordVisibilityIcon("eye")
                setPasswordVisibility(true)
              }
            }} />}
          />
        </View>
        <Button style={styles.btnRegister} mode="contained"
          theme={{ colors: { primary: 'white', underlineColor: 'transparent', text: "white" } }}
          labelStyle={{ color: "#9FD356", fontSize: 16 }}
          onPress={Auth}>
          Registar
        </Button>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    bottom: 0,
    backgroundColor: '#9FD356'
  },
  logo: {
    marginTop: 10,
  },
  input: {
    width: '100%',
    backgroundColor: '#9FD356',
  },
  inputs: {
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
    paddingHorizontal: "7.5%"
  },
  btnRegister: {
    marginTop: 20,
    width: 200,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    backgroundColor: '#9FD356'
  }
});

export default Register;
