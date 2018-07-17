import React from 'react'
import { Router, Scene } from 'react-native-router-flux'
import Home from '../Home'
import Scan from '../Scan'
import Login from '../Login'
import ViewHistory from '../ViewHistory'
import History from '../History'
import Welcome from '../welcomeLoader/Welcome'
import Main from '../../../Main'


const Routes = () => (
   <Router>
      <Scene clone key = "root">
         <Scene key = "welcome" component = {Welcome} hideNavBar={true} initial = {true} />
		 <Scene key = "home" component = {Home}  hideNavBar={true} />
		 <Scene key = "login" component = {Login} hideNavBar={true} />
         <Scene key = "scan" component = {Scan}  hideNavBar={true} />
		 <Scene key = "viewHistory" component = {ViewHistory} hideNavBar={true} />
      </Scene>
   </Router>
)

export default Routes