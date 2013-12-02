#! /usr/local/bin/rlwrap /usr/bin/jjs -fx -scripting
//simple test 17
/*global _, util, app, trace, main, loading, $SCRIPTS, fxml, app, loading */

(function () {
  'use strict';
  var root = this;

  root.app = {};
//  $SCRIPTS = $SCRIPTS || [''];
  print($STAGE);

  app.addTodo = function (state) {
    state.todos.push({
      label: fxml.get('input').text,
      done: new javafx.beans.property.SimpleBooleanProperty(false)
    });
    fxml.get('input').text = '';
    app.render(state);
  };

  app.archive = function (state) {
    var oldTodos = state.todos;
    state.todos = [];
    _.each(oldTodos, function (todo) {
      if (!todo.done.value) {
        state.todos.push(todo);
      }
    });
    app.render(state);
  };

  app.listen = function (obj, props) {
    if (util.isJava(props.listen)) {
      obj.removeListener(props.listen);
    }
    props.listen = new javafx.beans.value.ChangeListener(function (e) {
      app.render(root.appState);
    });
    obj.addListener(props.listen);
  };

  app.makeCell = function (checkFun, labelFun) {
    var callback = new javafx.util.Callback(function (props) {
      var check = checkFun(props);
      app.listen(check, props);
      return check;
    });
    var stringer = new javafx.util.StringConverter({toString: labelFun});
    var cellClass = javafx.scene.control.cell.CheckBoxListCell;
    return cellClass.forListView(callback, stringer);
  };

  app.setHandler = function (id, evt) {
    fxml.get(id).onAction = function () {
      app[evt](root.appState);
    };
  };

  app.init = function (state) {
    state.todos = state.todos || [];
    state.todoText = '';
    app.setHandler('addButton', 'addTodo');
    app.setHandler('archive', 'archive');
    state.listName = 'todoList';
    fxml.get(state.listName).setEditable(true);
    fxml.get(state.listName).cellFactory =
        app.makeCell(util.get('done'),
            util.get('label'));
    app.render(state);
  };

  app.render = function (state) {
    app.setItems(state.listName, state.todos);
    fxml.get('remaining').text = app.remaining(state) + ' of ' +
        _.size(state.todos) + ' remaining';
  };

  app.remaining = function (state) {
    return _.reduce(state.todos, function (count, todo) {
      return count += !todo.done.value;
    }, 0);
  };

  app.setItems = function (name, ary) {
    var javaArray = Java.to(ary, Java.type('java.lang.Object[]'));
    var fxArray = javafx.collections.FXCollections.observableArrayList(javaArray);
    fxml.get(name).items = fxArray;
  };

  root.appState = root.appState || {};

  var project = '../';
  var components = 'bower_components/';
  root.loading = load(project + components + 'nashorn-repl/lib/loading.js');
  var todofxml = project + 'assets/todo.fxml';
  var todocss = project + 'assets/todo.css';
  var appList = [
    {path: $SCRIPTS[0], load: false},
    { path: todofxml, fxml: todofxml, css: todocss, cb: 'loadAssets', load: true },
    { path: todocss, fxml: todofxml, css: todocss, cb: 'loadAssets', load: false }
  ];
  root.loadList = loading.getDefaultLoadList(project, components).concat(appList);
  root.loadAssets = function (obj) {
    fxml.setScene(obj.fxml, obj.css);
    app.init(root.appState);
  };

  loading.init(project, components, root.loadList);

  root.replState = {later: true, filter: root.pretty.format};

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
