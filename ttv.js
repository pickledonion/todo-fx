#! /usr/local/bin/rlwrap /usr/bin/jjs -fx -scripting
//simple test 13
/*global _, util, app, trace, main, loading, $SCRIPTS, fxml */

(function () {
  'use strict';
  var root = this;

  root.app = {};
  app.init = function () {
    var ttv = fxml.get('ttv');

    $STAGE.scene.root.children.remove($STAGE.scene.root.children[0]);
    var Ti = javafx.scene.control.TreeItem;
    var r = new Ti('root node');
    var c1 = new Ti('c1');
    var c2 = new Ti('c2');
    var c3 = new Ti('c3');
    r.setExpanded(true);
    r.children.setAll(c1,c2,c3);
    ttv = new javafx.scene.control.TreeTableView(r);
    var col1 = new javafx.scene.control.TreeTableColumn();
    col1.cellValueFactory =
      new javafx.util.Callback( { call: function () {
        return new javafx.beans.property.ReadOnlyStringWrapper('poop');
      }} );
    ttv.columns.add(col1);
    $STAGE.scene.root.children.add(ttv);
  };

  root.appState = root.appState || {};

  root.loading = load('bower_components/nashorn-repl/lib/loading.js');
  var todofxml = 'assets/treetableview.fxml';
  var todocss = 'assets/todo.css';
  var appList = [
    {path:$SCRIPTS[0], load:false},
    { path:todofxml, fxml:todofxml, css:todocss, cb:'loadAssets', load:true },
    { path:todocss, fxml:todofxml, css:todocss, cb:'loadAssets', load:false },
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
