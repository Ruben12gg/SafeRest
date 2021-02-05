import React from "react";
import { Image, StyleSheet, View, PermissionsAndroid, BackHandler } from "react-native";
import {ActivityIndicator} from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';


const SplashScreen = ({navigation}) => {

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getTokenAsyncStorage()
      } else {
        BackHandler.exitApp();
      }
    } catch (err) {
      console.warn(err);
    }
  };

  requestLocationPermission()

  const verifyToken = () => {
    let url = DOMAIN + '/auth'
    fetch(url, {
      method: 'GET',
      headers: {
         Accept: 'application/json',
        'Authorization': TOKEN,
        'Content-Type': 'application/json'
      }
    }).then((res) => res.json()).then((json) => {
      if (json.toString() == '{"message": "invalid signature", "name": "JsonWebTokenError"}'){
        navigation.navigate("Login")
      } else {
        if (json.userType.name == "manager"){
          IDRESTAURANT = json.idRestaurant
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                { name: 'AppManager' },

              ],
            })
          );
        } else {
          IDUSER = json.id
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                { name: 'AppClient' },

              ],
            })
          );
        }
      }
    }).catch((error) => {
      console.error('Error:', error);
    });
  }

  const getTokenAsyncStorage= async () => {
    const value = await AsyncStorage.getItem('@token');
    if (value !== null) {
      TOKEN = value
      verifyToken()
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { name: 'Login' },

          ],
        })
      );
    }
  }


  return(
    <>

      <View style={styles.container}>
        <Image style={styles.logo} source={require('./src/img/logo.png')} />
        <ActivityIndicator style={styles.spinner} animating={true} color="#FFFFFF" />
      </View>

    </>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#9FD356"
  },
  logo: {
    marginBottom: 50
  },
  spinner: {
    marginTop: 50
  }
});

export default SplashScreen;
