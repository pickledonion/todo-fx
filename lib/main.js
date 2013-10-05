//main.js 10
/*global _, util, fxml, repl, app, watch*/
/*global fxmlText, doc*/
/*global replThread, replState*/
/*global watchThread, watchState*/
/*global trace, prn, jasmine */

(function () {
  'use strict';
  var root = this;
  root.trace = function (str) { print( 'TRACE ' + str); };
  root.prn = root.prn || print;

  var main = {};

  main.modules =
    [{ assign: false,
       path:'bower_components/underscore/underscore.js'},
     { assign: false,
       path:'bower_components/underscore-contrib/underscore.function.arity.js'},
     'bower_components/nashorn-repl/lib/fx.js',
     'bower_components/nashorn-repl/lib/fxml.js',
     'bower_components/nashorn-repl/lib/util.js',
     { name:'inspector', cb:'nodeLoadModule',
       path: 'bower_components/nashorn-repl/lib/node-util.js' },
     'bower_components/nashorn-repl/lib/pretty.js',
     'bower_components/nashorn-repl/lib/repl.js',
     'bower_components/nashorn-repl/lib/watch.js',
     { load: false, path:'lib/main.js'},
     { path:'lib/app.js'} ];

  main.defaultModule = { assign: true, load: true, cb:'loadModule' };

  main.getModule = function (obj) {
    if (_.isString(obj)) { obj = {path: obj};}
    obj = _.extend({}, main.defaultModule, obj);
    obj.name = obj.name || main.getName(obj.path);
    return obj;
  };

  main.getName = function (path) {
    return (_.last((path).split('/')).split('.'))[0];
  };

  root.loadModule = function (obj) {
    util.tryCatch( function () {
      if (!obj.load) {
        obj.load = true;
        print('NOLOAD ' + obj.load);
      }
      var res = load(obj.path);
      if (obj.assign) {root[obj.name] = res;}
      if (obj.test) {
        util.later(function () {
          root.runTest({path: 'test/' + obj.name + '.spec.js'});
        });
      }
      obj.test = true;
    }, function (e) {
      print('LOADMODULE E -> ' + e);
    });
  };

  main.getTests = function () {
    var dir = 'test/';
    return _.map (util.getFolder(dir), function (f) {
      var path = dir + f;
      return { path: path, cb: 'runTest' };
    });
  };

  root.runTest = function (obj) {
    print('\n--------------------\n');
    print('TEST: ');
    prn(obj);
    root.specrunner = load('bower_components/jasmine-nashorn/lib/specrunner.js');
    root.specrunner.init();
    load('bower_components/jasmine/lib/jasmine-core/jasmine.js');
    jasmine.getEnv().addReporter(new root.specrunner.reporter());
    util.tryCatch(function () { load(obj.path); });
    root.specrunner.run();
    print('\n--------------------\n');
  };

  main.getAssets = function () {
    var dir = 'assets/';
    var fxml = dir + 'todo.fxml';
    var css = dir + 'todo.css';
    return [{ path:fxml, fxml:fxml, css:css, cb:'loadAssets' },
            { path:css, fxml:fxml, css:css, cb:'loadAssets' }];
  };

  root.loadAssets = function (obj) {
    util.later( function () {
      fxml.setScene(obj.fxml, obj.css);
      app.init(root.appState);
    });
    // root.doc = new XmlDocument(fxmlText);
  };

  main.watch = function (modules) {
    load('bower_components/underscore/underscore.js');
    root.util = load('bower_components/nashorn-repl/lib/util.js');
    root.watch = load('bower_components/nashorn-repl/lib/watch.js');

    modules = _.map(modules, main.getModule);

    // _.each(modules, function (obj) {
    //   obj.time = watch.lastModified(obj.path);
    // });

    var list = [];
    root.watchState = {list:list};
    util.pushList(list, modules);

    util.pushList(list, main.getAssets());
    // util.pushList(list, main.getTests());
    watch.update(root.watchState);
    util.startThread(root, 'watchThread', 'watch', 'watchState');
  };

  main.init = function () {
    main.watch(main.modules);
    root.fxml.openWindow();
    $EXEC('bin/switch');
    print('repl..');
    root.replState = {later:true, filter:root.pretty.format};
    // root.replState = {later:true, filter:_.identity};
    util.later( function () {
      util.startThread(root, 'replThread', 'repl', 'replState');
    });
    root.appState = root.appState || {};
    util.later(function () {
      app.init(root.appState);
      // root.timer && root.timer.stop();
      // root.timer = new javafx.animation.AnimationTimer(function () {
      //   app.update(root.appState);
      // });
      // root.timer.start();
    });
    return main;
  };

  root.nodeLoadModule = function (obj) {
    var path = obj.path;
    var str = util.read(path);
    root[obj.name] = util.nodeLoad(str);
  };

  return main;

}).call(this);
