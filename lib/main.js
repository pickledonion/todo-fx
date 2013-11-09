//main.js todo-fx 2
/*global _, util, app, trace, main */

(function () {
  'use strict';
  var root = this;
  root.trace = function (str) { print( 'TRACE ' + str); };
  root.prn = root.prn || print;

  var todoFx = {};

  todoFx.loadList = [
    { assign: false,
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
     'bower_components/nashorn-repl/lib/loading.js',
     { path:'lib/app.js'},
     { path:'assets/todo.fxml', fxml:'assets/todo.fxml',
       css:'assets/todo.css', cb:'loadAssets' },
     { path:'assets/todo.css', fxml:'assets/todo.fxml',
       css:'assets/todo.css', cb:'loadAssets' }
 ];

  root.loadAssets = function (obj) {
    util.later( function () {
      fxml.setScene(obj.fxml, obj.css);
      app.init(root.appState);
    });
    // root.doc = new XmlDocument(fxmlText);
  };

  todoFx.init = function () {
    trace("in todoFx.init");
    root.loading = load('bower_components/nashorn-repl/lib/loading.js');
    loading.watch(todoFx.loadList);
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
      // runTestFolder();
      root.timer && root.timer.stop();
      root.timer = new javafx.animation.AnimationTimer(function () {
        // app.update(root.appState);
        // watch.update(root.watchState);
        // repl.update(root.replState);
      });
      root.timer.start();
    });
    trace("return from todoFx.init");
    return todoFx;
  };

  return todoFx;

}).call(this);
