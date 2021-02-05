import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { DefaultTheme, Provider as PaperProvider, Portal, Title, Card, Subheading, Avatar, ActivityIndicator } from "react-native-paper";

export default function RestaurantDetails({ navigation }) {
    const [loading, setLoading] = useState(true)

    /* Setup variables */
    const [comments, setComments] = useState([])
    const urlComments = DOMAIN + '/comments/restaurant/' + IDRESTAURANT

    useEffect(() => {
        /* Get all the comments from a certain the restaurant */
        fetch(urlComments, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Authorization': TOKEN,
                'Content-Type': 'application/json'
            },
        }).then((res) => res.json()).then((json) => {
            setComments(json)
            setLoading(false)
        }).catch((error) => {
            console.error(Error, error);
        });
    })

    return (
        <>
            <PaperProvider>

                <View style={styles.container}>

                    <View style={styles.comments}>
                        <Title style={{ color: 'black' }}>Comentários</Title>
                        <View style={{ width: '100%', height: 2, backgroundColor: '#9FD356' }} />
                        <ScrollView>
                            {
                                comments.length > 0 ?
                                    comments.reverse().map((comment, i) =>
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
                        </ScrollView>
                    </View>
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        bottom: 0,
        padding: 20
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
});
