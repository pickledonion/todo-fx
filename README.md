# Todo-fx

### Some samples for nashorn and javafx.

This project has a few short javascripts to show the use of javafx from nashorn.

## Features

* uses the -fx and -scripting flags in nashorn jjs
* uses javafx controls to make simple apps in javascript.
* loads bower components.
* uses a [nashorn-repl](http://github.com/pickledonion/nashorn-repl) component to add a nashorn repl back to a javafx application.
* pretty prints and inspects js types in the nashorn-repl
* enables live coding with automatic reloading of watched modules on save.
* uses a [jasmine-nashorn](http://github.com/pickledonion/jasmine-nashorn) component to run [jasmine](http://pivotal.github.io/jasmine/) unit tests when a module is loaded or reloaded.
* watches and reloads fxml and css to enable live design.
* shows a pattern for structuring apps that preserves state in a running app as code and design are changed.


## Installation

First get this repo and go inside:

    $ git clone git@github.com:pickledonion/todo-fx.git
    $ cd todo-fx

All we need to do is install the components:

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

There is also a netbeans project you can run the examples from too.
Just run different examples by selecting a different project configuration.

##Repl

When we run todo-fx.js a window opens and the standard nashorn shell

    jjs>

prompt is replaced by the

    fx>

prompt which is implemented by repl.js module in nashorn-repl.


##Live edit

Edit and save todo-fx.js and the running app with update without losing the todo list.
Edit and save the fxml and css and the design will update live without losing the todo list.
