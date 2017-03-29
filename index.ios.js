import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Button } from 'react-native';
import Firestack from 'react-native-firestack';
//social login with react-native-oauth
import OAuthManager from 'react-native-oauth';

const manager = new OAuthManager('firebase');
manager.configure({
  facebook: {
    client_id: '279450639144478',
    client_secret: '8a14db88abaf38b67e9e73c8eaf21c8d'
  },
  google: {
    callback_url: `https://fir-b0a07.firebaseapp.com/__/auth/handler`,
    client_id: '1025260391269-j13o67cmvkdkqcbficjbt5jbig4pi29g.apps.googleusercontent.com',
    client_secret: 'M5Q309pL4FqJ6UGbR7njgBhy'
  }
});

//4/aJ-Og1C2GsJ70dqkwbV5GvRiAkyjUOi4Ie4Mt6h0qjQ


const configurationOptions = {
  	debug: true,
};
const firestack = new Firestack(configurationOptions);


export default class firebase extends Component {

	constructor(props) {
		super(props);
		this.signGoogle = this.signGoogle.bind(this);
		this.signFacebook = this.signFacebook.bind(this);
		this.accessToken = "";
	}

	signGoogle() {
		firestack.on('debug', msg => console.log('Received debug message', msg))
		console.log(firestack.auth().onAuthStateChanged)
		firestack.auth().onAuthStateChanged(user => {
			if (user) {
				console.log(user)
			} else {
				manager.authorize('google', {scopes: 'https://www.googleapis.com/auth/drive.readonly'})
				.then(resp => console.log('here', resp))
				.catch(err => console.log('There was an error'));
			}
		});

		// manager.authorize('google', {scopes: 'https://www.googleapis.com/auth/drive.readonly'})
		// .then(resp => console.log(resp))
		// .catch(err => console.log('There was an error'));

		// firestack.auth.signInWithProvider('google', token, '')
		// .then((user)=>{
		// 	console.log(user)
		// })
	}

	signFacebook() {
		firestack.on('debug', msg => console.log('Received debug message', msg))
		console.log(firestack.auth().onAuthStateChanged)
		console.log(firestack.auth().signInWithCustomToken)
		firestack.auth().onAuthStateChanged(user => {
			if (user) {
				console.log(user)
			} else {
				manager.authorize('facebook')
				.then(resp => {
					this.accessToken = resp.response.credentials.accessToken;
					firestack.auth().signInWithProvider('facebook', this.accessToken, '')
				})
				.catch(err => console.log(err));
			}
		});
		// firestack.auth().signInWithCustomToken('facebook', this.accessToken, '') // facebook need only access token.
		// .then((user)=>{
		// 	console.log(user)
		// })
	}

	render() {
		return (
			<View style={styles.container}>
			<Text style={styles.welcome}>
				Welcome to Firebase!
			</Text>
			<Text style={styles.instructions}>
				This is a simple app showing {'\n'} how firebase authentication works.
			</Text>
			<Button onPress={this.signGoogle} title="Google Sign In/Up" color='#841584' />
			<Button onPress={this.signFacebook} title="Facebook Sign In/Up" color='#841584' />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5,
	},
});

AppRegistry.registerComponent('firebase', () => firebase);
