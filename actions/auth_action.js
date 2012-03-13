/*
 * Author  : Mallikarjuna Avaluri
 * Email   : mallikarjuna.avuluri@gmail.com
 * License : All rights are reseved.
 * This file will serve all the request coming from the login tab, it will return only JSON object.
 * People who code in future shold also stick to the rule only return JSON objects and HTML templates seperately.
 */
var server = require('../server/auth_server_util');

function changePassword(req, res){
	if(req.session.user.permissions['changepassword']){
		server.changePassword(req, res,  function(errObj, success){
			if(errObj){
 					res.send(errObj);
 			}else if(success){
 					res.send({'success':true, 'message':'Successfully changed your password.'});
			}
		});
	}else{
			res.send({'type':'error', 'message': 'User is not permitted to Do this operation, please contact Administrator.'})
	}
}

function login(req, res){
	server.authenticateUser(req, res, req.body.user_id, req.body.password, function(errObj, authenticated){
		if(errObj){
 			res.send(errObj);
 		}else if(authenticated){	
			//res.redirect('/');
			//res.render('app_view.html');
 			res.send({'success':true, url:'/'});
		}
	});
}

function logout(req, res){	
	if(req.session.user){
		delete req.session['user'];
		//res.render('auth_view.html');
		//res.redirect('/auth');
		res.send({'success':true, url:'/'});
	}
 }

module.exports = {
	/*
	* This method will return only the template html which is a static file.
	* As this HTML file is cached in the client side.
	* rest of the other methods server only json req.
	*/
	index: function(req,res){		
 		res.render("auth_view.html");
 	},

 	invoke: function(req, res){
 		var action = req.body.action;
 		switch(action) {
      		case 'changePassword':
        		changePassword(req, res);
        		break;
        	case 'login':
        		login(req, res);
        		break
        	case 'logout':
        		logout(req, res);
        		break;
    	}
 	}
 };