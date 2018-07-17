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
  AsyncStorage
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


import Images from "./Images"
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome"

const deviceHeight = Dimensions.get("window").height
const deviceWidth = Dimensions.get("window").width
const APPNAME = "BarCoder"
const BASEURL = "https://scannedit.co.za/"

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
	
	if(typeof this.state.refference != 'undefined'){
		data = Object.assign(data, {refference : this.state.refference})
	} //refference
	
	
	var formData = new FormData();
	
	Object.keys(data).map(key => {
		if(key in data){
			formData.append(key, data[key]);
			//alert(data2[key])
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
      component = "cancel"
      this.setState({
        scan: "send",
      })
	  
	  Alert.alert(
		  'Confirmation',
		  'Do you want to send data to the server',
		  [
			{text: 'Save on device', onPress: () => {this.saveScansLocally()}},
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
  render() {
	  alert(this.props.data)
	  this.setState({licenceDisc: this.props.data})
	 
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
    color: "#386890",
    //fontFamily: 'appFont',
    fontSize: 17
  }
})
