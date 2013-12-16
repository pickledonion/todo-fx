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

//fxml3d example 10
/*global _, util, app, trace, main, loading, $SCRIPTS, fxml, app, loading */

print('fxml3d!!!!!!');

(function () {
  'use strict';
  var root = this;
  root.app = {};

  app.init = function (state) {
    print('app.init');
    state.t = state.t || 0;
    state.running = true;
    state.r = new javafx.scene.transform.Rotate(0, 0, 0);
    state.r.axis = new javafx.geometry.Point3D(0, 1, 1);
    var s1 = fxml.get('shape1');
    s1.transforms.clear();
    s1.transforms.add(state.r);
    app.setColor(s1, '0xf0ff', '0xfff1');
    var s2 = fxml.get('shape2');
    app.setColor(s2, '0x0F0', '0xF00');
    var s3 = fxml.get('shape3');
    app.setColor(s3, '0xF00', '0xF00');
    app.setHandler('animate-checkbox', 'running');
    $STAGE.scene.camera = new javafx.scene.PerspectiveCamera(false);
    var p = fxml.get('point');
    p.layoutX = 400;
    p.layoutY = 400;
    p.translateZ = 1000;

    p.scope.add(s1);

  };

  app.running = function (state, evt) {
    root.evt = evt;
    state.running = !state.running;
    app.render(state);
  }

  app.update = function (state) {
    if (state.running) {
      state.t = state.t + 1;
      state.r.angle = state.t % 360;
    }
    app.render(state);
  };

  app.render = function (state) {
    fxml.get('animate-checkbox').selected = state.running;
  }

  app.setHandler = function (node, fun, handlerName) {
    if (_.isString(node)) { node = fxml.get(node); }
    handlerName = handlerName || 'onAction';
    node[handlerName] = function (e) { app[fun](root.appState, e); };
  };

  app.makeColor = function(col) {
    return javafx.scene.paint.Color.web(col);
  }
  app.setColor = function (node, diffuseCol, specularCol) {
    print('in .. setColor', diffuseCol, specularCol);
    node.material  = new javafx.scene.paint.PhongMaterial();
    node.material.diffuseColor = app.makeColor(diffuseCol);
    node.material.specularColor = app.makeColor(specularCol);
  }

  root.appState = root.appState || {};

  var project = '../';
  var compFolder = 'bower_components/';
  root.loading = load(project + compFolder +  'nashorn-repl/lib/loading.js');
  var appFxml = project + 'assets/fxml3d.fxml';
  var appCss = project + 'assets/fxml3d.css';
  var appList = [
    {path:$SCRIPTS[0], load:false},
    { path:appFxml, fxml:appFxml, css:appCss, cb:'loadAssets', load:true },
    { path:appCss, fxml:appFxml, css:appCss, cb:'loadAssets', load:false }
  ];
  root.loadList = loading.getDefaultLoadList(project, compFolder).concat(appList);
  root.loadAssets = function (obj) {
    fxml.setScene(obj.fxml, obj.css);
    app.init(root.appState);
  };
  loading.init(project ,compFolder, root.loadList);

  root.replState = {later:true, filter:root.pretty.format};

  root.timer && root.timer.stop();
  root.timer = new javafx.animation.AnimationTimer(function () {
    app.update(root.appState);
    watch.update(root.watchState);
    repl.update(root.replState);
  });
  root.timer.start();

  // $EXEC('bin/switch');
  app.init(root.appState);

}).call(this);
