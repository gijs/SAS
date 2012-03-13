/*
 * Author  : Mallikarjuna Avaluri
 * Email   : mallikarjuna.avuluri@gmail.com
 * License : All rights are reseved.
 * All the business logic related to login will be handled in this file.
 */
var dbutil = require('../db/auth_db_util');
var crypto = require('crypto');

var salt="!@#$%^&*";

function hash(msg, key) {
  return crypto.createHmac('sha256', key).update(msg).digest('hex');
}



 module.exports = {

 authenticateUser: function(req, res, user_id, password, callback){
 	dbutil.getUser(user_id, password, function(err, users, total){
 		var errObj = null;
 		var authenticated = false;
 		if(err){
 			errObj = {'type':'error', 'message':'Problem in signing in, please contact Administrator.'};
 			callback(errObj, authenticated);
 		}
 		if(users[0]){
 			var user = users[0];
 			if(user.user_id === user_id && hash(password, salt) === user.password){				
 				dbutil.getPermissions(user.role_id, function(err, permissions, total){
 					if(err){
 						console.log(err);
 						errObj = {'type':'error', 'message':'Problem in signing in, please contact Administrator.'};
 					}
 					if(permissions[0]){
 						user.permissions = permissions[0];
 						req.session.user= user;
 						console.log('user :'+user.user_id+', operation: login');
 						authenticated=true; 						 						
 						callback(errObj, authenticated); 						
 					}
 				});
 			}else{
 				errObj = {'type':'failure', 'message':'user id or the password is in-correct.'};
 				callback(errObj, authenticated);
 			}
 		}    	
    });
 },

 changePassword : function(req, res, callback){
 	var oldPassword = req.body.password_old;
	var newPassword = req.body.password_new;
	var user_id = req.session.user.user_id;
	var tenant_id = req.session.user.tenant_id;
 	dbutil.getUser(user_id, oldPassword, function(err, users, total){
 		var errObj = null;
 		var isSuccess = false; 		
 		if(err){
 			console.log("Error:",err);
 			errObj = {'type':'error', 'message':'Error occurred while changing the password, please try again later.'};
 			callback(errObj, isSuccess); 			
 		}
 		if(users[0]){
 			var user = users[0];
 			if(hash(oldPassword, salt) === user.password){
 				user['password'] = hash(newPassword, salt);
 				dbutil.updateUser(user, tenant_id,function(err, result){
 					if(err){
 						errObj = {'type':'error', 'message':'Error occurred while changing the password, please try again later.'};
 					}
 					if(result){
 						isSuccess = true;
 						callback(errObj, isSuccess);
 					}
 				}); 				
 			}else{
 				errObj = {'type':'error', 'message':'Old password is incorrect, please provide the correct one.'};
 				callback(errObj, isSuccess);
 			}
 		} 		
 	});
 }
 
 };