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

import Images from './app/components/Images';
import * as Progress from "react-native-progress";
import getTheme from "./native-base-theme/components";
import Home from "./app/components/Home";
import Scan from "./app/components/Scan";
import History from "./app/components/History";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

import Index from "./app/Index";
import commonColor from "./native-base-theme/variables/commonColor";
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const APPNAME = "BarCoder";
const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 20 : StatusBar.currentHeight;
const baseUrl = "http://newdev.itntdev.co.za/ntiyiso/www.scanapp.co.za/";

/* Components */
import Welcome from './app/components/welcomeLoader/Welcome'; //loader
import Login from './app/components/Login'; //loader
import ViewHistory from './app/components/ViewHistory';

/* Beauty */


export default class App extends Component {
  constructor(props) {
    super(props);
	
    this.app =this.app.bind(this)
  }
  state = {
	isLogin: true,
	appReady: false,
    fontLoaded: false,
    enter: true,
    count: 0,
    heading: "Scans history",
    component: "home",
    forgotPassword: false,
    login: true,
    authorised: false,
    tokenUrl: null,
    progress: 0,
    indeterminate: true,
    showProgressBar: false,
    authoticated: false,
    account_id: null,
    isReady: false,
    internetConnection: NetInfo.isConnected.fetch(),
	buttonDisabled: true,
	errorField: false,
	wrongCredintials: false
  };
  
  app(){
	  
  }
  
  viewHistory(obj){
	  return <ViewHistory data={obj}/>
  }
  onPressFooterTab = (setComponent = null) => {
    this.setState({
      component: setComponent
    });
  };
  showApp(){
	  alert('From Main App')
  }
  cacheImages(images) {
    return images.map(image => {
      if (typeof image === "string") {
        return Image.prefetch(image);
      } else {
        return Asset.fromModule(image).downloadAsync();
      }
    });
  }
  async _loadAssetsAsync() {
	  
	_images = new Array();
	Object.keys(Images).map((k) => {
		_images.push(Images[k])
	})
	_images.push(require("./app/images/logo.png"))
	_images.push(require("./app/images/icon.png"))
	
	
    //const fontAssets = await this.cacheFonts([require("./app/fonts/Painting.ttf"), require("./app/fonts/Roboto-Medium.ttf")]);

    await Promise.all([..._images]);
  }
  async cacheFonts(fonts) {
    return fonts.map(font => Font.loadAsync(font));
  }

  animate() {
    let progress = 0;
    this.setState({ progress });
    setTimeout(() => {
      this.setState({ indeterminate: false });
      setInterval(() => {
        progress += Math.random() / 5;
        if (progress > 10) {
          progress = progress - 10;
        }
        this.setState({ progress });
      }, 500);
    }, 1500);
  }
  
  render(){
	return (
		<Root>
			<StyleProvider style={getTheme(commonColor)}>  
				<Container>
					<StatusBar backgroundColor="#386890" barStyle="light-content"/>
					{ ! this.state.fontLoaded ? 
						<Welcome/> : 
						this.state.isLogin ? this.content() :
						<Login />} 
				</Container>
			</StyleProvider>
		</Root>
	)
  }
  

  
  _requestCameraPermission = async () => {
    const {status} = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({
      hasCameraPermission: status === "granted"
    })
  }
  
  
  
  
  
  
  
  
  
  
  
  __render() {
    if (!this.state.isReady) {
      return (
	  <StyleProvider style={getTheme(commonColor)}>
        <Container>
        <AppLoading
          startAsync={this._loadAssetsAsync()}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
		 </Container>
		</StyleProvider>
       
      );
    } else {
      if (this.state.enter) {
        return <Welcome />;
      } else if (this.state.authorised) {
        return <Root>{this.content()}</Root>;
      } else {
        //AsyncStorage.getItem('token', (error, result) => {console.log(result)});
        return this.loginPage();
      }
    }
  }

  scan() {
    this.setState({ component: "history" });
  }
  
  
  home() {
    this.setState({ component: "history" });
  }
  
  _scan(){
	  
  }
  content() {
    return (
      <StyleProvider style={getTheme(commonColor)}>
        <Container>
          <View
            style={{
              height: STATUSBAR_HEIGHT
            }}
          >
          <StatusBar 
			backgroundColor="black"
			barStyle="light-content"
			/>
          </View>
          <Header>
		  {
			this.state.component != 'history' ?
            <Left>
              <Button transparent onPress={() => this.home()}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
			: <Left/>
		  }
            <Body>
              <Title>{this.state.component.toUpperCase()}</Title>
            </Body>
            <Right>
              <Button transparent>
                <Icon name="menu" />
              </Button>
            </Right>
          </Header>
          <Content>
            {this.state.component == "home" ? (
              <History app={this.app} main={this.bindThis.bind(this)} scan={this._scan.bind(new Scan())}/>
            ) : this.state.component == "scan" ? (
              <Scan scan={this.scan.bind(this)} />
            ) : this.state.component == "history" ? (
              <History
                app={this.app}
				scan={this._scan.bind(new Scan())}
              />
            ) : (
              <Index accountId={this.state.accountId} />
            )}
          </Content>
          <Footer>
            <FooterTab>
              <Button 
					vertical 
					onPress={() => this.onPressFooterTab("history")}
					>
					
                <Icon name="ios-list" />
                <Text>History</Text>
              </Button>
              <Button vertical onPress={() => this.onPressFooterTab("scan")}>
                <Icon name="barcode" />
                <Text>Scan</Text>
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      </StyleProvider>
    );
  }

  

  bindThis(){
	  
  }
  
  
  loginPage() {
	 var d = new Date();
	var n = d.getFullYear();
	const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0
    return (
	  <StyleProvider style={getTheme(commonColor)}>
        <Container>
	  <View style={styles.containerLogin}>
	   <KeyboardAvoidingView style={{alignItems: 'center', paddingTop: deviceHeight*0.11}} behavior='position' keyboardVerticalOffset={keyboardVerticalOffset}>
        <Image style={styles.login} source={require("./app/images/logo.png")} />
        <Text style={styles.welcomeText}>{APPNAME}</Text>
        {this.state.showProgressBar ? (
          <View> 
		 <ActivityIndicator  size="small" color="white" />
		 <Text style={{color: 'orange', alignSelf: 'center'}}>Logging in...</Text>
		 </View>
        ) : null}
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
		<Text style={{position: 'absolute', bottom:25, color: 'white', fontSize: 9,alignSelf: 'center'}}>Copyright{'\u00A9'} {n} ITNT . All rights reserved </Text>
		</View>
	</Container>
	 </StyleProvider>
        );
  }

  async componentDidMount() {
	  
	this._requestCameraPermission()
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
      appFont: require("./app/fonts/Painting.ttf"),
      Roboto_medium: require("./app/fonts/Roboto-Medium.ttf"),
	  gomarice: require("./app/fonts/gomarice_goma_block.ttf")
    });
	
	
    this.setState({ fontLoaded: true });
    setTimeout(() => {
      this.setState({ enter: false });
    }, 5000);

    return this.state.enter ? this.welcomeLoading() : this.content();
  }
  
  componentWillMount() {
        //NavigationBar.setColor('#ffab8e')
    }

  keyboardControl() {
    //return Keyboard.show()
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
                this.keyboardControl();
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
              {this.state.showProgressBar ? "Logging in ..." : "Login"}
            </Text>
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
    paddingTop: deviceHeight*0.08,
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
