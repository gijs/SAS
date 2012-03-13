
/**
 * Module dependencies.
 */

var fs = require('fs')
  , express = require('./node_modules/express');

var RedisStore = require('./node_modules/connect-redis')(express);

exports.boot = function(app){
  bootApplication(app);
  bootControllers(app);
};

// App settings and middleware

function bootApplication(app) {
  app.use(express.logger(':method :url :status'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  //app.use(express.session({ secret: 'keyboard cat' }));
  app.use(express.session({ secret: "keyboard cat", store: new RedisStore }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));

  // Example 500 page
  app.use(function(err, req, res, next){
    res.render('500');
  });

  // Example 404 page via simple Connect middleware
  app.use(function(req, res){
    res.render('404');
  });

  // Setup ejs views as default, with .html as the extension
  app.set('views', __dirname + '/views');
  app.register('.html', require('ejs'));
  app.set('view engine', 'html');

  // Some dynamic view helpers
  app.dynamicHelpers({
    request: function(req){
      return req;
    },

    hasMessages: function(req){
      if (!req.session) return false;
      return Object.keys(req.session.flash || {}).length;
    },

    messages: function(req){
      return function(){
        var msgs = req.flash();
        return Object.keys(msgs).reduce(function(arr, type){
          return arr.concat(msgs[type]);
        }, []);
      }
    }
  });
}

// Bootstrap actions

function bootControllers(app) {
  fs.readdir(__dirname + '/actions', function(err, files){
    if (err) throw err;
    files.forEach(function(file){
      bootController(app, file);
    });
  });
}

// Example (simplistic) controller support

function bootController(app, file) {
  var name = file.replace('.js', '')
    , actions = require('./actions/' + name);

    var nameArr = name.split('_');
    name = nameArr[0];    

    var  prefix = '/' + name; 

  // Special case for "app"
  if (name == 'app') prefix = '/';

  Object.keys(actions).map(function(action){
    var fn = controllerAction(name, action, actions[action]);
    if(prefix==="/tenant" && action==="index"){
      app.get(prefix, fn);
      return;
    }
    switch(action) {
      case 'index':
        app.get(prefix, loadUser, fn);
        break;
      case 'list':
        app.get(prefix + '/list', fn);
        break;
      case 'show':
        app.get(prefix + '/:id', fn);
        break;
      case 'add':
        app.post(prefix + '/add', fn);
        break;
      case 'edit':
        app.get(prefix + '/:id/edit', fn);
        break;
      case 'update':
        app.post(prefix + '/:id/update', fn);
        break;
      case 'delete':
        app.get(prefix + '/:id/delete', fn);
        break;
      case 'invoke':
        app.post(prefix + '/invoke', fn);
        break;
    }
  });
}

function loadUser(req, res, next){
  if(req.session.user){
    next();
  }else{
    res.render('auth_view.html');
  }
}

// Proxy res.render() to add some magic

function controllerAction(name, action, fn) {
  return function(req, res, next){
    var render = res.render
      , path = __dirname + '/views/' + name + '_view.html';
    res.render = function(obj, options, fn){
      res.render = render;
      
      if (typeof obj === 'string') {
        return res.render(obj, options, fn);
      }

      if (action == 'index') {
          // Render template
          options = options || {};
          return res.render(path, options, fn);
      } else {
          return res.send(obj);
      }
    };
    fn.apply(this, arguments);
  };
}