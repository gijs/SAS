/*
 * Author  : Mallikarjuna Avaluri
 * Email   : mallikarjuna.avuluri@gmail.com
 * License : All rights are reseved.
 */

var mongo = require('../node_modules/mongodb');
var db = require('./generic_dbutil');

var tableName = "Users";
var BSON = mongo.BSONNative || mongo.BSONPure;

 module.exports = {

 	getUser: function(user_id, password, callback){
 		var criteria = {};
 		criteria['user_id'] = user_id;
 		db.find(tableName, criteria, callback);
 	},

 	updateUser: function(user, tenant_id, callback){
 		var criteria = {};
 		criteria['_id'] = new BSON.ObjectID.createFromHexString(new String(user._id));
 		criteria['tenant_id'] = new BSON.ObjectID.createFromHexString(new String(tenant_id));
 		db.update(tableName, criteria, user, {safe:true}, callback);
 	},

 	getPermissions: function(role_id, callback){
 		var criteria = {};
 		console.log('role_id', role_id);
 		criteria['role_id']=new BSON.ObjectID.createFromHexString(new String(role_id));
 		db.find('Permissions', criteria, callback);
 	}

 
 }