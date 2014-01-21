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

//fxml3d example 16
/*global _, util, app, trace, main, loading, $SCRIPTS, fxml, app, loading */


(function () {
  'use strict';
  var root = this;
  root.app = {};

  app.init = function (state) {
    print('in app.init');
    load("fx:graphics.js");

    var canvas = new Canvas(300, 250);
    var gc = canvas.graphicsContext2D;
    $STAGE.scene = new Scene(new Group(canvas));
    // $STAGE.scene.root.children.add(canvas);
    app.drawShapes(gc);
    $STAGE.show();
  };

  app.da = function () {
    // return Java.toJavaArray(arguments, "double");
    return Java.to(arguments, Java.type("double[]"));
  }

  app.drawShapes = function (gc) {
    gc.stroke = Color.PINK;
    gc.lineWidth = 2;
    gc.strokeLine(10, 10, 30, 40);
    gc.fillOval(10, 60, 30, 30);
    gc.strokeOval(60, 60, 30, 30);
    gc.fillRoundRect(110, 60, 30, 30, 10, 10);
    gc.strokeRoundRect(160, 60, 30, 30, 10, 10);
    gc.fillArc(10, 110, 30, 30, 45, 240, ArcType.OPEN);
    gc.fillArc(60, 110, 30, 30, 45, 240, ArcType.CHORD);
    gc.fillArc(110, 110, 30, 30, 45, 240, ArcType.ROUND);
    gc.strokeArc(10, 160, 30, 30, 45, 240, ArcType.OPEN);
    gc.strokeArc(60, 160, 30, 30, 45, 240, ArcType.CHORD);
    gc.strokeArc(110, 160, 30, 30, 45, 240, ArcType.ROUND);

    gc.fillPolygon(app.da(10, 40, 10, 40), app.da(210, 210, 240, 240), 4);
    gc.strokePolygon(app.da(60, 90, 60, 90), app.da(210, 210, 240, 240), 4);
    gc.strokePolyline(app.da(110, 140, 110, 140), app.da(210, 210, 240, 240), 4);
  }

  root.appState = root.appState || {};

  var project = '../';
  var compFolder = 'bower_components/';
  root.loading = load(project + compFolder + 'nashorn-repl/lib/loading.js');
  var appList = [{path: $SCRIPTS[0], load: false}];
  root.loadList = loading.getDefaultLoadList(project, compFolder).concat(appList);
  loading.init(project, compFolder, root.loadList);
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
