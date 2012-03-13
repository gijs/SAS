var Db = require('../node_modules/mongodb').Db,
  Connection = require('../node_modules/mongodb').Connection,
  Server = require('../node_modules/mongodb').Server,
  mongo = require('../node_modules/mongodb');

var HOST = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var PORT = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;
var IS_NATIVE = process.env['MONGO_NODE_DRIVER_NATIVE'] != null ? process.env['MONGO_NODE_DRIVER_NATIVE'] : true;
var DB_NAME = "SRM";

console.log(">> Connecting to " + HOST + ":" + PORT);

//var db = new Db('24Weeks', new Server(HOST, PORT, {}), {native_parser:true});
var db = new Db(DB_NAME, new Server(HOST, PORT, {auto_reconnect: true, poolSize: 10}), {native_parser: IS_NATIVE});

db.open(function(err, db) {
	if(err){
		console.log("Error while oopening up a connection to the Database {0}",err)
	}
});


function openConnection(){
//console.log(db);
if(db===null){
	//db = new Db('24Weeks', new Server(host, port, {}), {native_parser:true});
	db = new Db(DB_NAME, new Server(HOST, PORT, {auto_reconnect: true, poolSize: 10}), {native_parser: IS_NATIVE});
	db.open(function(err, db){
		console.log("Error occurred while opening a connection to the DataBase please check whther every thing fine.");
	});
}
}

var pageNumber = 1;
var pageLength = 1;
var sortingCriteria = {'coloumn':'_id','order':'descending'};

module.exports = {

	insert : function(collectionName, documentToBeInserted, callBack){
		db.collection(collectionName, function(err, collection) {
			collection.insert(documentToBeInserted, {'upsert':true}, function(err, docs){
				callBack(err, docs);
			});
		});
	},

	remove : function(collectionName, criteria, conditions, callBack){
		db.collection(collectionName, function(err, collection) {
			collection.remove(criteria, conditions, function(err, docs){
				callBack(err, docs);
			});
		});
	},

	update : function(collectionName, criteria, documentToBeUpdated, conditions, callBack){
		db.collection(collectionName, function(err, collection) {
			delete documentToBeUpdated['_id'];
			collection.update(criteria, documentToBeUpdated ,conditions, function(err, result){
				callBack(err, result);
		});
		});
	},

	find : function(collectionName, criteria, callBack, pageNum, pageLen, sortCriteria){
		if(sortCriteria) sortingCriteria = sortCriteria;
		if(pageNum) pageNumber = pageNum;
		if(pageLen) pageLength =  pageLen;
		var skipCondition = (pageNumber-1)*pageLength;
		//var conditions = {"skip": skipCondition,"limit":pageLength,"sort":sortingCriteria};
		var conditions = {"skip": skipCondition,"limit":pageLength};
		db.collection(collectionName, function(err, collection) {			
			collection.find(criteria, conditions, function(err, cursor){				
				cursor.count(function(err, count){
					cursor.sort(sortingCriteria['coloumn'], sortingCriteria['order'], function(err, cursor){						
						cursor.toArray(function(err, documents){
							callBack(err, documents, count);					
						});
					});

				});
			});
		});
	},

	findAll : function(collectionName, criteria, callBack){
		db.collection(collectionName, function(err, collection) {			
			collection.find(criteria, function(err, cursor){				
				cursor.toArray(function(err, documents){
					callBack(err, documents);					
				});
			});
		});	
	},

	findAllReturnParticularColumns : function(collectionName, criteria, columnCriteria, callBack){
		db.collection(collectionName, function(err, collection) {			
			collection.find(criteria, columnCriteria, function(err, cursor){				
				cursor.toArray(function(err, documents){
					callBack(err, documents);					
				});
			});
		});	
	},

	getDBConnection : function(){
		openConnection();
		return db;
	}
};