import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, ScrollView, Linking, LogBox } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { IconButton, Avatar, Text, Title, Card, Subheading, Portal, Provider as PaperProvider, ActivityIndicator } from 'react-native-paper';
import { CommonActions } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {

  LogBox.ignoreAllLogs();

  const navigation = useNavigation();

  /* Setup variables */
  const [name, setName] = useState('');
  const [nameLetters, setNameLetters] = useState('');
  const [username, setUsername] = useState('');
  const [comments, setComments] = useState([]);
  const [userType, setUserType] = useState('client');
  const [loading, setLoading] = useState(false)

  const [easterEgg, setEasterEgg] = useState(0);


  const urlUserData = DOMAIN + '/users/' + IDUSER
  const urlUserComments = DOMAIN + '/comments/user/' + IDUSER

  const EasterEgg = () => {

    let meme = Math.floor(Math.random() * 2) + 1;
    setEasterEgg(easterEgg + 1)
    console.log(easterEgg);
    console.log(meme);

    if (easterEgg === 3 && meme === 1) {
      Linking.openURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
      setEasterEgg(0)
    } else if (easterEgg === 3 && meme === 2) {
      Linking.openURL('https://www.youtube.com/watch?v=SCqd3vJ3pPs')
      setEasterEgg(0)
    }

  }

  /* Function that gets username name initials to make a profile avatar */
  const getLetters = () => {
    let splittedName = name.split(" ")
    setNameLetters(splittedName[0][0].toUpperCase() + "" + splittedName[1][0].toUpperCase())

  }

  /* Function that handles the logout */
  const logout = () => {
    /* Erase token and sen user back to login screen */
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

  /* Fetch Get all the user's comments */
  useEffect(() => {
    setLoading(true)
    fetch(urlUserComments, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Authorization': TOKEN,
        'Content-Type': 'application/json'
      },
    }).then((res) => res.json()).then((json) => {
      if (json.message == 'Comments not found') {
        setComments([])
      } else {
        setComments(json)
      }
    }).catch((error) => {
      console.error(Error, error);
    });
  }, [])

  /* Fetch get user info */
  fetch(urlUserData, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Authorization': TOKEN,
      'Content-Type': 'application/json'
    },
  }).then((res) => res.json()).then((json) => {
    setName(json.name)
    setUsername(json.username)
    setUserType(json.userType.name)
    getLetters()
    setLoading(false)

  }).catch((error) => {
    console.error(Error, error);
  });


  return (
    <>
      <PaperProvider>

        <View style={styles.container}>
          <View style={styles.infoUserAvatar}>
            <IconButton style={{ backgroundColor: '#9FD356', position: 'absolute', marginTop: 48 }}
              icon="silverware-fork-knife"
              color="#9FD356"
              size={25}
              onPress={EasterEgg} />
            <Avatar.Text color={'white'} style={styles.avatar}
              theme={{ colors: { primary: '#9FD356', text: 'white' } }}
              size={85}
              label={nameLetters} />
            <View style={styles.infoUser}>
              <Text style={styles.name} >{name}</Text>
              <View style={styles.usernameEdit}>
                <Text style={{ color: '#000000' }}>{username}</Text>
                <IconButton
                  style={styles.editButton}
                  icon="pencil"
                  color="white"
                  size={15}
                  onPress={() => { navigation.navigate('EditProfile') }} />
              </View>
            </View>


            {
              userType == 'admin' ?
                <View style={styles.rightButtons}>
                  <IconButton style={styles.addRestaurantButton}
                    icon="silverware-fork-knife"
                    color="white"
                    size={25}
                    onPress={() => navigation.navigate("AddRestaurant")} />
                  <IconButton style={styles.logoutAdminButton}
                    icon="logout"
                    color="white"
                    size={25}
                    onPress={logout} />

                </View>

                : <View style={styles.rightButtons}>
                  <IconButton style={styles.logoutButton}
                    icon="logout"
                    color="white"
                    size={25}
                    onPress={logout} />

                </View>
            }
          </View>
          <View style={styles.comments}>
            <Title style={{ color: '#000000' }} onPress={EasterEgg}>Comentários</Title>
            <View style={{ width: '100%', height: 2, backgroundColor: '#9FD356' }} />
            <ScrollView style={styles.commentsList}>
              {
                comments.length > 0 ?
                  comments.sort((c1, c2) => {
                    if (c1.id > c2.id) return -1
                    if (c1.id < c2.id) return 1
                    else return 0
                  }).map((comment, i) =>
                    <Card style={styles.card} key={i}>
                      <Card.Content style={styles.card}>
                        <View style={styles.cardHeader}>
                          <Text style={styles.nameRestaurantComment}>{comment.restaurant.name}</Text>
                          <Text style={styles.dateCard}>{comment.createdAt.split("T")[0].split("-").reverse().join("/")}</Text>
                        </View>
                        <Text style={styles.commentText}>{comment.comment}</Text>
                      </Card.Content>
                    </Card>
                  ) : <View style={{ alignItems: 'center' }}><Subheading>Sem Comentários</Subheading></View>}


              {
                loading == true ? <Portal>
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', bottom: 0, backgroundColor: 'black', opacity: 0.5 }}>
                    <ActivityIndicator animating={true} color={'white'} size={'large'} />
                  </View>
                </Portal> : []
              }
            </ScrollView>
          </View>
        </View>
      </PaperProvider>




    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    bottom: 0,

  },
  infoUserAvatar: {
    margin: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',

  },
  avatar: {

  },
  infoUser: {
    marginLeft: 20,
    justifyContent: 'center',
    height: 85,

  },
  usernameEdit: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',

  },
  editButton: {
    backgroundColor: '#9FD356',
  },
  name: {
    fontSize: 20,
    color: '#000000',

  },
  comments: {
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    height: 100,
    color: '#000000',

    flex: 1,
  },
  commentsList: {
    paddingTop: 10
  },
  card: {
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: '#ffffff'
  },
  nameRestaurantComment: {
    color: '#000000',
    fontWeight: 'bold'

  },
  dateCard: {
    position: 'absolute',
    right: 0,
    color: '#000000',

  },
  commentText: {
    marginTop: 10,
    color: '#000000',

  },
  cardHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  rightButtons: {
    position: 'absolute',
    right: 0,
  },
  addRestaurantButton: {
    backgroundColor: '#9FD356',
  },
  logoutButton: {
    backgroundColor: '#9FD356',
  },
  logoutAdminButton: {
    backgroundColor: '#9FD356',
  }

});
