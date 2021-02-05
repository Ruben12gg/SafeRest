import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, TouchableHighlight, Linking, ScrollView, LogBox } from "react-native";
import {
  DefaultTheme,
  IconButton,
  Button,
  Provider as PaperProvider,
  Portal,
  Title,
  Card,
  Subheading,
  FAB,
  Dialog,
  Paragraph,
  TextInput,
  Avatar,
  ActivityIndicator,
} from "react-native-paper";

export default function RestaurantDetails({ route, navigation }) {

  LogBox.ignoreAllLogs();

  const { idRestaurant } = route.params;

  /* Define styling theme for some visual components */
  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors
    },
  };

  /* Setup variables */
  const [name, setName] = useState('');
  const [maxCap, setMaxCap] = useState('∞');
  const [currentCap, setCurrentCap] = useState('∞');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [map, setMap] = useState('');
  const [image, setImage] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [loading, setLoading] = useState(true);

  const urlRestInfo = DOMAIN + '/restaurants/' + idRestaurant
  const urlRestInOuts = DOMAIN + '/inouts/restaurant/' + idRestaurant
  const urlComments = DOMAIN + '/comments/restaurant/' + idRestaurant
  const urlPostComment = DOMAIN + '/comments/'
  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);

  /* Function that posts a comment and hides input box */
  const sendPost = () => {

    /* Setup data to post */
    let commentData = {
      comment: commentInput,
      idUser: IDUSER,
      idRestaurant: idRestaurant
    }

    /* Fetch post of that data */
    fetch(urlPostComment, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Authorization': TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(commentData)
    }).then((res) => res.json()).then((json) => {
      console.log(json);
      setCommentInput('')
    }).catch((error) => {
      console.error(Error, error);
    });

    /* Hide input box */
    setVisible(false)
  };

  /* Function that hides the input box */
  const hideDialog = () => {
    setCommentInput('')
    setVisible(false)
  };


  /* Fetch get restaurant infos */
  useEffect(() => {
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
    /* Fetch get comments for the restaurant */
    fetch(urlComments, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Authorization': TOKEN,
        'Content-Type': 'application/json'
      },
    }).then((res) => res.json()).then((json) => {
      setComments(json)
    }).catch((error) => {
      console.error(Error, error);
    });
    /* Calling the function that gets the restaurant's capacity */
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
              <View style={styles.comments}>
                <Title style={{ color: 'black' }}>Comentários</Title>
                <View style={{ width: '100%', height: 2, backgroundColor: '#9FD356' }} />
                {
                  comments.length > 0 ?
                    comments.sort( (c1, c2) => {
                      if (c1.id > c2.id) return -1
                      if (c1.id < c2.id) return 1
                      else return 0
                    }).map((comment, i) =>
                      <Card style={styles.card} key={i}>
                        <Card.Content style={styles.card}>
                          <View style={styles.cardHeader}>
                            <Avatar.Text color={'white'} style={styles.avatar}
                              theme={{ colors: { primary: '#9FD356', text: 'white' } }}
                              size={40}
                              label={comment.user.name[0] + comment.user.name.split(" ")[1][0]} />
                            <View style={styles.infoUser}>
                              <Text style={styles.name}>@{comment.user.username}</Text>
                              <Text>{comment.createdAt.split("T")[0].split("-").reverse().join("/")}</Text>
                            </View>
                          </View>
                          <Text style={styles.commentText}>{comment.comment}</Text>
                        </Card.Content>
                      </Card>
                    ) : <View style={{ alignItems: 'center' }}><Subheading style={{ color: 'black' }}>Sem Comentários</Subheading></View>}
              </View>
            </View>
          </ScrollView>
          <FAB
            style={styles.fab}
            small={0}
            icon="plus"
            color={'white'}
            onPress={showDialog}
          />
        </View>
        <Portal>
          <Dialog theme={theme} visible={visible} onDismiss={hideDialog}>
            <Dialog.Title theme={theme}>Adicionar Comentário</Dialog.Title>
            <Dialog.Content>
              <TextInput style={styles.commentInput}
                mode="outlined"
                multiline={true}
                theme={{
                  colors: {
                    primary: '#9FD356',
                    placeholder: 'black',
                    underlineColor: 'black',
                    text: "black"
                  }
                }}
                label="Comentário"
                focus={true}
                value={commentInput}
                onChangeText={comment => setCommentInput(comment)} />
            </Dialog.Content>
            <Dialog.Actions theme={theme}>
              <Button color={'#9fd356'} onPress={hideDialog} >Cancelar</Button>
              <Button color={'#9fd356'} onPress={sendPost}>Adicionar</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
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
  card: {
    /*padding: 10,*/
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: 'white'
  },
  infoUser: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  commentText: {
    marginTop: 10
  },
  cardHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#9FD356'
  },
  commentInput: {
    backgroundColor: 'white',
  }
});
