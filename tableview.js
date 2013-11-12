#! /usr/local/bin/rlwrap /usr/bin/jjs -fx -scripting
//table view example 4
/*global _, util, app, trace, main, loading, $SCRIPTS, fxml */

(function () {
  'use strict';
  var root = this;
  root.app = {};

  app.init = function (state) {
    app.tableView = app.tableView || new javafx.scene.control.TableView();
    app.tableView.editable = true;

    state.data = state.data ||  [['tom','smith'], ['bob', 'bobbin'] ];
    app.setData(state.data);

    _.each(state.data,  function () {
      var col = new javafx.scene.control.TableColumn();
      col.cellValueFactory =
        new javafx.util.Callback({ call: function (obj) {
          return new javafx.beans.property.SimpleStringProperty(obj.value[0]);
        }});
      col.cellFactory =
        javafx.scene.control.cell.TextFieldTableCell.forTableColumn();
      app.tableView.columns.add(col);
      col.onEditCommit = function (obj) {
        var tp = obj.tablePosition;
        state.data[tp.row][tp.column]= obj.newValue;
      };
    });

    fxml.openWindow();
    $STAGE.scene.root.children.add(app.tableView);
  };

  app.setData = function (data) {
    var ja = Java.to(data, Java.type("java.lang.Object[]"));
    var fxList = javafx.collections.FXCollections.observableArrayList(ja);
    app.tableView.items = fxList;
  };

  root.appState = root.appState || {};

  root.loading = load('bower_components/nashorn-repl/lib/loading.js');
  // var todofxml = 'assets/treetableview.fxml';
  // var todocss = 'assets/todo.css';
  var appList = [
    {path:$SCRIPTS[0], load:false}
    // { path:todofxml, fxml:todofxml, css:todocss, cb:'loadAssets', load:true },
    // { path:todocss, fxml:todofxml, css:todocss, cb:'loadAssets', load:false },
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
