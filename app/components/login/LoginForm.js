import { Font } from "expo";
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
  AsyncStorage
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
  Form
} from "native-base";
import * as Progress from 'react-native-progress';
import getTheme from "./native-base-theme/components";
import Home from "./app/components/Home";
import Scan from "./app/components/Scan";
import History from "./app/components/History";
import LoginForm from "./app/components/login/LoginForm"

import Index from "./app/Index";
import commonColor from "./native-base-theme/variables/commonColor";
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const APPNAME = "BarCoder";
const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 20 : StatusBar.currentHeight;
const baseUrl = 'http://newdev.itntdev.co.za/ntiyiso/www.scanapp.co.za/';
export default class LoginForm extends Component{
	render(){
		return (
		<Form style={{ width: deviceWidth * 0.9, marginTop: 15 }}>
          <Item style={{ backgroundColor: "white" }} rounded>
            <Icon active name="lock" />
            <Input
              Success
              keyboardType={"numeric"}
              autoFocus
              onChangeText={username => this.usernameField(username)}
              onFocus={() => {
                this.keyboardControl();
              }}
              placeholder="Enter your phone number to reset password"
            />
          </Item>

          <Button style={{ marginTop: 11, borderRadius: 20 }} info block>
            <Text>reset password</Text>
          </Button>
          <Button
            onPress={() => {
              this.setState({ forgotPassword: false, login: true });
            }}
            style={{ marginTop: 11, borderRadius: 20 }}
            bordered
            success
            block
          >
            <Text>Back to login</Text>
          </Button>
        </Form>)
	}
}