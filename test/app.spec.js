// app.spec.js 1
/* globals describe, it, expect, _, util, root */

var root = this;

describe ('app', function(){
  'use strict';

  it ('has underscore function', function () {
    expect(typeof _).toBe('function');
  });

  it ('has util object', function () {
    expect(typeof util).toBe('object');
  });

  it ('is an object', function () {
    expect(util.kindOf(app)).toBe('object');
  });

  // it ('', function () {
  //   expect(util.kindOf()).toBe('object');
  // });

  // it ('is an init function', function () {
  //   expect(util.kindOf().toBe(true);
  // });

});
