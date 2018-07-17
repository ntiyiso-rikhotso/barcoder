import { Font, AppLoading, Asset } from "expo";
import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  Platform,
  Keyboard,
  AsyncStorage,
  NetInfo,
  KeyboardAvoidingView
} from "react-native";

import {
  Tab,
  Tabs,
  TabHeading,
  StyleProvider,
  Container,
  Header,
  Content,
  Footer,
  FooterTab,
  Button,
  Icon,
  Text,
  Left,
  Right,
  Body,
  Title,
  Item,
  Input,
  Label,
  Form,
  Root
} from "native-base";

import Images from './Images';

import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 20 : StatusBar.currentHeight;
const baseUrl = "https://scannedit.co.za/";

const APPNAME = "BarCoder";
import { Actions } from 'react-native-router-flux';
/* Beauty */


export default class Login extends Component {
  state = {
	  showProgressBar: false,
	  internetConnection: NetInfo.isConnected.fetch(),
  }
  render() {
	 var d = new Date();
	var n = d.getFullYear();
	const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0
    return (
	
	  <View style={styles.containerLogin}>
	   <KeyboardAvoidingView style={{alignItems: 'center', paddingTop: deviceHeight*0.11}} behavior='position' keyboardVerticalOffset={keyboardVerticalOffset}>
        <Image style={styles.login} source={Images['logo']} />
        <Text style={styles.welcomeText}>{APPNAME}</Text>
        
		{
			this.state.wrongCredintials ?
			<Text style={{color: '#EEA596',alignSelf: 'center'}}>Wrong username or password</Text> : null 
		}
		{
			this.state.networkError ?
			<Text style={{color: '#EEA596',alignSelf: 'center'}}>An error occurred, please report to system administrator</Text> : null
		}
		
        {this.authoticationInput()}
		 </KeyboardAvoidingView>
		 <Text style={styles.version}>V 1.9.1 </Text>
		<Text style={{position: 'absolute', bottom:25, color: 'white', fontSize: 9,alignSelf: 'center'}}>Copyright{'\u00A9'} {n} ITNT . All rights reserved </Text>
		</View>
        );
  }
  
  validateEmail(email){
		var re = /\S+@\S+\.\S+/;
		return re.test(email);
  }
  
  getProps(){
	  return this.props.app;
  }
  
  async login() {
    if (this.state.internetConnection) {
      this.setState({ showProgressBar: true });
     
      setTimeout(() => {
        var formData = new FormData();
        formData.append("username", this.state.username);
        formData.append("password", this.state.password);

        let postData = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data"
          },
          body: formData
        };

        fetch(baseUrl + "app/auth/", postData)
          .then(response => response.json())
          .then(responseJson => {
            //alert(JSON.stringify(responseJson))
            if (responseJson.status) {
			 
              this.setState(responseJson);
              this.setState({ authorised: true });
              var userdata = Object.assign(responseJson, { authorised: true });
              try {
                AsyncStorage.setItem("userdata", JSON.stringify(userdata));
              } catch (error) {
                //alert("error");
              }

               Actions.home()
            } else {
              //Cookie.set('http;//text.co.za', 'token', 'token', false);
              AsyncStorage.setItem("token", JSON.stringify({ token: false}));
			  this.setState({wrongCredintials: true})
			  
            }
          })
          .catch(error => {
			  
			  alert(error)
            this.setState({networkError: true})
          });
        this.setState({ showProgressBar: false });
      }, 3000);
    } else {
      //connect to the internet
    }
  }

  async componentDidMount() {
    var userdata = await AsyncStorage.getItem("userdata");
    if (userdata != null) {
      userdata = JSON.parse(userdata);
      if (userdata.authorised) {
        this.setState({ authorised: true });
      }
    }

    try {
      AsyncStorage.getItem("_scans").then(info => {}); //set State of history
    } catch (error) {
      alert("Error fetching data");
    }

    await Font.loadAsync({
      appFont: require("../fonts/Painting.ttf"),
      Roboto_medium: require("../fonts/Roboto-Medium.ttf"),
	  gomarice: require("../fonts/gomarice_goma_block.ttf")
    });
	
	
    this.setState({ fontLoaded: true });
    setTimeout(() => {
      this.setState({ enter: false });
    }, 5000);

    return this.state.enter ? this.welcomeLoading() : this.content();
  }
  
  

  usernameField(username) {
	  
	let isValid = this.validateEmail(username)
	
    this.setState({ username: username });
	if(username == '' || !isValid && (username.length < 10 || username.length > 10) ){
		this.setState({buttonDisabled: true, errorField: true})
	}else{
		this.setState({buttonDisabled: false, errorField: false})
	}
  }
  
  
  passwordField(password) {
    this.setState({ password: password });
  }
  authoticationInput() {
    if (this.state.forgotPassword && !this.state.login) {
      return (
        <Form style={{ width: deviceWidth * 0.9, marginTop: deviceWidth * 0.08 }}>
          <Item style={{ backgroundColor: "white", borderRadius: 10}} regular error={this.state.errorField}>
            <Icon active name="lock" />
            <Input
              
              autoFocus
              onChangeText={username => this.usernameField(username)}
              onFocus={() => {
                this.keyboardControl();
              }}
              placeholder="Enter your phone number to reset password"
            />
          </Item>

          <Button style={{ marginTop: 11, borderRadius: 10 }} info block>
            <Text>reset password</Text>
          </Button>
          <Button
            onPress={() => {
              this.setState({ forgotPassword: false, login: true });
            }}
            style={{ marginTop: 11, borderRadius: 10 }}
            bordered
            success
            block
          >
            <Text>Back to login</Text>
          </Button>
        </Form>
      );
    } else {
      return (
        <Form style={{ width: deviceWidth * 0.9, marginTop: 15 }}>
          <Item style={{ backgroundColor: "white" , borderRadius: 10}} regular error={this.state.errorField}>
            <Icon active name="person" />
            <Input
			 
              placeholder="Phone number/Email address"
              onChangeText={username => this.usernameField(username)}
            />
          </Item>
          <Item style={{ backgroundColor: "white", marginTop: 7 , borderRadius: 10}} regular>
            <Icon active name="lock" />
            <Input
              onChangeText={username => this.passwordField(username)}
              onFocus={() => {
                
              }}
              secureTextEntry={true}
              placeholder="password"
            />
          </Item>

          <Button
		    disabled={this.state.buttonDisabled}
            onPress={() => {
              Keyboard.dismiss();
              this.login();
            }}
            style={{ marginTop: 11, borderRadius: 10 }}
            info
            block
          >
            <Text>
              {this.state.showProgressBar ? "Please wait..." : "Login"}
			</Text>
			{this.state.showProgressBar ? <ActivityIndicator  size="small" color="white" /> : null}
			
          </Button>
          <Button
            onPress={() => {
              Keyboard.dismiss();
              this.setState({ forgotPassword: true, login: false });
            }}
            bordered
            style={{ marginTop: 11, borderRadius: 10 }}
            warning
            block
          >
            <Text>forgot password</Text>
          </Button>
        </Form>
      );
    }
  }
  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow() {
    //alert('Keyboard Shown');
  }

  _keyboardDidHide() {
    //alert('Keyboard Hidden');
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#386890"
  },
  containerLogin: {
    flex: 1,
    alignItems: "center",
    //paddingTop: deviceHeight*0.08,
    backgroundColor: "#386890"
  },
  statusBar: {
    height: STATUSBAR_HEIGHT
  },

  content: {
    paddingTop: 20,
    width: deviceWidth,
    height: deviceHeight * 0.3,
    alignItems: "center"
    //flexDirection: 'row'
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  },
  topLogo: {
    height: deviceHeight * 0.2 * 0.8,
    width: deviceWidth / 3,
    resizeMode: "stretch",
    padding: 5
  },
  welcomeText: {
    padding: deviceHeight*0.020,
    paddingTop: deviceHeight*0.020,
    fontSize: deviceWidth*0.15,
	alignSelf: 'center',
    color: "white",
    fontFamily: "gomarice",
    backgroundColor: "transparent"
  },
  topContent: {
    paddingTop: 3,
    padding: 10,
    fontSize: 65,
    fontFamily: "gomarice",
    backgroundColor: "transparent"
  },
  logo: {
    width: deviceWidth * 0.3,
    height: deviceWidth * 0.3,
    padding: 10,
    resizeMode: "stretch",
    alignSelf: "center",
	marginBottom: 200
  },
  login: {
    width: deviceWidth * 0.25,
    height: deviceWidth * 0.25,
    padding: 10,
    marginTop: 15,
    resizeMode: "stretch",
    alignSelf: "center"
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  },
   version:{
	margin:10, 
	color: 'white', 
	fontSize: 10,
  }
});
