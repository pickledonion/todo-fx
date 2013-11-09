
/* globals fxml, _, util, prn, trace, events */
(function(){
  'use strict';
  var root = this;
  var app = {};

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
    _.each(oldTodos, function (todo) { if (!todo.done.value) {state.todos.push(todo);}});
    app.render(state);
  };

  app.listen = function (obj, props) {
    if (util.isJava(props.listen)) { obj.removeListener(props.listen); }
    props.listen = new javafx.beans.value.ChangeListener(function (e) {
      app.render(root.appState);
    });
    obj.addListener(props.listen);
  };

  app.makeCell = function (checkFun, labelFun) {
    var callback = new javafx.util.Callback( function (props) {
      var check = checkFun(props);
      app.listen(check, props);
      return check;
    });
    var stringer = new javafx.util.StringConverter({toString: labelFun});
    var cellClass = javafx.scene.control.cell.CheckBoxListCell;
    var cell = cellClass.forListView(callback, stringer);
    // prn(cell);
    // print('edit: ' + cell.editable);
    return cell;
  };

  app.setHandler = function (id, evt) {
    fxml.get(id).onAction = function () { app[evt](root.appState); };
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

  return app;

}).call(this);
