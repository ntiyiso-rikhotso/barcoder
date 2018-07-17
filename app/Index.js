import React, { Component } from 'react';
import { View } from 'react-native';
import Home from './components/Home';
import Scan from './components/Scan';
import History from './components/History';


export default class Index extends Component{
	constructor(props){
		super(props)
		this.onPressFooterTab = this.onPressFooterTab.bind(this)
	}
	render(){
		return(<View><History/></View>);
	}
	
	onPressFooterTab = () => {
		alert('Pressed')
	};
}