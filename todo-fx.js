#! /usr/local/bin/rlwrap /usr/bin/jjs -fx -scripting
//simple test 5
/*global _, util, app, trace, main, loading, $SCRIPTS, fxml */

print('args  ' + $ARG);

(function () {
  'use strict';
  var root = this;
  root.trace = function (str) { print( 'TRACE ' + str); };
  root.prn = root.prn || print;
  root.loading = load('bower_components/nashorn-repl/lib/loading.js');
  var appList = [
    {path:$SCRIPTS[0], load:false}
    ,
    // { path:'assets/todo.fxml', fxml:'assets/todo.fxml',
    //   css:'assets/todo.css', cb:'loadAssets' },
    // { path:'assets/todo.css', fxml:'assets/todo.fxml',
    //   css:'assets/todo.css', cb:'loadAssets' }
  ];

  root.loadList = loading.getDefaultLoadList().concat(appList);

  root.loadAssets = function (obj) {
    print('in loadAssets');
    prn(obj);
    util.later( function () {
      fxml.setScene(obj.fxml, obj.css);
      // app.init(root.appState);
    });
    // root.doc = new XmlDocument(fxmlText);
  };

  loading.watch(root.loadList);
  // util.later(root.runModuleTests);

  // util.startThread(root, 'watchThread', 'watch', 'watchState');
  // root.replState = {later:true, filter:root.pretty.format};
  // util.later( function () {
  //   util.startThread(root, 'replThread', 'repl', 'replState');
  // });

  root.appState = root.appState || {};
  util.later(function () { root.fxml.openWindow(); });

  // $EXEC('bin/switch');
  // app.init(root.appState);

}).call(this);
