//main.js 9
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
     'bower_components/nashorn-repl/lib/node-util.js',
     'bower_components/nashorn-repl/lib/pretty.js',
     'bower_components/nashorn-repl/lib/repl.js',
     'bower_components/nashorn-repl/lib/watch.js',
     { load: false, path:'lib/main.js'},
     { path:'lib/app.js'} ];

  main.getModule = function (obj) {
    var pathAry = path.split('/');
    return { path: path, name: name, cb: 'loadModule', test:false };
  };

  root.loadModule = function (obj) {
    util.tryCatch( function () {
      root[obj.name] = load(obj.path);
      if (obj.test === true ) {
        util.later(function () {
          root.runTest({path: 'test/' + obj.name + '.spec.js'});
        });
      };
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
    var dir = 'assets/'
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

    print('in main.watch');
    prn(modules);

    _.each(modules, function (obj) {
      obj.time = watch.lastModified(obj.path);
    });
    var list = [];
    root.watchState = {list:list};
    util.pushList(list, noLoadModules);
    util.pushList(list, loadModules);
    util.pushList(list, main.getAssets());
    util.pushList(list, main.getTests());
    watch.update(root.watchState);
    util.startThread(root, 'watchThread', 'watch', 'watchState');
  };

  main.init = function () {
    root.watch = load('lib/watch.js');
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

  main.nodeLoad = function (str) {
    var wrap = '(function () { ' +
      'var module = {}, exports = {}, process = {};' +
      str +
      ' return (module.exports || exports); }());';
    return eval(wrap);
  };

  main.read = function (file) {
    var fr = new java.io.FileReader(file);
    var tr = new java.io.BufferedReader(fr);
    var line = null;
    var sb = new java.lang.StringBuilder();
    try {
      while ((line = tr.readLine()) !== null)  {
        sb.append(line);
        sb.append("\n");
      }
    } finally {
      fr.close();
    }
    return sb.toString();
  };

  return main;

}).call(this);
