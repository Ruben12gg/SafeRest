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
    Snackbar,
    Portal,
    Provider as PaperProvider,
    ActivityIndicator,
    Dialog,
    DefaultTheme,
} from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from "@react-navigation/native";

const Login = ({ navigation }) => {

    const theme = {
        ...DefaultTheme,
        roundness: 2,
        colors: {
            ...DefaultTheme.colors
        },
    };

    /* Setup variables */
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisibility, setPasswordVisibility] = useState(true)
    const [passwordVisibilityIcon, setPasswordVisibilityIcon] = useState("eye")
    const [errorMessage, setErrorMessage] = useState('')
    const [visibleErrorSnackBar, setVisibleErrorSnackBar] = useState(false);
    const onDismissSnackBar = () => setVisibleErrorSnackBar(false);
    const [loading, setLoading] = useState(false)
    const [emailRecover, setEmailRecover] = useState('');

    const [visible, setVisible] = React.useState(false);
    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    /* Function that handles authentication */
    const Auth = () => {

        if (password == "" || email == ""){
            setErrorMessage('Preencher todos os campos')
            setVisibleErrorSnackBar(true)
        } else {
        setLoading(true)

        /* Check if user is admin, manager or client */
        const verifyUserType = () => {
            let url = DOMAIN + '/auth'
            fetch(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Authorization': TOKEN,
                    'Content-Type': 'application/json'
                }
            }).then((res) => res.json()).then((json) => {

                /*  If it's a manager, send user to manager main screen */
                if (json.userType.name == "manager") {
                    IDRESTAURANT = json.idRestaurant
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                                { name: 'AppManager' },

                            ],
                        })
                    );
                    /* If it's a client, send user to client main screen */
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

            }).catch((error) => {
                console.error('Error:', error);
            });
        }

        /* Saving user token as global variable */
        const saveToken = async (value) => {
            try {
                await AsyncStorage.setItem('@token', value)
                TOKEN = value
                verifyUserType()
            } catch (e) {
                // saving error
            }
        }

        /* Setup login credentials */
        const url = DOMAIN + "/auth"
        const data = {
            "email": email,
            "password": password
        }

        /* Sending and checking if the login credentials are valid */
        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then((res) => res.json()).then((json) => {
            if (json.message == "Email and/or password wrong!"){
                setLoading(false)
                setErrorMessage('Email ou Palavra-Passe errada')
                setVisibleErrorSnackBar(true)
            } else {
                console.log(json);
                saveToken(json.token)
            }

            console.log(json);
        }).catch((error) => {
            console.error('Error:', error);
        });
        }

    }

    const RecoverPassword = () => {
        if (emailRecover == ""){
            console.log('Invalido');
        } else {
            const url = DOMAIN + '/resetpassword'
            const data = {
                email: emailRecover
            }

            fetch(url, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then((res) => res.json()).then((json) => {
                if (json.message == "User not found"){
                    setErrorMessage('Email inexistente')
                    setVisibleErrorSnackBar(true)
                } else {
                    hideDialog()
                    setEmailRecover('')
                    setErrorMessage('Nova password recebida no email!')
                    setVisibleErrorSnackBar(true)
                }

                console.log(json);
            }).catch((error) => {
                console.error('Error:', error);
            });
        }
    }


    return (
        <><PaperProvider>
            <View style={styles.container}>
                <Image style={styles.logo} source={require('../src/img/logo.png')} />
                <View style={styles.inputs}>
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
                <Button style={styles.btnLogin} mode="contained"
                    theme={{ colors: { primary: 'white', underlineColor: 'transparent', text: "white" } }}
                    labelStyle={{ color: "#9FD356", fontSize: 16 }}
                    onPress={Auth}>
                    Login
                </Button>
                <Button style={styles.btnRecoverPassword} mode="text"
                    labelStyle={{ color: "white", fontSize: 13 }}
                    onPress={showDialog}>
                    Recuperar Password
                </Button>
                <View style={styles.bottom}>
                    <Button style={styles.btnRegister} mode="outlined"
                        labelStyle={{ color: "white", fontSize: 13 }}
                        onPress={() => navigation.navigate('Register')}>
                        Registar
                    </Button>
                </View>
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
                <Portal>
                    <Dialog theme={theme} visible={visible} onDismiss={hideDialog}>
                        <Dialog.Title theme={theme}>Recuperar Password</Dialog.Title>
                        <Dialog.Content>
                            <TextInput style={styles.recoverPassword}
                                       keyboardType="email-address"
                                       textContentType="emailAddress"
                                       autoCapitalize="none"
                                       mode="outlined"
                                       theme={{
                                           colors: {
                                               primary: '#9FD356',
                                               placeholder: 'black',
                                               underlineColor: 'black',
                                               text: "black"
                                           }
                                       }}
                                       label="Email"
                                       focus={true}
                                       value={emailRecover}
                                       onChangeText={emailRecover => setEmailRecover(emailRecover)} />
                        </Dialog.Content>
                        <Dialog.Actions theme={theme}>
                            <Button color={'#9fd356'} onPress={hideDialog} >Cancelar</Button>
                            <Button color={'#9fd356'} onPress={RecoverPassword}>Recuperar</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>

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
        marginTop: 50,
    },
    input: {
        width: '100%',
        backgroundColor: '#9FD356',
    },
    inputs: {
        marginTop: 20,
        width: '100%',
        paddingHorizontal: '7.5%'
    },
    btnLogin: {
        marginTop: 10,
        width: 200,
        backgroundColor: '#FFFFFF',
    },
    btnRecoverPassword: {

    },
    btnRegister: {
        width: 200,
        borderColor: 'white',
        position: 'absolute',
        bottom: 0

    },
    bottom: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 36
    },
    recoverPassword: {
        backgroundColor: 'white',
    }
});

export default Login;
