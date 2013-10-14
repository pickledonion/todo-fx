#! /bin/bash
cd ~/dev/todo-fx
find lib test ~/dev/nashorn-repl/lib ~/dev/jasmine-nashorn/lib bower_components -name '*.js' | ack -v min | xargs /usr/local/bin/ctags -e
