import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image, TouchableHighlight, ScrollView, LogBox } from "react-native";
import { TextInput, IconButton, Button, Provider as PaperProvider, Portal, Avatar,Snackbar, ActivityIndicator } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';


export default function EditProfile() {

    LogBox.ignoreAllLogs();

    const [loading, setLoading] = useState(true)
    const navigation = useNavigation();

    /* Setup variables */
    const [name, setName] = useState('');
    const [letters, setLetters] = useState("")
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [idUserType, setIdUserType] = useState()
    const [passwordVisibility, setPasswordVisibility] = useState(true)
    const [passwordVisibilityIcon, setPasswordVisibilityIcon] = useState("eye")

    const [errorMessage, setErrorMessage] = useState('')
    const [visibleErrorSnackBar, setVisibleErrorSnackBar] = useState(false);
    const onDismissSnackBar = () => setVisibleErrorSnackBar(false);

    const url = DOMAIN + '/users/' + IDUSER


    useEffect(() => {

        /* Fetch get user infos */
        fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Authorization': TOKEN,
                'Content-Type': 'application/json'
            },
        }).then((res) => res.json()).then((json) => {


            setName(json.name);
            setUsername(json.username);
            setEmail(json.email);
            setIdUserType(json.idUserType)

            setLetters(json.name[0]+""+json.name.split(' ')[1][0])
            setLoading(false)

        }).catch((error) => {
            console.error(Error, error);
        });

    }, []);


    /* Function that handles user info update */
    const Update = () => {

        setLoading(true)

        const data = {
            name: name,
            email: email,
            username: username,
            idUserType: idUserType
        }

        if(password !== ""){
            data.password = password
        }



        fetch(url, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Authorization': TOKEN,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then((res) => res.json()).then((json) => {
            if(json.message == 'User Updated'){
                setPassword('')
                setLoading(false)
                setErrorMessage('Dados do atualizados')
                setVisibleErrorSnackBar(true)
            }
        }).catch((error) => {
            console.error('Error:', error);
        });


    }

    return (
        <>
        <PaperProvider>
            <View style={styles.container}>
                <Portal>
                    <IconButton
                      style={styles.btnBack}
                      icon="chevron-left"
                      color="black"
                      size={30}
                      onPress={() => { navigation.goBack() }}
                    />
                </Portal>
                <Avatar.Text color={'white'} style={styles.avatar}
                             theme={{ colors: { primary: '#9FD356', text: 'white' } }}
                             size={100}
                             label={letters} />
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
                               autoCompleteType="email"
                               mode="outlined"
                               theme={{colors: {primary: '#9FD356', placeholder: 'black', text: "black"}}}
                               label="Email"
                               value={email}
                               onChangeText={email => setEmail(email)}
                    />
                    <TextInput style={styles.input}
                               secureTextEntry={passwordVisibility}
                               autoCompleteType="password"
                               mode="outlined"
                               theme={{colors: {primary: '#9FD356', placeholder: 'black', text: "black"}}}
                               label="Password"
                               value={password}
                               onChangeText={password => setPassword(password)}
                               right={<TextInput.Icon name={passwordVisibilityIcon} onPress={() => {
                                   if(passwordVisibilityIcon == "eye" && passwordVisibility == true){
                                       setPasswordVisibilityIcon("eye-off")
                                       setPasswordVisibility(false)
                                   } else if (passwordVisibilityIcon == "eye-off" && passwordVisibility == false){
                                       setPasswordVisibilityIcon("eye")
                                       setPasswordVisibility(true)
                                   }
                               }}/>}
                    />
                    <View style={styles.viewBtnAdicionar}>
                        <Button style={styles.btnAdicionar}
                                mode="contained"
                                theme={{colors: {primary: 'white', underlineColor: 'transparent', text: "white"}}}
                                labelStyle={{ color: "white", fontSize: 16 }}
                                onPress={Update}>
                            Adicionar
                        </Button>
                    </View>
                </ScrollView>
            </View>
            <Snackbar
              visible={visibleErrorSnackBar}
              onDismiss={onDismissSnackBar}
              theme={{ colors: {onSurface: "white",surface: 'black'}}}>
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
        bottom: 0,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    avatar: {
        marginTop: 75
    },
    input: {
        width: '100%',
        marginVertical: 5,
        backgroundColor: 'white'
    },
    inputs: {
        marginTop: 20,
        width: '100%',
    },
    btnAdicionar: {
        marginTop: 10,
        width: 200,
        backgroundColor: '#9FD356',

    },
    viewBtnAdicionar:{
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
});
