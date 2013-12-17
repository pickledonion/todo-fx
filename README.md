# Todo-fx

### Some samples for nashorn and javafx.

This project has a few short javascripts to show the use of javafx, fxml, and css from nashorn. It shows how Scene Builder and Netbeans can be used to live-edit a running JavaFX application.

## Features

* uses the -fx and -scripting flags in nashorn jjs.
* uses javafx controls to make simple apps in javascript.
* uses fxml to structure the apps controls and css to style the presentation.
* all the fxml can be edited in JavaFX Scene Builder.
* loads bower components to create a basic module / dependency system.
* uses a [nashorn-repl](http://github.com/pickledonion/nashorn-repl) component to add a nashorn repl back to a javafx application.
* pretty prints and inspects js types in the nashorn-repl
* enables live coding with automatic reloading of watched modules on save.
* uses a [jasmine-nashorn](http://github.com/pickledonion/jasmine-nashorn) component to run [jasmine](http://pivotal.github.io/jasmine/) unit tests when a module is loaded or reloaded.
* watches and reloads fxml and css to enable live design from Scene Builder.
* shows a pattern for structuring apps that preserves state in a running app as code and design are changed.

## Requirements

Nashorn, the java javascript engine, is part of Java 8. You can download and install [JDK 8 Early Access](https://jdk8.java.net/download.html) if you dont already have it.

    $ java -version
    java version "1.8.0-ea"
    Java(TM) SE Runtime Environment (build 1.8.0-ea-b117)
    Java HotSpot(TM) 64-Bit Server VM (build 25.0-b59, mixed mode)

    $ jjs -version
    nashorn 1.8.0


## Installation

First get this repo:

    $ git clone git@github.com:pickledonion/todo-fx.git

All we need for installation is to get the components:

    $ cd todo-fx
    $ bower install

If you dont have [node](http://nodejs.org/) and [npm](https://npmjs.org/) installed you might want to use the bash script instead:

    $ ./components.sh

##Usage

Now, lets move into the folder with the scripts in:

    $ cd src/

and run with any of:

    $ ./todo-fx.js
    $ ./outliner.js
    $ ./tableview.js
    $ ./date-picker.js
    $ ./fxml3d.js

There is also a netbeans project you can run the examples from too.
Just run different examples by selecting a different project configuration.

There is even an Intellij project but it might not be up to date.


##Repl

When we run todo-fx.js a window opens and the standard nashorn shell `jjs >` prompt is replaced by the `fx >` prompt.

This fx compatible repl is implemented by the repl.js module in nashorn-repl component.


##Live edit

Edit and save todo-fx.js and the running app with update without losing the todo list.

Edit and save the fxml and css and the design will update live without losing the todo list.

##The samples

###todo-fx

* simple todo list.
* add items.
* mark as done.
* remove done items with archive button.

###outliner

* shows the all new TreeTableView
* inline editing of cells (somewhat buggy)
* unfolding and folding of parents.
* add and remove nodes even parents.

###date-picker

* add dates to a list with the all new DatePicker

###tableview

* inline editing of a table of contacts.

###fxml3d

* shows the new 3d shapes loaded from fxml.
* use sliders to control animation.

