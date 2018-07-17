import React, { Component } from 'react';
import { Font, AppLoading, Asset } from 'expo';
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
  Text
} from "react-native";
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const APPNAME = "BarCoder";
const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 20 : StatusBar.currentHeight;
const baseUrl = 'http://newdev.itntdev.co.za/ntiyiso/www.scanapp.co.za/';

export default class Loading extends Component{
	state = {
		isReady: false,
		width: deviceWidth * 0.3,
		height: deviceWidth * 0.3,
		appReady: false
	}
	getWidth = () =>{
		
				return setInterval(
					() => {
						this.setState({
							width: this.state.width + this.state.width*0.00010,
							height: this.state.width
						})
					}
				
				, 100);
				
			
			
			
			
		
		
	}
	
	render(){
		const icon = Platform.OS === "ios" ? "apple" : "android";
		return (
			<View style={styles.container}>
				<Image style={styles.logo} source={require("../images/logo.png")} />
				
				<ActivityIndicator style={{paddingTop: 60 }}size="small" color="black" />
			  </View>
		);
		
	}
	async componentDidMount() {
    await Font.loadAsync({
      appFont: require("../fonts/Painting.ttf"),
      Roboto_medium: require("../fonts/Roboto-Medium.ttf")
    });
    this.setState({ fontLoaded: true });
    setTimeout(() => {
      this.setState({ enter: false });
    }, 1000);

    return this.state.enter ? this.welcomeLoading() : this.content();
  }
	
	_loadAssetsAsync = async () => {
	
		const imageAssets = cacheImages([
			  require('../images/logo.png'),
			  require('../images/icon.png'),
			]);

		const fontAssets = this.cacheFonts([FontAwesome.font]);
		await Promise.all([...imageAssets, ...fontAssets]);
		
		return true;
	}
	cacheFonts = (fonts) =>  {
	  return fonts.map(font => Font.loadAsync(font));
	}
	
	cacheImages = (images) => {
	  return images.map(image => {
		if (typeof image === 'string') {
		  return Image.prefetch(image);
		} else {
		  return Asset.fromModule(image).downloadAsync();
		}
	  });
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
    paddingTop: 70,
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
    padding: 20,
    paddingTop: 10,
    fontSize: 65,
    color: "white",
    fontFamily: "appFont",
    backgroundColor: "transparent"
  },
  topContent: {
    paddingTop: 3,
    padding: 10,
    fontSize: 65,
    fontFamily: "appFont",
    backgroundColor: "transparent"
  },
  logo: {
    width: deviceWidth * 0.3,
    height: deviceWidth * 0.3,
    padding: 10,
    resizeMode: "stretch",
    alignSelf: "center"
  },
  login: {
    width: deviceWidth * 0.3,
    height: deviceWidth * 0.3,
    padding: 10,
    marginTop: 15,
    resizeMode: "stretch",
    alignSelf: "center"
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  }
});