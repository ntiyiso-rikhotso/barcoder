import React from 'react';
import {Card, CardItem, Text, Icon, Thumbnail, Right, Left, Body, SwipeRow, Button} from 'native-base';
import {
  NetInfo,
  View,
  StyleSheet,
  Alert,
  Dimensions,
  ActivityIndicator,
  Image,
  AsyncStorage,
  ToastAndroid,
  FlatList,
  TouchableHighlight
} from "react-native"
import Images from './Images';
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome"

const deviceHeight = Dimensions.get("window").height
const deviceWidth = Dimensions.get("window").width
export default class History extends React.Component {
  state = {
	  heading : 'Scans history',
	  _history: [],
	  refreshing: false,
	  comfirmPage: false,
	  scan: false
  }
 
 render() {

	  return(
			<View>{
				this._render()
			}</View>
		)
 }
 
 _resendScan (obj){
	 //return alert(obj)
	 alert(this.props.scan)
 }
 deleteHistoryItem(key){
	try {
		AsyncStorage.getItem('_scans').then((info) => {
			var data = JSON.parse(info)
			if (key > -1) {
				
				if(data.length < 2){
					key = 0;
				}
				data.splice(key, 1);
				 AsyncStorage.setItem('_scans', JSON.stringify(data)).then(()=>{
					this.setState({_history: data});
					ToastAndroid.show('Item deleted from history', ToastAndroid.SHORT);
						
				})
			}
			
			//alert(key)
		}); //set State of history
		
	} catch (error) {
	  alert('Error fetching data 2')
	}
	
 }
 
 refreshing(){
	 this.setState({refreshing: true})
		 setTimeout(() => {
			this.setState({refreshing: false}) 
		 }, 5000)
	 
 }
 viewInfo(obj){
	this.setState({licenceDisc: obj}) 
	this.setState({comfirmPage: true})
	
	
 }
 _backToHistory(){
	this.setState({comfirmPage: false, scan: false}) 
 }
 
 _keyExtractor = (item, index) => index;
 
show(){
	alert(1)
}
 _render(){
	
	 const HISTORY = this.state._history;
	 if(HISTORY != null && HISTORY.length > 0 && ! this.state.comfirmPage && ! this.state.scan){
		 var count = 1;
		  var key = 0;
		 return (
			
			 <FlatList
				  data={HISTORY}
				  onRefresh={() => {this.refreshing()}}
				  refreshing={this.state.refreshing}
				  renderItem={(e) => {
					  //alert(e)
					  var obj = e.item;
					  
					 return <SwipeRow
					onPress={ () => alert("PRESSED")}
					key={key++}
					leftOpenValue={50}
					rightOpenValue={-70}
					right={
					  <Button info onPress={() => this.viewInfo(obj)}>
						<FontAwesomeIcon name="info" size={50} color="white" />
					</Button>
					}
					body={
					<CardItem style={{flexDirection: 'row'}} >
						<Left>
							<Text>
								{obj['make']}
							</Text>
							
						</Left>
						 <Right>
							<Text style={{color: 'red'}}>{obj['licence_plate']}</Text>
							
						 </Right>
						 <Right>
							<Thumbnail small source={ ! ( obj['make'].toLowerCase() in Images) ? Images["_default"] : Images[obj['make'].toLowerCase()]}/>
						
						 </Right>
					</CardItem>
				
					}
					left={
					  <Button danger onPress={() => {
						  this.deleteHistoryItem(1)
					  }}>
						<Icon active name="trash" />
					  </Button>
					}
				  />
				  }}
				/>
				
			 )
		
	 }else if (this.state.comfirmPage) {
      //licenceDisc confirmation
	  
	  const make = this.state.licenceDisc["make"].toLowerCase()
      return (
        <View>
          <Card style={{flex: 4}}>
            <View
              style={{alignItems: "center", paddingTop: 20, paddingBottom: 30}}>
              {<Image style={styles.brandLogo} source={Images[make]} />}
              <Text style={styles.scanDescription}>
                {this.state.licenceDisc["make"]}{" "}
                {this.state.licenceDisc["model"]}
              </Text>
            </View>
			{ (typeof this.state.fleet != 'undefined') ?
				<Card>
					<CardItem style={{alignItems: "center"}}>
						<FontAwesomeIcon name="info" size={30} color="green" />
						<CardItem>
						<Left>
						  <Text style={{color: "green"}}>FLEET</Text>
						</Left>
						<Right>
							<Text style={{color: "green"}}>{this.state.fleet}</Text>
						</Right>
						</CardItem>
					</CardItem>
				</Card> : null
			}
			{ (typeof this.state.tag != 'undefined') ?
				<Card>
					<CardItem>
						<FontAwesomeIcon name="tag" size={30} color="red" />
						<Left>
						  <Text style={{color: "red"}}>TAG</Text>
						</Left>
						<Right>
							<Text style={{color: "red"}}>{this.state.tag}</Text>
						</Right>
					</CardItem>
				</Card> : null
			}
            {Object.keys(this.state.licenceDisc).map((key) => {
              return (
                <Card key={key}>
                  <CardItem>
                    <FontAwesomeIcon name="car" size={30} color="#386890" />
                    <Left>
                      <Text>{key.toUpperCase()} </Text>
                    </Left>
                    <Right>
                      <Text>{this.state.licenceDisc[key]}</Text>
                    </Right>
                  </CardItem>
                </Card>
              )
            })}
          </Card>
          <Button
            style={{bottom: 0, backgroundColor: "#ff9999"}}
            iconLeft
            block
            onPress={() => this._backToHistory()}>
            <Icon color={"white"} name="arrow-back" />
            <Text>History</Text>
          </Button>
        </View>
      )
    } else if(this.state.scan == 'send') {
      return (
	  <View>
			<View
              style={{alignItems: "center", paddingTop: 20, paddingBottom: 30}}>
              {<Image style={styles.brandLogo} source={this.state.make} />}
              <Text style={styles.scanDescription}>
                {this.state.licenceDisc["make"]}{" "}
                {this.state.licenceDisc["model"]}
              </Text>
			</View>
		<View style={{paddingTop: 5, paddingBottom: 30, margin: 15}}>
		
		<Text>
			Refference no.
		</Text>
		<Item regular style={{width: deviceWidth*0.9, height: deviceHeight*0.05, paddingTop: 5, margin: 10}}>
            <Input  
				placeholder='Refference number'
				 onChangeText={reff => this.setState({refference: reff})}
				/>
        </Item>
		
		{
			(typeof this.state.fleet != 'undefined') ?
			<View><Text>
			Fleet no.
			</Text>
			<Item regular success style={{width: deviceWidth*0.9, height: deviceHeight*0.05, paddingTop: 5, margin: 10, backgroundColor: '#F5F2F2'}}>
				<Input disabled value={this.state.fleet} placeholder={this.state.fleet} />
				
			</Item></View>
			: null
		}
		{
			(typeof this.state.tag != 'undefined') ?
			<View>
			<Text>
			Tag no.
			</Text>
			<Item regular success style={{width: deviceWidth*0.9, height: deviceHeight*0.05, paddingTop: 5, margin: 10,  backgroundColor: '#F5F2F2'}}>
				<Input disabled value={this.state.tag} placeholder={this.state.tag} />
				
			</Item></View>
			: null
		}
		<Text>
			VIN no.
			</Text>
			  <Item regular style={{width: deviceWidth*0.9, height: deviceHeight*0.05, paddingTop: 5, margin: 10, backgroundColor: '#F5F2F2'}}>
            <Input  disabled value={ this.state.licenceDisc['vin']} placeholder='Refference number' />
        </Item>
        <ListItem>
		<Text style={{fontSize: 10, color: 'red'}}>
			Please not this are the T&C
		</Text>
		</ListItem>
		 
		
		
			
		
            </View><Button
				style={{backgroundColor: "#0088cc", width:deviceWidth*1}}
				full
				info
				iconRight
				onPress={() => this.saveData()}>
				<Text>SEND DATA TO SERVER</Text>
				<Icon color={"white"} name="cloud" />
			</Button></View>
	  )
    }else{
		 
		return (
		<View style={{flex: 1, alignItems: 'center', marginTop: 20}}>
		<Thumbnail style={{padding: 20}}large source={Images['_default']}/>
				<Text style={{marginTop: 20}}>You currently  have no scan history</Text>

					
				
		</View>		
				
		) 
	 }
	 
	 
 }
	
 
  
  async componentDidMount() {

	try {
		AsyncStorage.getItem('_scans').then((info) => {
			var data = JSON.parse(info)
			this.setState({_history: data});
			//alert(data)
		}); //set State of history
		
	} catch (error) {
	  alert('Error fetching data 2')
	}
	
  }
  
  
  
  
}



const styles = StyleSheet.create({
  inScanner: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    height: deviceHeight * 0.86,
    width: deviceWidth * 0.99,
    borderRadius: deviceWidth / 2,
	flexDirection: 'row'
  },
  inScannerText: {
    fontSize: 44,
    //fontFamily: 'appFont',
    color: "white"
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 0,
    backgroundColor: "#386890"
  },
  topLogo: {
    height: deviceHeight * 0.2 * 0.8,
    width: deviceWidth / 3,
    resizeMode: "stretch",
    padding: 5
  },
  brandLogo: {
    height: deviceWidth *0.30,
    width: deviceWidth *0.50,
    resizeMode: "stretch"
  },
  scanDescription: {
    paddingTop: 15,
	//paddingBottom: 150,
    color: "#386890",
    //fontFamily: 'appFont',
    fontSize: 17
  }
})
