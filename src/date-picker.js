#! /usr/local/bin/rlwrap /usr/bin/jjs -fx -scripting

  /*
 * Copyright (c) 2013, Oracle and/or its affiliates.
 * All rights reserved. Use is subject to license terms.
 *
 * This file is available and licensed under the following license:
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 *  - Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  - Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in
 *    the documentation and/or other materials provided with the distribution.
 *  - Neither the name of Oracle Corporation nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

//hot dates: date picker example 01
/*global _, util, app, trace, main, loading, $SCRIPTS, fxml, prn, watch, repl, app, loading */

(function () {
  'use strict';
  var root = this;
  root.app = {};
  root.appState = root.appState || {};

  app.init = function (state) {
    print('in app.init');
    state.dates = state.dates || [];
    app.setHandler('addButton', 'addDate');
    app.setHandler('deleteButton', 'deleteSelected');
    state.datePicker = fxml.get('datePicker');
    state.datePicker.value = java.time.LocalDate.now();
    state.input = fxml.get('input');
    state.list = fxml.get('dateList');
    app.render(state);
    print('out app.init');
  };

  app.render = function (state) {
    app.setItems(state.list, state.dates);
  };

  app.setItems = function (list, ary) {
    print('in app.setItems');
    var strAry = _.map(ary, function(obj){return obj[0] + ' : ' +  obj[1]; });
    prn(strAry);
    var fxAry;
    if (_.size(strAry) === 0) {
      fxAry = null;
    } else {
      var javaAry = Java.to(strAry, Java.type('java.lang.Object[]'));
      fxAry = javafx.collections.FXCollections.observableArrayList(javaAry);
    }
    list.items = fxAry;
  };

  app.setHandler = function (id, evt) {
    fxml.get(id).onAction = function (e) { app[evt](root.appState, e); };
  };

  app.deleteSelected = function (state) {
    print('in deleteSelected');
    var sel = state.list.selectionModel;
    var idx = sel.selectedIndex;
    print('idx: ' + idx );
    state.sel = sel;
    if (idx === -1) {return;}
    state.dates.splice(idx, 1);
    app.render(state);
    sel.clearSelection();
  };

  app.addDate = function (state) {
    state.dates.push([
      state.datePicker.value + '',
      state.input.text
    ]);
    fxml.get('input').text = '';
    app.render(state);
    state.list.selectionModel.clearSelection();
  };

  var project = '../';
  var compFolder = 'bower_components/';
  var datefxml = project + 'assets/date-picker.fxml';
  var datecss = project + 'assets/date-picker.css';
  root.loading = load(project + compFolder + 'nashorn-repl/lib/loading.js');
  var appList = [
    {path:$SCRIPTS[0], load:false} ,
    { path:datefxml, fxml:datefxml, css:datecss, cb:'loadAssets', load:true },
    { path:datecss, fxml:datefxml, css:datecss, cb:'loadAssets', load:false }
  ];
  root.loadList = loading.getDefaultLoadList(project, compFolder).concat(appList);
  root.loadAssets = function (obj) {
    fxml.setScene(obj.fxml, obj.css);
    app.init(root.appState);
  };
  loading.init(project, compFolder, root.loadList);

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
