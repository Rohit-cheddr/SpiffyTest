/* @flow weak */

import DataLoader from 'dataloader'

import ObjectPersisterCassandra from './ObjectPersisterCassandra.js'
import ObjectPersisterMemory from './ObjectPersisterMemory.js'
import { Uuid } from './CassandraClient.js'


// Read environment
require( 'dotenv' ).load( )

// Set persistence
const ObjectPersister = (process.env.OBJECT_PERSISTENCE == 'memory') ? ObjectPersisterMemory : ObjectPersisterCassandra

// Static set of entity definitions
const entityDefinitions = { }

export default class ObjectManager
{

  constructor( )
  {
    this.loadersSingle = { }
    this.loadersMultiple = { }
    this.req = { }
  }

  static registerEntity( entityName: string, EntityType : any )
  {
    if( entityName in entityDefinitions )
      throw new Error( "Entity already registered: " + entityName )

    // In order to be able to access the name as a static property of the type
    EntityType.entityName = entityName

    entityDefinitions[ entityName ] = {
      EntityName: entityName,
      EntityType: EntityType,
      TriggersForAdd: [ ],
      TriggersForUpdate: [ ],
      TriggersForRemove: [ ]
    }
  }
  
  setReq (request)
  {
    this.req = request;
  }

  getReq( )
  {
    return this.req;
  }

  static RegisterTriggerForAdd( entityName: string, handler: any )
  {
    entityDefinitions[ entityName ].TriggersForAdd.push( handler )
  }

  static RegisterTriggerForUpdate( entityName: string, handler: any )
  {
    entityDefinitions[ entityName ].TriggersForUpdate.push( handler )
  }

  static RegisterTriggerForAddAndUpdate( entityName: string, handler: any )
  {
    ObjectManager.RegisterTriggerForAdd( entityName, handler )
    ObjectManager.RegisterTriggerForUpdate( entityName, handler )
  }

  static RegisterTriggerForRemove( entityName: string, handler: any )
  {
    entityDefinitions[ entityName ].TriggersForRemove.push( handler )
  }

  getLoadersSingle( entityName : string )
  {
    const foundLoaders = this.loadersSingle[ entityName ]
    if( foundLoaders != null )
      return foundLoaders
    else
      return this.loadersSingle[ entityName ] = { }
  }

  getLoadersMultiple( entityName : string )
  {
    const foundLoaders = this.loadersMultiple[ entityName ]
    if( foundLoaders != null )
      return foundLoaders
    else
      return this.loadersMultiple[ entityName ] = { }
  }

  clearLoadersMultiple( entityName : string )
  {
    this.loadersMultiple[ entityName ] = { }
  }

  getLoader( entityName: string, fieldName: string, multipleResults: boolean )
  {
    if( ! ( entityName in entityDefinitions ) )
      throw new Error( "Can not find entity type named " + entityName )

    const EntityType = entityDefinitions[ entityName ].EntityType

    let loadersList = multipleResults ? this.getLoadersMultiple( entityName ) : this.getLoadersSingle( entityName )
    let loader = loadersList[ fieldName ]
    if( loader == null )
    {
      if( multipleResults )
        loader = new DataLoader( values => ObjectPersister.ObjectPersister_getList( entityName, EntityType, fieldName, values ) )
      else
        loader = new DataLoader( values => ObjectPersister.ObjectPersister_get( entityName, EntityType, fieldName, values ) )

      loadersList[ fieldName ] = loader
    }

    return loader
  }

  getOneById( entityName: string, id: Uuid )
  {
    const loader = this.getLoader( entityName, 'id', false )

    if( id instanceof Uuid )
      id = id.toString( )

    return loader.load( id )
  }

  getListBy( entityName: string, fieldName: string, value: string )
  {
    const loader = this.getLoader( entityName, fieldName, true )

    return loader.load( value )
  }

  invalidateLoaderCache( entityName: string, fields: any )
  {
    // At this moment there is no obvious way of knowing what to clear from lists, so delete them all
    this.clearLoadersMultiple( entityName )

    const loadersSingle = this.getLoadersSingle( entityName )
    for( let loaderFieldName in loadersSingle )
    {
      if( loaderFieldName === 'id' )
        loadersSingle[ loaderFieldName ].clear( fields.id )
      else
        delete loadersSingle[ loaderFieldName ]
    }
  }

  executeTriggers( arrTriggers, fields )
  {
    const arrPromises = [ ]
    for( let trigger of arrTriggers )
    {
      arrPromises.push( trigger( this, fields ) )
    }

    return Promise.all( arrPromises )
  }

  add( entityName: string, fields: any )
  {
    const entityDefinition = entityDefinitions[ entityName ]

    if( entityDefinition == null ) console.log( 'Cound not find entity'+ entityName )

    // Generate primary key
    fields.id = Uuid.random( )

    return this.executeTriggers( entityDefinition.TriggersForAdd, fields )
    .then( ( ) => ObjectPersister.ObjectPersister_add( entityName, fields, entityDefinition.EntityType ) )
    .then( ( ) => {
      this.invalidateLoaderCache( entityName, fields )
      return fields.id
    } )
  }

  update( entityName: string, fields: any )
  {
    const entityDefinition = entityDefinitions[ entityName ]

    if( entityDefinition == null ) console.log( 'Cound not find entity'+ entityName )

    return this.executeTriggers( entityDefinition.TriggersForUpdate, fields )
    .then( ObjectPersister.ObjectPersister_update( entityName, fields ) )
    .then( ( ) => {
      this.invalidateLoaderCache( entityName, fields )
    } )

  }

  remove( entityName: string, fields: any )
  {
    const entityDefinition = entityDefinitions[ entityName ]

    return this.executeTriggers( entityDefinition.TriggersForRemove, fields )
    .then( ObjectPersister.ObjectPersister_remove( entityName, fields ) )
    .then( ( ) => {
      this.invalidateLoaderCache( entityName, fields )
    } )

  }
}
