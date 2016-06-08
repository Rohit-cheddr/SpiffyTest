/* @flow weak */

import React from 'react';
import { createRoutes, IndexRoute, Route } from 'react-router';
//import Relay from 'react-relay';

<<<<<<< HEAD
import Chrome from '../../webapp/components/Chrome.jsx';
import HomeScreen from './components/HomeScreen.jsx';
import MUI_Icons from '../../units/urb-example-mui/webapp/components/MUI_Icons.jsx';
import MUI_Icons_CountryFlags from '../../units/urb-example-mui/webapp/components/MUI_Icons_CountryFlags.jsx';
import MUI_Icons_CreditCards from '../../units/urb-example-mui/webapp/components/MUI_Icons_CreditCards.jsx';
import MUI_Home from '../../units/urb-example-mui/webapp/components/MUI_Home.jsx';
=======
import Chrome from '../../webapp/components/Chrome';
import Compendium from '../../units/urb-example-compendium/webapp/components/Compendium';
import Ensayo_List from '../../units/urb-example-ensayo/webapp/components/Ensayo_List';
import Ensayo_Screen from '../../units/urb-example-ensayo/webapp/components/Ensayo_Screen';
import Ensayo_PublicItem from '../../units/urb-example-ensayo/webapp/components/Ensayo_PublicItem';
import Ensayo_PublicListing from '../../units/urb-example-ensayo/webapp/components/Ensayo_PublicListing';
import ForceLogin from '../../units/urb-example-force-login/webapp/components/ForceLogin';
import HomeScreen from './components/HomeScreen';
import MUI_Icons from '../../units/urb-example-mui/webapp/components/MUI_Icons';
import MUI_Icons_CountryFlags from '../../units/urb-example-mui/webapp/components/MUI_Icons_CountryFlags';
import MUI_Icons_CreditCards from '../../units/urb-example-mui/webapp/components/MUI_Icons_CreditCards';
import MUI_Home from '../../units/urb-example-mui/webapp/components/MUI_Home';
import ToDo_List from '../../units/urb-example-todo/webapp/components/ToDo_List';
import ToDo_Screen from '../../units/urb-example-todo/webapp/components/ToDo_Screen';
import Translaticiarum_List from '../../units/urb-example-translaticiarum/webapp/components/Translaticiarum_List';
import Translaticiarum_Grid from '../../units/urb-example-translaticiarum/webapp/components/Translaticiarum_Grid';
import Translaticiarum_Screen from '../../units/urb-example-translaticiarum/webapp/components/Translaticiarum_Screen';
import User_Properties from '../../units/urb-account-management/webapp/components/User_Properties';
import User_UpdatePassword from '../../units/urb-account-management/webapp/components/User_UpdatePassword';
>>>>>>> 707ab29e27ce46019caeaf302d95f06e42f95aea


export const queries = {
};

export default createRoutes(
  <Route path="/" component={Chrome} queries={queries}>
    <IndexRoute component={HomeScreen} queries={queries} />
		<Route path="mui">
			<IndexRoute component={MUI_Home} queries={queries} />
			<Route path="icons" component={MUI_Icons} queries={queries} />
			<Route path="icons_country_flags" component={MUI_Icons_CountryFlags} queries={queries} />
			<Route path="icons_credit_cards" component={MUI_Icons_CreditCards} queries={queries} />
		</Route>
  </Route>
);
