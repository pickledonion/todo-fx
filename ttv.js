#! /usr/local/bin/rlwrap /usr/bin/jjs -fx -scripting
//simple test 16
/*global _, util, app, trace, main, loading, $SCRIPTS, fxml */

(function () {
  'use strict';
  var root = this;

  root.app = {};
  app.init = function (state) {

    state.data = state.data || {name: 'dog', desc:'woof', cost:23, children: [{name:'puppy', desc:'wif', cost:100}, {name:'cat', desc:'miaow', cost:10000 }]};
    state.tree = app.makeTree(state.data);

    app.ttv = fxml.get('ttv');
    app.ttv.root = state.tree;
    // app.ttv = new javafx.scene.control.TreeTableView(state.tree);
    app.ttv.editable = true;
    state.tree.setExpanded(false);
    state.tree.setExpanded(true);

    app.ttv.columns.clear();
    app.colNames = ['name', 'desc', 'cost'];
    app.ttv.columns.clear();
    _.each(app.colNames, function (key) {
      print('COL! :' + key);
      var col  = new javafx.scene.control.TreeTableColumn();
      col.cellValueFactory =
        new javafx.util.Callback({ call: function (obj) {
          return new javafx.beans.property.SimpleStringProperty(obj.value.value[key]);
        }});
      col.cellFactory =
        javafx.scene.control.cell.TextFieldTreeTableCell.forTreeTableColumn();
      app.ttv.columns.add(col);
      col.onEditCommit = function (evt) {
        print('EDIT!');
        prn(evt.rowValue.value);
        print(evt.treeTablePosition.column);
        evt.rowValue.value[app.colNames[evt.treeTablePosition.column]] = evt.newValue;
        state.tree.setExpanded(false);
        state.tree.setExpanded(true);

      };
      app.addButton = fxml.get('add');
      app.addButton.onAction = function () {
        print('add!');
      };

    });
    // fxml.openWindow();
    // $STAGE.scene.root.children.add(app.ttv);
  };

  // app.findTreeItem = function (treeItem, match) {
  //   var ary = util.javaToArray(treeItem.children),
  //   res;
  //   if(treeItem.value === match ) { print('hit'); return treeItem; }
  //   if(_.isArray(ary)){
  //     _.each(ary, function (child) {
  //       res = app.findTreeItem(child, match);
  //       if (res) { print('hitted'); return;}
  //     });
  //   }
  //   return res;
  // };

  app.add = function () {
    var treeItem = app.findTreeItem(app.ttv.root, app.selected());
    app.makeTree()
  };

  app.selected = function () {
    var selItem = app.ttv.selectionModel.selectedItem;
    return selItem && selItem.value;
  };

  app.makeTree = function (src, dst) {
    var treeItem = new javafx.scene.control.TreeItem(src);
    _.each(src.children, function (obj) {
      app.makeTree(obj, treeItem);
    });
    if (dst) { dst.children.add(treeItem); }
    else { return treeItem; };
  };

  root.appState = root.appState || {};

  root.loading = load('bower_components/nashorn-repl/lib/loading.js');
  var todofxml = 'assets/outliner.fxml';
  var todocss = 'assets/outliner.css';
  var appList = [
    {path:$SCRIPTS[0], load:false} ,
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
