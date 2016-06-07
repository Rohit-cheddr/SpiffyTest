/* @flow weak */
/* eslint react/prop-types: 0 */

import React from 'react';
import Relay from 'react-relay';
import {Card, Avatar} from 'material-ui';

var canUseDOM = !!(
  (typeof window !== 'undefined' &&
  window.document && window.document.createElement)
);

class UserAuth extends React.Component
{
  constructor(props){
    super(props);
    this.state = {
      profile: undefined
    }
  }
  componentDidMount(){
    if(canUseDOM){
      this.props.lock.getProfile(localStorage.getItem('id_token'), (err, profile) => {
        this.setState({
          profile: profile
        });
      })
    }
  }
  showLock(lock){
    // We receive lock from the parent component in this case
    // If you instantiate it in this component, just do this.lock.show()
    lock.show((err, profile, token) => {
      if (err) {
        // Error callback
        console.log('There was an error');
        alert('There was an error logging in');
      } else {
        // Success calback
        // Save the JWT token.
        localStorage.setItem('id_token', token);

        // update profile
        this.setState({
          profile: profile
        });
      }
    });
  }

  logOut(){
    this.props.logOut();
    if(canUseDOM){
      this.props.lock.getProfile(localStorage.getItem('id_token'), (err, profile) => {
        this.setState({
          profile: profile
        });
      })
    }
  }

  render( )
  {
    return (
      <Card>
        {
          this.state.profile ? this._renderAvatar(this.state.profile) : this._renderSignIn()
        }
      </Card>
    );
  }

  _renderAvatar(profile){
    return (
      <div className="logout-box">
        <Avatar
          src={profile.picture}
          size={100}
        />
        <a onClick={this.logOut.bind(this)}>Sign Out</a>
      </div>
    )
  }

  _renderSignIn(){
    return (
      <div className="login-box">
        <a onClick={this.showLock.bind(this, this.props.lock)}>Sign In</a>
      </div>
    )
  }
}

export default Relay.createContainer( UserAuth, {
  fragments: {

  },
} )
