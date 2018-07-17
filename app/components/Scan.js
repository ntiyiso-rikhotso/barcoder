import React, {Component} from "react"
import {Font} from "expo"
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
  Picker
} from "react-native"
import {Constants, BarCodeScanner, Permissions} from "expo"
import {Icon} from "react-native-elements"
import {
  CardItem,
  Card,
  Left,
  Right,
  Container,
  Header,
  Content,
  Toast,
  Button,
  Text,
  Title,
  Body,
  Thumbnail,
  Footer,
  FooterTab,
  H3,
  ActionSheet,
  Item,
  Input,
  ListItem
} from "native-base"

import ActionButton from 'react-native-action-button';
import Images from "./Images"
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome"

const deviceHeight = Dimensions.get("window").height
const deviceWidth = Dimensions.get("window").width
const APPNAME = "BarCoder"
const BASEURL = "https://scannedit.co.za/";
const baseUrl = "https://scannedit.co.za/";

var DESTRUCTIVE_INDEX = 3
var CANCEL_INDEX = 3

NetInfo.isConnected.fetch().then((isConnected) => {
  if (!isConnected) {
    alert("Internet is not connected")
  }
})

export default class App extends Component {
  state = {
	scan: 'licenceDisc',
	installation: 'installation',
    hasCameraPermission: null,
    showToast: false,
    secondScan: false,
    comfirmPage: false,
    scanStatus: false,
    licenceDiscScan: true,
    allScansCompleted: true,
    internetConnection: NetInfo.isConnected.fetch(),
    barCodeTypes: [BarCodeScanner.Constants.BarCodeType.pdf417, BarCodeScanner.Constants.BarCodeType.code128],
	options:[
  {text: "Scan fleet device", icon: "arrow-forward", iconColor: "#2c8ef4"},
  {text: "Scan tag device", icon: "arrow-forward", iconColor: "#2c8ef4"},
  {text: "Scan both devices", icon: "arrow-forward", iconColor: "#2c8ef4"},
  {text: "Cancel", icon: "arrow-back", iconColor: "red"}
]
    //barCodeTypes: [BarCodeScanner.Constants.BarCodeType.ean13, BarCodeScanner.Constants.BarCodeType.ean8, BarCodeScanner.Constants.BarCodeType.code128, BarCodeScanner.Constants.BarCodeType.code138, BarCodeScanner.Constants.BarCodeType.code93, BarCodeScanner.Constants.BarCodeType.codebar],
  }
  
  

  componentDidMount() {
    this._requestCameraPermission()
  }

  _requestCameraPermission = async () => {
    const {status} = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({
      hasCameraPermission: status === "granted"
    })
  }
  
  show(){
	 return ('HI') 
  }

  _handleBarCodeRead = (data) => {
    if (
      this.state.scan == "licenceDisc" ||
      this.state.scan == "fleet" ||
      this.state.scan == "tag" ||
      this.state.scan == "both"
    ) {
      if (this.state.scan == "licenceDisc") { //licence disc
        this.setState({
          licenceDisc: data.data,
          comfirmPage: true,
        })

        var Z = data.data

        var dataArray = Z.substring(1, Z.length - 1).split("%")
        var arrayKeys = [
          "mvl_code",
          "auth_code",
          "license_number",
          "issue_number",
          "disc_number",
          "licence_plate",
          "vehicle_registration",
          "vehicle_type",
          "make",
          "model",
          "colour",
          "vin",
          "engine_number",
          "disc_expiry"
        ]

        var dataObject = {}
        dataArray.map((val, index) => {
          dataObject[arrayKeys[index]] = val
        })
        const key = dataObject.make.toLowerCase()
        const vehicleMake = !(key in Images) ? Images["_default"] : Images[key]
        this.setState({
          licenceDisc: dataObject,
		  scan : null,
          make: vehicleMake
        })
      }else if(this.state.scan == "fleet"){ //fleet
		 this.setState({
			  fleet: data.data,
			  comfirmPage: true,
			  scan: null,
			  options:this.options()
		 })
	  }else if(this.state.scan == "tag"){ //tag
		 this.setState({
			  tag: data.data,
			  comfirmPage: true,
			  options: this.options()
		 })
		 if(typeof this.state.fleet != 'undefined'){
			 this.setState({
				scan : null,
				comfirmPage: true,
				 options:this.options()
				
			 })
		 }
	  } 
    }
  }
  _backToLicenceDiskScanner() {
    this.setState({
      comfirmPage: false,
      scan:'licenceDisc'
    })
  }
  _backToLicenceDiskScannerSecondaPhase() {
    this.setState({
      comfirmPage: true
    })
  }

  _continueToTheNextScan() {
    this.setState({
      allScansCompleted: true,
      comfirmPage: "confirmed",
      secondScan: true
    })
  }

  async saveData(data = {} ) {
   // var data = {};
	
	data =  Object.assign(data, this.state.licenceDisc)
	
	
	if(typeof this.state.tag != 'undefined'){
		data = Object.assign(data, {tag : this.state.tag})
	} //tag number
	
	if(typeof this.state.fleet != 'undefined'){
		data = Object.assign(data, {fleet : this.state.fleet})
	}//fleet number
	
	if(typeof this.state.installation_type != 'undefined'){
		data = Object.assign(data, {installation_type : this.state.installation_type})
	}//installation_type
	
	if(typeof this.state.refference != 'undefined'){
		data = Object.assign(data, {refference : this.state.refference})
	} //refference
	var userdata = await AsyncStorage.getItem('userdata');
	
	userdata = JSON.parse(userdata);
	
	if(typeof userdata != 'undefined'){
		data = Object.assign(data, {account_id : userdata.accountId})
	} //account_id
	
	
	var formData = new FormData();
	
	Object.keys(data).map(key => {
		if(key in data){
			formData.append(key, data[key]);
			//alert(key + ' ' + data[key])
		}
	})
	
	var dataObject = JSON.stringify(new Array(data));
	
	var existing = await AsyncStorage.getItem('_scans');
	
	
	if(existing != null){
		existing = JSON.parse(existing);
		existing.push(data);
		existing = JSON.stringify(existing.reverse());
		await AsyncStorage.setItem('_scans', existing).then(() => {
			try {
				AsyncStorage.getItem('_scans').then((info) => {
					
					
					this.props.scan()  
					
				}); //set State of history
				
			} catch (error) {
			  //alert('Error fetching data')
			}
		})
	}else{
		
		try {
			await AsyncStorage.setItem('_scans', dataObject).then(() => {
				try {
					AsyncStorage.getItem('_scans').then((info) => {}); //set State of history
						
					} catch (error) {
					  //alert('Error fetching data')
					}
			});
		} catch (error) {
		 // alert('Error')
		}
	
	}
	
	var POSTDATA = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data"
      },
      body: formData
    }
    if (this.state.internetConnection) {
      fetch(BASEURL + "app/saveScans/", POSTDATA)
        .then((response) => {
			//alert(JSON.stringify(response))
			response.json()
		})
        .then((responseJson) => {
          //alert(JSON.stringify(responseJson))
        })
        .catch((error) => {
          console.error(error)
        })
    } else {
      //save to history
    }
	ToastAndroid.show('Data sent', ToastAndroid.SHORT);
	this.app()
  }
  options(){
	  var ops = [
			  {text: "Fleet", icon: "arrow-forward", iconColor: "#2c8ef4"},
			  {text: "Tag", icon: "arrow-forward", iconColor: "#2c8ef4"},
			  {text: "Save", icon: "ios-add", iconColor: "red"}
			];
	  
	  
	  return ops;
	  
  }
  actionsheet() {
    return ActionSheet.show(
      {
        options: this.options(),
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
        title: "Licence disc scan completed. What do you want to do next?",
        message: "Please select the action you want to perform"
      },
      (buttonIndex) => {
        this.perfomeAction(buttonIndex)
      }
    )
  }

  perfomeAction(index) {
	 
    var component = ""
    if (index == 0 || index == 1) {
		const COMP = index == 0 ? "fleet" : index == 1 ? "tag" : "";
		
      this.setState({
        scan: COMP
      })
    }
    
    
    if (index == 2) {
      this.setState({
        scan: "send",
      })
	  
	  Alert.alert(
		  'Confirmation',
		  'Do you want to send data to the server',
		  [
			{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
			{text: 'Send to Server', onPress: () => {
				this.setState({scan: 'send', comfirmPage: false})
			}},
		  ],
		  { cancelable: false }
		)
    }

    
  }
  async saveScansLocally(){
	var data = {};
	
	data =  Object.assign(data, this.state.licenceDisc)
	
	
	if(typeof this.state.tag != 'undefined'){
		data = Object.assign(data, {tag : this.state.tag})
	}
	
	if(typeof this.state.fleet != 'undefined'){
		data = Object.assign(data, {fleet : this.state.fleet})
	}
	
	if(typeof this.state.refference != 'undefined'){
		data = Object.assign(data, {refference : this.state.refference})
	}
	
	var dataObject = JSON.stringify(new Array(data));
	
	var existing = await AsyncStorage.getItem('_scans');
	if(existing != null){
		existing = JSON.parse(existing);
		existing.push(data);
		existing = JSON.stringify(existing);
		await AsyncStorage.setItem('_scans', existing).then(() => {
			try {
				AsyncStorage.getItem('_scans').then((info) => {
					
					
					this.props.scan()  
					
				}); //set State of history
				
			} catch (error) {
			  //alert('Error fetching data')
			}
		})
	}else{
		
		try {
			await AsyncStorage.setItem('_scans', dataObject).then(() => {
				try {
					AsyncStorage.getItem('_scans').then((info) => {}); //set State of history
						
					} catch (error) {
					  //alert('Error fetching data')
					}
			});
		} catch (error) {
		 // alert('Error')
		}
	
	}

  
	
	  
	 
  }

  enterFleetManually(){
    this.setState({scan: 'enterFleetManually', comfirmPage: false})
  }
  enterTagManually(){
    this.setState({scan: 'enterTagManually', comfirmPage: false})
  }
  render() {
	 
    if (this.state.scan == 'licenceDisc' || this.state.scan == 'tag' || this.state.scan == 'fleet') {
      if (this.state.scan == "licenceDisc") {
        var TEXT = "licence disc"
      } else if (this.state.scan == "tag") {
        var TEXT = "Tag"
      } else if (this.state.scan == "fleet") {
        var TEXT = "Fleet"
      }
      return (
        <View style={styles.container}> 
          <BarCodeScanner
            barCodeTypes={this.state.barCodeTypes}
            style={styles.inScanner}
            torchMode="off"
            onBarCodeRead={this._handleBarCodeRead}>
            <View style={{flexDirection: 'row'}}>
              <FontAwesomeIcon name={this.state.scan == "licenceDisc" ? "circle-o" : 'barcode'} size={this.state.scan == "licenceDisc" ? 400 : 100} color="#386870" />
             </View>
          </BarCodeScanner>
          <ActionButton buttonColor="#386870">
          <ActionButton.Item buttonColor='#9b59b6' title="Enter tag manually" onPress={() => this.enterTagManually()}>
            <FontAwesomeIcon name="tag" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#3498db' title="Enter fleet manually" onPress={() => {this.enterFleetManually()}}>
            <FontAwesomeIcon name="arrow-circle-up" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#1abc9c' title="Scan licence disc" onPress={() => {
            this.setState({scan: 'licenceDisc'})
          }}>
            <FontAwesomeIcon name="toggle-on" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#1abc77' title="Scan tag device" onPress={() => {
            this.setState({scan: 'tag'})
          }}>
            <FontAwesomeIcon name="barcode" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#9b59b6' title="Scan fleet device" onPress={() => {
             this.setState({scan: 'fleet'})
          }}>
            <FontAwesomeIcon name="barcode" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
        </View>
      )
    } else if (this.state.comfirmPage) {
      //licenceDisc confirmation
	  if(typeof this.state.licenceDisc['make'] == 'undefined' && typeof this.state.licenceDisc['license_number'] == 'undefined'){
		return this.setState({comfirmPage: false})  
	  }
      return (
        <View>
          <Card style={{flex: 4}}>
            <View
              style={{alignItems: "center", paddingTop: 20, paddingBottom: 30}}>
              {<Image style={styles.brandLogo} source={this.state.make} />}
              <Text style={styles.scanDescription}>
                {this.state.licenceDisc["make"]}{" "}
                {this.state.licenceDisc["model"]}
              </Text>
            </View>
				
			<Text style={{fontSize: deviceHeight*0.015, alignSelf: 'center', color: "red", paddingBottom: deviceHeight*0.02}}>Please scroll down for more options</Text>
					
			
			<Card key="-5">
                  <CardItem>
				  <FontAwesomeIcon name="cog" size={30} color="blue" />
				  <Left>
                      <Text style={{color: 'blue'}}>Please select scan status : </Text>
                    </Left>
				  <Right>
					<Picker
					  selectedValue={this.state.installation_type}
					  style={{ height: 50, width: deviceWidth*0.4 }}
					  onValueChange={(itemValue, itemIndex) => this.setState({installation_type: itemValue})}>
					  <Picker.Item label="New Installation" value="installation" />
					  <Picker.Item label="Deinstallation" value="deinstallation" />
					</Picker>
                   </Right>
                    
                </CardItem>
            </Card>
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
                    <FontAwesomeIcon name="car" size={30} color="#386870" />
                    <Left>
                      <Text style={styles.keyText}>{key.toUpperCase()} </Text>
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
            onPress={() => this._backToLicenceDiskScanner()}>
            <Icon color={"white"} name="arrow-back" />
            <Text>Back to licence disc scanner</Text>
          </Button>
		  <Button
            style={{bottom: 0, backgroundColor: "#0088cc"}}
            full
            info
            iconRight
            onPress={() => this.actionsheet()}>
            <Text>Proceed to the next scan {"         "}</Text>
            <Icon color={"white"} name="arrow-forward" />
            <Icon color={"white"} name="arrow-forward" />
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
    }else if(this.state.scan == 'enterFleetManually') {
      return (
	  <View>
			<View
              style={{alignItems: "center", paddingTop: 20, paddingBottom: 30}}>
              {<Image style={styles.brandLogo} source={this.state.make} />}
              <Text style={styles.scanDescription}>Fleet manual entry
              </Text>
			</View>
		<View style={{paddingTop: 5, paddingBottom: 30, margin: 15}}>
		
		<Text>
			Fleet No.
		</Text>
		<Item regular style={{width: deviceWidth*0.9, height: deviceHeight*0.05, paddingTop: 5, margin: 10}}>
            <Input  
				placeholder='Fleet device number'
         onChangeText={fleetNo => this.setState({fleet: fleetNo})}
         value={(typeof this.state.fleet != 'undefined' ? this.state.fleet : '') }
				/>
        </Item>
		
		
	
	
			 
        <ListItem>
		<Text style={{fontSize: 10, color: 'red'}}>
			Please enter the fleet number
		</Text>
		</ListItem>
    <Button
				style={{backgroundColor: "#0088cc", width:deviceWidth*1, alignSelf: 'center'}}
				full
				info
				iconRight
				onPress={() => {
          if(this.state.licenceDisc != null){
            this.setState({comfirmPage: true})
          }else{
            this.setState({scan: 'licenceDisc'})
          }
        }}>
				<Text>Scan lincence disc</Text>
				<Icon color={"white"} name="touch-app" />
			</Button>

    
		 </View>
     
      </View>
      
	  )
    }else if(this.state.scan == 'enterTagManually') {
      return (
	  <View>
			<View
              style={{alignItems: "center", paddingTop: 20, paddingBottom: 30}}>
              {<Image style={styles.brandLogo} source={this.state.make} />}
              <Text style={styles.scanDescription}>Tag manual entry
              </Text>
			</View>
		<View style={{paddingTop: 5, paddingBottom: 30, margin: 15}}>
		
		<Text>
			Tag No.
		</Text>
		<Item regular style={{width: deviceWidth*0.9, height: deviceHeight*0.05, paddingTop: 5, margin: 10}}>
            <Input  
				placeholder='Tag device number'
         onChangeText={tagNo => this.setState({tag: tagNo})}
         value={(typeof this.state.tag != 'undefined' ? this.state.tag : '') }
				/>
        </Item>
		
		
	
	
			 
        <ListItem>
		<Text style={{fontSize: 10, color: 'red'}}>
			Please enter the fleet number
		</Text>
		</ListItem>
    
		 </View>
     <Button
				style={{backgroundColor: "#0088cc", width:deviceWidth*1, alignSelf: 'center' }}
				full
				info
				iconRight
				onPress={() => {
          if(this.state.licenceDisc != null){
            this.setState({comfirmPage: true})
          }else{
            this.setState({scan: 'licenceDisc'})
          }
          
        }}>
				<Text>Scan lincence disc</Text>
				<Icon color={"white"} name="touch-app" />
			</Button>
      </View>
	  )
    }
  }
  
  app(){
	this.props.scan()  
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
    color: "#386870",
    fontFamily: 'gomarice',
    fontSize: deviceWidth*0.07
  },
  keyText:{
	 //fontFamily: 'gomarice',
     color: "#386870",	 
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
})
