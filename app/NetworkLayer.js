import Relay, {
  DefaultNetworkLayer,
  RelayContext
} from 'react-relay';


export default class NetworkLayer
{

  static injectNetworkLayer( )
  {
    const graphQLServerURL = "http://localhost:4444/graphql";

    let headers = { }

    // TODO: equivalent of RelayContext.reset( )

    // Uncomment for connection to server in the cloud. Smarter way to do this will be needed.
    // graphQLServerURL = 'http://universal-relay-boilerplate.herokuapp.com/graphql';
    Relay.injectNetworkLayer( new DefaultNetworkLayer(
      graphQLServerURL,
      { headers: headers }
    ) );

  }
}
