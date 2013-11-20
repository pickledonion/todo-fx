#! /usr/local/bin/rlwrap /usr/bin/jjs -fx -scripting
//fxml3d example 4
/*global _, util, app, trace, main, loading, $SCRIPTS, fxml */

(function () {
  'use strict';
  var root = this;
  root.app = {};

  app.init = function (state) {
    print('app.init');
  };

  root.appState = root.appState || {};

  root.loading = load('bower_components/nashorn-repl/lib/loading.js');
  var appFxml = 'assets/Shape3D.fxml';
  var appCss = '';
  var appList = [
    {path:$SCRIPTS[0], load:false},
    { path:appFxml, fxml:appFxml, css:appCss, cb:'loadAssets', load:true },
    { path:appCss, fxml:appFxml, css:appCss, cb:'loadAssets', load:false },
  ];
  root.loadList = loading.getDefaultLoadList().concat(appList);
  root.loadAssets = function (obj) {
    fxml.setScene(obj.fxml, obj.css);
    app.init(root.appState);
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

  // $EXEC('bin/switch');
  app.init(root.appState);

}).call(this);
