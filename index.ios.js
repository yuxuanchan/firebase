import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Button } from 'react-native';
// import Firestack from 'react-native-firestack';
import RNfirebase from 'react-native-firebase';
//social login with react-native-oauth
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

// const configurationOptions = {
//   	debug: true,
// };
// const firestack = new Firestack(configurationOptions);

// const instance = RNfirebase.initializeApp({
// 	debug: __DEV__ ? '*' : false,
// 	errorOnMissingPlayServices: false,
// 	persistence: true,
// });

const instance = new RNfirebase({debug: __DEV__ ? '*' : false});


export default class firebase extends Component {

	constructor(props) {
		super(props);
		this.state = {
			authorized: false,
			provider: '',
			// signedWith: '',
		};
		this.signGoogle = this.signGoogle.bind(this);
		this.signFacebook = this.signFacebook.bind(this);
		this.signOut = this.signOut.bind(this);
		this.renderSignOutButton = this.renderSignOutButton.bind(this);
		this.renderSignInButton = this.renderSignInButton.bind(this);
		this.unsubscribe = null;
	}

	signGoogle() {
		 this.unsubscribe = instance.auth().onAuthStateChanged(user => {
			if (user) {
				console.log(user)
				this.setState({ authorized: true });
			} else {
				manager.authorize('google', {scopes: 'https://www.googleapis.com/auth/plus.login+'})
				.then(resp => {
					console.log(resp);
					const token = resp.response.credentials.accessToken;
					instance.auth().signInWithCredential({provider: 'google', token: resp.response.credentials.accessToken, secret: ''})
					.then((user)=>{
						console.log(user);
						this.setState({ authorized: true, provider: 'google' });
					})
					.catch(err => console.log('Firebase error:', err));
				})
				.catch(err => console.log('OAUTH error:', err));
			}
		});
	}

	signFacebook() {
		 this.unsubscribe = instance.auth().onAuthStateChanged(user => {
			if (user) {
				console.log(user)
				this.setState({ authorized: true });
			} else {
				manager.authorize('facebook')
				.then(resp => {
					console.log(resp);
					instance.auth().signInWithCredential({provider: 'facebook', token: resp.response.credentials.accessToken, secret: ''})
					.then((user)=>{
						console.log(user);
						this.setState({ authorized: true, provider: 'facebook' });
					})
					.catch(err => console.log(err));
				})
				.catch(err => console.log(err));
			}
		});
	}

	signOut() {
		if (this.unsubscribe) {
			this.unsubscribe();
		}
		if (this.state.provider === 'facebook') {
			manager.deauthorize('facebook');
		} else {
			manager.deauthorize('google');
		}
		instance.auth().signOut()
		.then(() => {
			this.setState({ authorized: false, provider: '' });
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
		console.log(this.state.authorized, instance.auth().currentUser)
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
