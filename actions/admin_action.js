/*
 * Author  : Mallikarjuna Avaluri
 * Email   : mallikarjuna.avuluri@gmail.com
 * License : All rights are reseved.
 * This file will serve all the request coming from the admin tab, it will return only JSON object.
 * People who code in future shold also stick to the rule only return JSON objects and HTML templates seperately.
 */

 module.exports = {
 	/*
 	* This method will return only the template html which is a static file.
 	* As this HTML file is cached in the client side.
 	* rest of the other methods server only json req.
 	*/
 	index: function(req,res){ 		
 		res.render("admin_view.html");
 	},

 	/*
 	* This method will return list of items.
 	*/
 	list: function(req, res){
 		var jsonResponse = {};
 		res.send(jsonResponse);
 	},

 	/*
 	* This method will add the particular item to the DB,
 	* and return the response whether add operation is success or failure.
 	*/
 	add: function(req, res){
 		var jsonResponse = {};
 		res.send(jsonResponse); 		
 	},

 	/*
 	* This method will fetch a particular element from the DB,
 	* and return the response to view.
 	*/
 	show: function(req, res){
 		var jsonResponse = {};
 		res.send(jsonResponse); 		
 	},

 	/*
 	* This method will fetch a particular element from the DB,
 	* and return the response to view.
 	*/
 	edit: function(req, res){
 		var jsonResponse = {};
 		res.send(jsonResponse); 		
 	},

 	/*
 	* This method will update the particular item to the DB,
 	* and return the response whether update operation is success or failure.
 	*/
 	update: function(req, res){
 		var jsonResponse = {};
 		res.send(jsonResponse); 		
 	},

 	/*
 	* This method will delete the particular item to the DB,
 	* and return the response whether update operation is success or failure.
 	*/
 	delete: function(){
 		var jsonResponse = {};
 		res.send(jsonResponse);  		
 	},

 };
