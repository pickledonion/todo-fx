//main.js todo-fx
/*global _, util, app, trace, main */

(function () {
  'use strict';
  var root = this;
  root.trace = function (str) { print( 'TRACE ' + str); };
  root.prn = root.prn || print;

  var todoFx = {};

  todoFx.modules =
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
     'bower_components/nashorn-repl/lib/main.js',
     { path:'lib/app.js'} ];


  todoFx.init = function () {
    trace("in todoFx.init");
    root.main = load('bower_components/nashorn-repl/lib/main.js');
    main.watch(todoFx.modules);
    util.startThread(root, 'watchThread', 'watch', 'watchState');

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
    trace("return from todoFx.init");
    return todoFx;
  };

  return todoFx;

}).call(this);
