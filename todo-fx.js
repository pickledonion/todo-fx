#! /usr/local/bin/rlwrap /usr/bin/jjs -fx -scripting
//simple test 12
/*global _, util, app, trace, main, loading, $SCRIPTS, fxml */

print('args  ' + $ARG);

(function () {
  'use strict';
  var root = this;
  root.trace = function (str) { print( 'TRACE ' + str); };
  root.prn = root.prn || print;
  root.loading = load('bower_components/nashorn-repl/lib/loading.js');
  var todofxml = 'assets/todo.fxml';
  var todocss = 'assets/todo.css';
  var appList = [
    {path:$SCRIPTS[0], load:false},
    { path:todofxml, fxml:todofxml, css:todocss, cb:'loadAssets', load:true },
    { path:todocss, fxml:todofxml, css:todocss, cb:'loadAssets', load:false },
  ];

  root.loadList = loading.getDefaultLoadList().concat(appList);

  root.loadAssets = function (obj) {
    fxml.setScene(obj.fxml, obj.css);
    // app.init(root.appState);
    // root.doc = new XmlDocument(fxmlText);
  };

  loading.init(root.loadList);

  root.replState = {later:true, filter:root.pretty.format};

  root.timer && root.timer.stop();
  root.timer = new javafx.animation.AnimationTimer(function () {
    // app.update(root.appState);
    watch.update(root.watchState);
    repl.update(root.replState);
  });
  root.timer.start();

  root.appState = root.appState || {};

  // $EXEC('bin/switch');
  // app.init(root.appState);

}).call(this);
