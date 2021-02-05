import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from "./SplashScreen";
import Login from "./Components/Login";
import Register from "./Components/Register";
import RestaurantDetails from './Components/Client/RestaurantDetails';
import RestaurantInfoEdit from './Components/Manager/RestaurantInfoEdit';
import Map from './Components/Client/Map'
import AddRestaurant from './Components/Admin/AddRestaurant';
import AppManager from './Components/Manager/AppManager';

/* Client */
import AppClient from "./Components/Client/AppClient";
import Comments from './Fragments/Manager/Comments';
import EditProfile from './Components/Client/EditProfile';

const Stack = createStackNavigator();

/* Define screen stacks */
const Main = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="AppClient" component={AppClient} />
        <Stack.Screen name="RestaurantDetails" component={RestaurantDetails} />
        <Stack.Screen name="RestaurantInfoEdit" component={RestaurantInfoEdit} />
        <Stack.Screen name="Map" component={Map} />
        <Stack.Screen name="AddRestaurant" component={AddRestaurant} />
        <Stack.Screen name="Comments" component={Comments} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="AppManager" component={AppManager} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Main
