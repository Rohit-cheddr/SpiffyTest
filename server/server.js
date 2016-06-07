/* @flow weak */

import express from 'express';
var jwt = require('express-jwt');
import cookieParser from 'cookie-parser';
import compression from 'compression';
import log from './log.js';
import path from 'path';
import process from 'process';

import graphql from '../graphql/server'; // GraphQL server
import serverExtensions from '../configuration/server/serverExtensions'
import webapp from '../webapp/server'; // Isomorphic React server


// Read environment
require( 'dotenv' ).load( );

// Validate Persistence
const objectPersistence = process.env.OBJECT_PERSISTENCE;
if( objectPersistence != 'memory' && objectPersistence != 'cassandra' )
{
  log.log( 'info', 'Invalid process.env.OBJECT_PERSISTENCE: ' + objectPersistence );
  process.exit( );
}

// Log starting application - first gather connection information
let persistenceInformation = { };
if( objectPersistence == 'cassandra' )
{
  persistenceInformation.CASSANDRA_KEYSPACE = process.env.CASSANDRA_KEYSPACE;
  persistenceInformation.CASSANDRA_CONNECTION_POINTS = process.env.CASSANDRA_CONNECTION_POINTS;
}

// Log starting application
log.log( 'info', 'Starting application', {
  npm_package_name: process.env.npm_package_name,
  npm_package_version: process.env.npm_package_version,
  NODE_ENV: process.env.NODE_ENV,
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  PUBLIC_URL: process.env.PUBLIC_URL,
  process_title: process.title,
  process_pid: process.pid,
  objectPersistence: objectPersistence,
  ...persistenceInformation
} );

// Main router
let router = express( );

router.set( 'trust proxy', 'loopback' );
router.set( 'x-powered-by', false );

router.use( compression( ) );

var authenticate = jwt({
  secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
  audience: process.env.AUTH0_CLIENT_ID
});

// GraphQL server
router.use( '/graphql', graphql );

// Add extensions - custom configurations
serverExtensions( router )

// Application with routes
router.use( '/*', webapp );

let server = router.listen( process.env.PORT, process.env.HOST );

export default server;
