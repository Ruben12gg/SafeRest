import React, { useState } from 'react';
import { BottomNavigation, Text } from 'react-native-paper';

import RestaurantDetails from "../../Fragments/Manager/ManagerRestaurantDetails";
import Comments from '../../Fragments/Manager/Comments';

/* Define screen components  */
const RestaurantDetailsRoute = () => <RestaurantDetails />;
const CommentsRoute = () => <Comments />;

const AppManager = ({ navigation }) => {

  /* Setup screen tabs */
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'restaurant_info', title: 'Informações', icon: 'information' },
    { key: 'comments', title: 'Comentários', icon: 'comment-multiple' },

  ]);

  /* Setup screen routes */
  const renderScene = BottomNavigation.SceneMap({
    restaurant_info: RestaurantDetailsRoute,
    comments: CommentsRoute,

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

export default AppManager;
