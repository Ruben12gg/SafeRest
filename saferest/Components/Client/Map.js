import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import { DefaultTheme, TextInput, IconButton, Portal, Provider as PaperProvider, Searchbar, Card, Avatar, List } from 'react-native-paper';

const Map = () => {

  const navigation = useNavigation();

  /* Define styling theme for some visual components */
  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: '#3498db',
      accent: '#f1c40f',
    },
  };

  /* Setup variables */
  const [restaurants, setRestaurants] = useState([])
  const [restaurantsFiltered, setRestaurantsFiltered] = useState([])
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const onChangeSearch = (query) => {
    searchFilterFunction(query)
    setSearchQuery(query);
  };

  const url = DOMAIN + '/restaurants'

  /* Function that filters the query */
  const searchFilterFunction = (text) => {
    const newData = restaurants.filter(function (item) {
      const itemData = item.name
        ? item.name.toUpperCase()
        : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setRestaurantsFiltered(newData);

  };

  /* Getting user geo coords */
  Geolocation.getCurrentPosition((info) => {
    setLatitude(info.coords.latitude);
    setLongitude(info.coords.longitude);
  });

  /* Calling the function that gets Restaurants */
  useEffect(() => {
    getRestaurants();
  }, []);

  /* Function that gets restaurants */
  const getRestaurants = () => {
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Authorization': TOKEN,
        'Content-Type': 'application/json'
      },
    }).then((res) => res.json()).then((json) => {
      if (json.message == 'Restaurants not found'){
        setRestaurants([])
      } else {
        setRestaurants(json)
      }
    }).catch((error) => {
      console.error(Error, error);
    });
  };


  return (
    <>
      <PaperProvider><View style={styles.container}>
        <Portal>

          <Searchbar
            style={styles.searchbar}
            theme={theme}
            placeholder="Pesquisar (min. 3 letras)"
            onChangeText={onChangeSearch}
            value={searchQuery}
          />
          <View style={{ padding: 20, marginTop: -40 }}>
            {
              searchQuery.length >= 3 ?
                restaurantsFiltered.map((restaurant, index) => (
                  <List.Item
                    key={index}
                    onPress={() => { navigation.navigate('RestaurantDetails', { idRestaurant: restaurant.id }) }}
                    theme={theme}
                    style={{ backgroundColor: 'white', marginTop: 5 }}
                    title={restaurant.name}
                    left={props => <List.Icon color={'#9fd356'} style={{ margin: 0 }} icon="silverware-fork-knife" />}
                  />
                )) : []
            }
          </View>
        </Portal>

        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>
          {restaurants.map((marker, index) => (
            <Marker onCalloutPress={() => { navigation.navigate('RestaurantDetails', { idRestaurant: marker.id }) }}
              key={index}
              coordinate={{
                latitude: parseFloat(marker.latitude),
                longitude: parseFloat(marker.longitude),
              }}
              title={marker.name}
              description={unescape(marker.address)}
              pinColor='#9FD356' />
          ))}
        </MapView>
      </View></PaperProvider>

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
  },
  searchbar: {
    margin: 20,
    backgroundColor: 'white'
  }

});

export default Map;
