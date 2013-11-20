#! /usr/local/bin/rlwrap /usr/bin/jjs -fx -scripting
//simple test 16
/*global _, util, app, trace, main, loading, $SCRIPTS, fxml, prn, watch, repl */

(function () {
  'use strict';
  var root = this;

  root.app = {};
  app.init = function (state) {
    print('app.init');
    state.data = state.data || app.data();
    state.tree = app.makeTree(state.data);

    app.ttv = fxml.get('ttv');
    // app.ttv = new javafx.scene.control.TreeTableView();
    app.ttv.id = 'ttv';
    app.ttv.root = state.tree;

    app.ttv.editable = true;
    state.tree.setExpanded(false);
    state.tree.setExpanded(true);

    app.ttv.columns.clear();
    app.colNames = ['name', 'desc', 'cost'];
    app.ttv.columns.clear();
    _.each(app.colNames, function (key) {
      print('COL! :' + key);
      var col  = new javafx.scene.control.TreeTableColumn();
      col.prefWidth = 150;
      col.cellValueFactory =
        new javafx.util.Callback({ call: function (obj) {
          return new javafx.beans.property.SimpleStringProperty(obj.value.value[key]);
        }});
      col.cellFactory =
        javafx.scene.control.cell.TextFieldTreeTableCell.forTreeTableColumn();
      app.ttv.columns.add(col);

      col.onEditCancel = function (evt) {
        print('oneditcancel');
        // app.editCell(evt);
        app.init(root.appState);
      };

      col.onEditStart = function (evt) { print('oneditstart');};

      col.onEditCommit = function (evt) {
        app.editCell(evt);
      };
      fxml.get('add').onAction = app.addToSelected;
      fxml.get('delete').onAction = app.deleteSelected;
    });

    // fxml.openWindow();

    // var fxttv = fxml.get('ttv');
    // if (fxttv) {fxttv.parent.children.removeAll(fxttv);}
    // $STAGE.scene.root.children.add(app.ttv);

  };

  app.editCell = function (evt) {
    print('EDIT!');
    root.evt = evt;
    prn(evt.rowValue && evt.rowValue.value);
    print(evt.treeTablePosition.column);
    print('new: ' + evt.newValue);
    var idx = app.colNames[evt.treeTablePosition.column];
    evt.rowValue.value[idx] = evt.newValue;
    var treeItem = app.findTreeItem(app.ttv.root, evt.rowValue.value);
    print('treeItem ' + treeItem );
    if (treeItem) {
      var parent = treeItem.parent;
      prn(evt.rowValue.value);
      print('treeItem: ' + treeItem)
      parent.setExpanded(false);
      parent.setExpanded(true);
    }
    // app.init(root.appState);
  };

  app.data = function () {
    return {
      name: 'outline', desc:'', cost:'', children:
      [
        {name:'puppy', desc:'wif', cost:100},
        {name:'cat', desc:'miaow', cost:10000 }
      ]
    };
  };

  app.deleteSelected = function () {
    print('in deleteSelected');
    var item = app.selected();
    prn(item);
    if(!item) {return;}
    app.deleteItem([root.appState.data], item);
    app.init(root.appState);
  };

  app.deleteItem = function (context, match) {
    var hit = -1;
    _.each(context, function (obj, index) {
      if (obj === match) { print('!HIT ' + index ); hit = index; }
      else if (_.isArray(obj.children)) { app.deleteItem(obj.children, match); }
    });
    if (hit !== -1) { print('SPLICE!'); context.splice(hit, 1);}
  };

  app.addToSelected = function () {
    var parent = app.selected() || app.ttv.root.value;
    app.addItem(parent, {name:'-', desc:'-', cost:'-' });
    app.init(root.appState);
  };

  app.addItem = function (parent, child) {
    if(!parent.children) { parent.children = []; }
    parent.children.push(child);
  };

  app.findTreeItem = function (treeItem, match) {
    if(treeItem.value === match ) { return treeItem; }
    var ary = util.javaToArray(treeItem.children);
    if(_.isArray(ary)){
      return  _.find(_.map(ary, function (child) {
        return app.findTreeItem(child, match);
      }), function (obj) {return obj !== false;});
    } else {
      return false;
    }
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
    else { return treeItem; }
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

  if (root.timer) {root.timer.stop();}
  root.timer = new javafx.animation.AnimationTimer(function () {
    // app.update(root.appState);
    watch.update(root.watchState);
    repl.update(root.replState);
  });
  root.timer.start();

  // $EXEC('bin/switch');
  app.init(root.appState);

}).call(this);
