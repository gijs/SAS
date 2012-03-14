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
 },

 createTenant: function(req, res, callback){
 	var tenant = req.body;
 	var errObj =null;
 	var isSuccess=false;
 	dbutil.addTenant(tenant, function(err, result){ 		
 		if(err){
 			console.log("Error occurred while updating the data:",err); 			
 			errObj ={'type':'error', 'message':'Unable to create the account, please contact Administrator.'};
 			callback(errObj, isSuccess);
 		}
 		if(result[0]){
 			var tenant = result[0];
 			dbutil.getRole('admin', function(err, roles, total){
 				if(err){
 					console.log("Error occurred while updating the data:",err);
 					errObj ={'type':'error', 'message':'Unable to create the account, please contact Administrator.'};
	 				callback(errObj, isSuccess);
 				}
 				if(roles[0]){
 					var role = roles[0];
 					var user={'user_id':tenant.email, 'password':hash(tenant.password, salt), 'tenant_id':tenant._id, 'role_id':role._id };
 					dbutil.addUser(user, function(err, result){
 						if(err){
 							console.log("Error occurred while updating the data:",err);
 							errObj ={'type':'error', 'message':'Unable to create the account, please contact Administrator.'};
	 						callback(errObj, isSuccess);
 						}
 						if(result){
 							isSuccess=true;
 							callback(errObj, isSuccess);
 						}
 					});
 				} 				
 			});
 		}
 	});
 },
addUser: function(req, res, callback){
	var role = req.body.role;
	var errObj=null;
	var isSuccess = false;
 	dbutil.getRole(role, function(err, roles, total){
 		if(err){
 			console.log("Error occurred while updating the data:",err);
 			errObj ={'type':'error', 'message':'Unable to create the user, please contact Administrator.'};
	 		callback(errObj, isSuccess);
 		}
 		if(roles[0]){
 			var role = roles[0];
 			var user = req.body;
 			user.user_id = req.body.email;
 			user.password = hash(req.body.password, salt);
 			user.tenant_id = req.session.user.tenant_id;
 			user.role_id = role._id;
 			dbutil.addUser(user, function(err, result){
 				if(err){
 					console.log("Error occurred while updating the data:",err);
 					errObj ={'type':'error', 'message':'Unable to create the user, please contact Administrator.'};
	 				callback(errObj, isSuccess);
 				}
 				if(result){
 					isSuccess=true;
 					callback(errObj, isSuccess);
 				}
 			});
 		}
 	});
}
 					
 
 };