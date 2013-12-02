#! /usr/local/bin/rlwrap /usr/bin/jjs -fx -scripting
//table view example 4
/*global _, util, app, trace, main, loading, $SCRIPTS, fxml, prn*/

(function () {
  'use strict';
  var root = this;
  root.app = {};
  root.appState = root.appState || {};

  app.init = function (state) {
    state.tableView = fxml.get('tableView')
    state.tableView.editable = true;

    state.data = state.data ||  [ ['tom', 'smith', '1'] ];

    state.tableView.columns.clear();
    state.colNames = ['first name', 'family name', 'telephone number'];
    _.each(state.colNames, function (colName, idx) {
      var col = new javafx.scene.control.TableColumn();
      col.prefWidth = 150;
      col.cellValueFactory =
        new javafx.util.Callback({ call: function (obj) {
          return new javafx.beans.property.SimpleStringProperty(obj.value[idx]);
        }});
      col.cellFactory =
        javafx.scene.control.cell.TextFieldTableCell.forTableColumn();
      state.tableView.columns.add(col);
      col.onEditCommit = function (obj) {
        var tp = obj.tablePosition;
        state.data[tp.row][tp.column]= obj.newValue;
      };
    });

    app.setHandler('addButton', 'addContact');
    app.setHandler('deleteButton', 'deleteSelected');
    app.render(state);

//    $STAGE.width = 490;

  };

  app.render = function (state) {
    print('in render');
    prn(state);
    app.setItems(state.tableView, state.data);
  };

  app.setItems = function (control, data) {
    print('in setitems');
    prn(data);
    var ja = Java.to(data, Java.type("java.lang.Object[]"));
    var fxList = javafx.collections.FXCollections.observableArrayList(ja);
    control.items = fxList;
  };

  app.setHandler = function (id, evt) {
    fxml.get(id).onAction = function (e) { app[evt](root.appState, e); };
  };

  app.deleteSelected = function (state) {
    print('in deleteSelected');
    var sel = state.tableView.selectionModel;
    var idx = sel.selectedIndex;
    print('idx: ' + idx );
    state.sel = sel;
    if (idx === -1) {return;}
    state.data.splice(idx, 1);
    app.render(state);
    var newIdx = idx + 1;
    sel.clearSelection();
  };

  app.addContact = function (state) {
    print('addContact');
    state.data.push([
      'first name',
      'family name',
      'phone number'
    ]);
    app.render(state);
    state.tableView.selectionModel.clearSelection();
  };

  var project = '../';
  var compFolder = 'bower_components/'
  root.loading = load(project + compFolder + 'nashorn-repl/lib/loading.js');
  var appFxml = project +  'assets/tableview.fxml';
  var appCss = project + 'assets/tableview.css';
  var appList = [
    {path:$SCRIPTS[0], load:false},
    { path:appFxml, fxml:appFxml, css:appCss, cb:'loadAssets', load:true },
    { path:appCss, fxml:appFxml, css:appCss, cb:'loadAssets', load:false },
  ];
  root.loadList = loading.getDefaultLoadList(project, compFolder).concat(appList);
  root.loadAssets = function (obj) {
    fxml.setScene(obj.fxml, obj.css);
    app.init(root.appState);
  };

  loading.init( project, compFolder, root.loadList);

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
