#! /usr/local/bin/rlwrap /usr/bin/jjs -fx -scripting
//simple test 16
/*global _, util, app, trace, main, loading, $SCRIPTS, fxml, prn, watch, repl */

(function () {
  'use strict';
  var root = this;
  root.app = {};
  root.appState = root.appState || {};

  app.init = function (state) {
    print('app.init');

    state.data = state.data || app.data();

    state.ttv = fxml.get('ttv');
    state.ttv.id = 'ttv';

    state.ttv.editable = true;

    state.ttv.columns.clear();
    app.colNames = ['name', 'desc', 'cost'];
    state.ttv.columns.clear();
    _.each(app.colNames, function (key) {
      var col  = new javafx.scene.control.TreeTableColumn();
      col.prefWidth = 150;
      col.cellValueFactory =
        new javafx.util.Callback({ call: function (obj) {
          return new javafx.beans.property.SimpleStringProperty(obj.value.value[key]);
        }});
      col.cellFactory =
        javafx.scene.control.cell.TextFieldTreeTableCell.forTreeTableColumn();
      state.ttv.columns.add(col);
      app.setHandler(col, 'editCell', 'onEditCommit');
      // app.setHandler(col, 'init', 'onEditCancel');
    });

    app.setHandler('addButton', 'addToSelected');
    app.setHandler('deleteButton','deleteSelected');

    $STAGE.width = 490;
    app.render(state);
  };

  app.render = function (state) {
    state.tree = app.makeTree(state.data);
    state.ttv.root = state.tree;
  };

  app.setHandler = function (node, fun, handlerName) {
    if (_.isString(node)) { node = fxml.get(node); }
    handlerName = handlerName || 'onAction';
    node[handlerName] = function (e) { app[fun](root.appState, e); };
  };

  app.editCell = function (state, evt) {
    print('in editCell');
    var item = evt.rowValue.value;
    var idx = app.colNames[evt.treeTablePosition.column];
    if(evt.newValue !== null) {evt.rowValue.value[idx] = evt.newValue;}
    app.init(state);
    app.revealTreeItem(app.findTreeItem(state.tree, item ), true);
  };

  app.data = function () {
    return {
      name: 'outline', desc:'', cost:'', children:
      [
        {name:'chapter I', desc:'intro to cats', cost:100},
        {name:'chapter II', desc:'small cats', cost:10000 }
      ]
    };
  };

  app.revealTreeItem = function (treeItem, openState) {
    do {
      treeItem.expanded = openState;
      treeItem = treeItem.parent;
    } while (treeItem !== null)
  };

  app.deleteSelected = function (state, evt) {
    var item = app.selected(state);
    if (item) {
      var treeItem = app.findTreeItem(state.tree, item);
      var parent = treeItem.parent.value;
      app.deleteItem(state.data, item);
      app.init(state);
      app.revealTreeItem(app.findTreeItem(state.tree, parent), true);
    }
  };

  app.treeItemList = function (treeItemAry) {
    if (!_.isArray(treeItemAry)) {treeItemAry = [treeItemAry];}
    return _.reduce(treeItemAry, function (memo, treeItem) {
      memo.push(treeItem);
      return memo.concat(app.treeItemList(util.javaToArray(treeItem.children), []));
    }, []);
  };

  app.findTreeItem = function (treeItem, match) {
    return _.find(app.treeItemList(treeItem), function (o) { return o.value === match});
  };

  app.deleteItem = function (context, match) {
    if (!_.isArray(context)) {context = [context];}
    var hit = -1;
    _.each(context, function (obj, index) {
      if (obj === match) { print('!HIT ' + index ); hit = index; }
      else if (_.isArray(obj.children)) { app.deleteItem(obj.children, match); }
    });
    if (hit !== -1) { print('SPLICE!'); context.splice(hit, 1);}
  };

  app.addToSelected = function (state, evt) {
    print('addToSelected');
    var parent = app.selected(state) || state.ttv.root.value;
    var newItem = {name:new Date() + '', desc:'-', cost:'-' };
    app.addItem(parent,newItem);
    app.init(state);
    var newTree = app.findTreeItem(state.ttv.root, newItem);
    app.revealTreeItem(newTree, true);
    state.ttv.selectionModel.select(newTree);
  };

  app.addItem = function (parent, child) {
    if(!parent.children) { parent.children = []; }
    parent.children.push(child);
  };

  app.selected = function (state) {
    var selItem = state.ttv.selectionModel.selectedItem;
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
