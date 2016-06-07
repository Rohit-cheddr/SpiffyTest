/* @flow weak */

import React from 'react';
import { createRoutes, IndexRoute, Route } from 'react-router';
//import Relay from 'react-relay';

import Chrome from '../../webapp/components/Chrome.jsx';
import HomeScreen from './components/HomeScreen.jsx';
import MUI_Icons from '../../units/urb-example-mui/webapp/components/MUI_Icons.jsx';
import MUI_Icons_CountryFlags from '../../units/urb-example-mui/webapp/components/MUI_Icons_CountryFlags.jsx';
import MUI_Icons_CreditCards from '../../units/urb-example-mui/webapp/components/MUI_Icons_CreditCards.jsx';
import MUI_Home from '../../units/urb-example-mui/webapp/components/MUI_Home.jsx';


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
