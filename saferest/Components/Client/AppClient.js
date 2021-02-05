import React, { useState } from 'react';
import { BottomNavigation, Text } from 'react-native-paper';

import Map from "./Map";
import Home from '../../Fragments/Client/Home';
import Profile from '../../Fragments/Client/Profile';


/* Define screen components */
const HomeRoute = () => <Map />;
const ProfileRoute = () => <Profile />;

const AppClient = ({ navigation }) => {

  /* Setup screen tabs */
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'home', title: 'Home', icon: 'home' },
    { key: 'profile', title: 'Perfil', icon: 'account' },

  ]);

  /* setup screen routes */
  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    profile: ProfileRoute,

  });

  return (
    <>
      <BottomNavigation
        barStyle={{ backgroundColor: '#9FD356' }}
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </>
  );
};

export default AppClient;
