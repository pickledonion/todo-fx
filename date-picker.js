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

    state.datePicker = fxml.get('datePicker');
    // state.datePicker = new javafx.scene.control.DatePicker();
    // state.datePicker.id = 'datePicker';

    // fxml.openWindow();
    // var old = fxml.get('datePicker');
    // if (old) {old.parent.children.removeAll(old);}
    // $STAGE.scene.root.children.add(state.datePicker);

  };

  app.data = function () {
    return {
    };
  };

  root.appState = root.appState || {};

  root.loading = load('bower_components/nashorn-repl/lib/loading.js');
  var datefxml = 'assets/date-picker.fxml';
  // var datecss = '';
  var datecss = 'assets/date-picker.css';
  var appList = [
    {path:$SCRIPTS[0], load:false} ,
    { path:datefxml, fxml:datefxml, css:datecss, cb:'loadAssets', load:true },
    { path:datecss, fxml:datefxml, css:datecss, cb:'loadAssets', load:false },
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
