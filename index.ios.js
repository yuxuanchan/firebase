import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Button } from 'react-native';
// import Firestack from 'react-native-firestack';
import RNfirebase from 'react-native-firebase';
import OAuthManager from 'react-native-oauth';

const manager = new OAuthManager('firebase');
manager.configure({
	google: {
		callback_url: `com.googleusercontent.apps.1025260391269-v96q1hpu3pdo8tm3u7mu99933anhna6k:/google`,
		client_id: '1025260391269-v96q1hpu3pdo8tm3u7mu99933anhna6k.apps.googleusercontent.com'
	},
	facebook: {
		client_id: '279450639144478',
		client_secret: '8a14db88abaf38b67e9e73c8eaf21c8d'
	}
});

const firebaseInstance = new RNfirebase({debug: __DEV__ ? '*' : false});


export default class firebase extends Component {

	constructor(props) {
		super(props);
		this.state = {
			choice: '',
			authorized: false,
		};
		this.signGoogle = this.signGoogle.bind(this);
		this.signFacebook = this.signFacebook.bind(this);
		this.sign = this.sign.bind(this);
		this.signOut = this.signOut.bind(this);
		this.renderSignOutButton = this.renderSignOutButton.bind(this);
		this.renderSignInButton = this.renderSignInButton.bind(this);
		this.signInWithCredentials = this.signInWithCredentials.bind(this);
		this.unsubscribe = null;
		this.scope = null;
		this.credential = null;
		this.choice = '';
	}

	signGoogle() {
		this.choice = 'google';
		this.sign();
	}

	signFacebook() {
		this.choice = 'facebook';		
		this.sign();
	}

	signInWithCredentials(resp) {
		if (this.choice === 'facebook'){
			this.credential = {
				provider: 'facebook',
				token: resp.response.credentials.accessToken,
				secret: '',
			};
		} else if (this.choice === 'google'){
			this.credential = {
				provider: 'google',
				token: resp.response.credentials.accessToken,
				secret: '',
			};
		}
		firebaseInstance.auth().signInWithCredential(this.credential)
		.then((user)=>{
			this.setState({ authorized: true });
		})
		.catch(err => console.log(err));
	}

	sign() {
		 this.unsubscribe = firebaseInstance.auth().onAuthStateChanged(user => {
			if (user) {
				console.log(user);
				this.setState({ authorized: true });
				console.log('User has already logged in')
			} else {
				console.log(this.choice)
				if (this.choice === 'google') {
					this.scope = {
						scopes: 'https://www.googleapis.com/auth/plus.login+',
					};
				} else {
					this.scope = null;
				}
				manager.authorize(this.choice, this.scope)
				.then(resp => {
					console.log(resp);
					this.signInWithCredentials(resp);
				})
				.catch(err => console.log(err));
			}
		});
	}

	signOut() {
		if (this.unsubscribe) {
			this.unsubscribe();
		}
		manager.deauthorize(this.choice);
		firebaseInstance.auth().signOut()
		.then(() => {
			this.setState({ authorized: false });
		})
		.catch(err => console.log(err));
	}

	renderSignOutButton() {
		return (
			<Button onPress={this.signOut} title="Sign Out" color='#841584' />
		);
	}

	renderSignInButton() {
		return (
			<View>
				<Button onPress={this.signGoogle} title="Google Sign In/Up" color='#841584' />
				<Button onPress={this.signFacebook} title="Facebook Sign In/Up" color='#841584' />
			</View>
		);
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
			{this.state.authorized === true ? this.renderSignOutButton() : this.renderSignInButton() }
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
