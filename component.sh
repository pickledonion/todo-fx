#!/usr/bin/env bash

echo INFO: :use bower if possible instead
folder="bower_components"
rm -rf $folder
mkdir $folder
cd $folder
git clone git@github.com:pickledonion/nashorn-repl.git
git clone git@github.com:jashkenas/underscore.git
git clone git://github.com/documentcloud/underscore-contrib
cd underscore-contrib
git checkout 2c3bfc952217b4825f44c6cd293f6eac9030b8e4
cd ..
git clone git@github.com:pickledonion/jasmine-nashorn.git
git clone git@github.com:pivotal/jasmine.git
cd jasmine
git checkout fadd494cab99b75c2885f4e9becee582b11b6fcc
cd ..
