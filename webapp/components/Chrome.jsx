/* @flow weak */
/* eslint react/prop-types: 0 */

import React from 'react';
import Relay from 'react-relay';

import AppBar from 'material-ui/AppBar';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import spacing from 'material-ui/styles/spacing';
import withWidth, {LARGE, MEDIUM}  from '../scripts/withWidth';

import AppNavDrawer from './AppNavDrawer.jsx';
import UserAuth from './UserAuth.jsx';
import ChromeHelmet from '../../configuration/webapp/components/ChromeHelmet.jsx';
import Footer from '../../configuration/webapp/components/Footer.jsx';
import { MainScreenTitle } from '../../configuration/webapp/components/ChromeSettings';
import muiTheme from '../../configuration/webapp/muiTheme.js';

var canUseDOM = !!(
  (typeof window !== 'undefined' &&
  window.document && window.document.createElement)
);

class Chrome extends React.Component
{
  constructor( props )
  {
    super( props );

    this.state = {
      navDrawerOpen: false,
    };

    this.muiTheme = getMuiTheme(
      muiTheme,
      { userAgent: navigator.userAgent }
    )
  }
  initLock () {
    var Auth0Lock = require('auth0-lock');
    this.lock = new Auth0Lock('LArWGs2yP8u1J9QJYGzpdsdnH3QO4WzX', 'cheddr.auth0.com');
  }
  componentWillMount() {
    if(canUseDOM){
      this.initLock();
    }
    else {
      this.lock = {}
      this.lock['show'] = (...args) => {
        //this.forceUpdate();
        this.initLock();
        this.lock.show(...args);
      }
      this.lock['getProfile'] = (...args) => {
        //this.forceUpdate();
        this.initLock();
        console.log(...args)
        this.lock.getProfile(...args);
      }
    }
  }

  getChildContext( )
  {
    return ( {
      muiTheme: this.muiTheme
    } );
  }

  _handle_onTouchTap_NavigationToggle = ( ) =>
  {
    this._handle_RequestChangeNavDrawer( ! this.state.navDrawerOpen );
  };

  _handle_RequestChangeNavDrawer = (open) => {
    this.setState( {
      navDrawerOpen: open,
    } );
  };

  _handle_onChangeList_AppNavDrawer = (event, value) => {
    this.context.router.push(value);
    this.setState({
      navDrawerOpen: false,
    });
  };


  getStyles()
  {
    const styles = {
      appBar: {
        position: 'fixed',
        zIndex: this.muiTheme.zIndex.appBar + 1,
        top: 0,
      },
      root: {
        paddingTop: spacing.desktopKeylineIncrement,
        minHeight: 400,
      },
      content: {
        margin: spacing.desktopGutter,
      },
      contentWhenMedium: {
        margin: `${spacing.desktopGutter * 2}px ${spacing.desktopGutter * 3}px`,
      },
    };

    if ( this.props.width === MEDIUM || this.props.width === LARGE )
      styles.content = Object.assign(styles.content, styles.contentWhenMedium);

    return styles;
  }

  logOut(){
    //this.props.lock.logout({returnTo: "http://localhost:4444"});
    localStorage.removeItem('id_token');
    this.context.router.push('/');
    console.log("logged out")
  }

  render( )
  {
    const styles = this.getStyles( )

    let {
      navDrawerOpen,
    } = this.state

    const {
      prepareStyles,
    } = this.muiTheme

    let docked = false
    let showMenuIconButton = true

    if( this.props.width === LARGE )
    {
      docked = true
      navDrawerOpen = true
      showMenuIconButton = false

      styles.navDrawer = {
        zIndex: styles.appBar.zIndex - 1,
      }
      styles.appBar.paddingLeft = 276
      styles.root.paddingLeft = 256
    }

    return (
      <div>
        <ChromeHelmet />
        <AppBar
          onLeftIconButtonTouchTap={ this._handle_onTouchTap_NavigationToggle }
          title={ MainScreenTitle }
          zDepth={0}
          style={styles.appBar}
          showMenuIconButton={showMenuIconButton}
        />
        <div style={prepareStyles(styles.root)}>
          <div style={prepareStyles(styles.content)}>
            { this.props.children }
          </div>
        </div>
        <AppNavDrawer
          style={styles.navDrawer}
          location={location}
          docked={docked}
          onRequestChangeNavDrawer={this._handle_RequestChangeNavDrawer}
          onChangeList={ this._handle_onChangeList_AppNavDrawer }
          open={navDrawerOpen}
          UserAuth={(<UserAuth lock={this.lock} logOut={this.logOut.bind(this)} />)}
        />
        <Footer
          width={ this.props.width }
        />
      </div>
    )
  }
}

//

Chrome.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

Chrome.childContextTypes = {
  muiTheme: React.PropTypes.object,
};

//

// It is important to retrieve User_Token2, since it is used in client.js
export default Relay.createContainer( withWidth( )( Chrome ), {
//export default Relay.createContainer( Chrome, {
  fragments: {

  },
});
