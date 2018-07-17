import { Font, AppLoading, Asset, Permissions } from "expo";
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
  KeyboardAvoidingView,
  Text
} from "react-native";

import Images from '../../components/Images';
import { Actions } from 'react-native-router-flux';
import Login from '../Login'

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 20 : StatusBar.currentHeight;


export default class Welcome extends Component {
  state = {
	  ready: false,
  }
  render(){
	if(this.state.ready){
		return <Login/>
	}else{
		return this.loading()
	}
    
	
  }
  
  loading(){
	  
	  var d = new Date();
	  var n = d.getFullYear();
	  return (
			<View style={styles.container}>
				<Image style={styles.logo} source={Images['logo']} />
				<Text style={styles.version}> V 1.9.0 </Text>
				<ActivityIndicator style={styles.loader} size="large" color="white" />
				
				<Text style={styles.copyright}>{'\u00A9'} Copyright {n} ITNT . All rights reserved </Text>
			</View>)
  }
  
  async componentDidMount(){
	  
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
      //alert("Error fetching data");
    }

    await Font.loadAsync({
      appFont: require("../../fonts/Painting.ttf"),
      Roboto_medium: require("../../fonts/Roboto-Medium.ttf"),
	  gomarice: require("../../fonts/gomarice_goma_block.ttf")
    });
	
	
    setTimeout(() => {
		this.setState({ fontLoaded: true , ready: true});
	}, 5000)
	
		
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#386890"
  },

  logo: {
    width: deviceWidth * 0.3,
    height: deviceWidth * 0.3,
    padding: 10,
    resizeMode: "stretch",
    alignSelf: "center",
	marginBottom: 200
  },
  loader:{
	  position: 'absolute', 
	  bottom:50 
  },
  copyright:{
	position: 'absolute', 
	bottom:25, 
	color: 'white', 
	fontSize: 9 
  },
   version:{
	position: 'absolute', 
	margin:3, 
	color: 'white', 
	fontSize: 10 
  }
  
});
