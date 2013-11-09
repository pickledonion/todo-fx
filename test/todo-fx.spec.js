// todo-fx.spec.js 17
/* globals describe, it, expect, _, util, root */

var root = this;

describe ('todofx', function(){
  'use strict';

  it ('has underscore function', function () {
    expect(typeof _).toBe('function');
  });

  it ('has util object', function () {
    expect(typeof util).toBe('object');
  });

  // it ('is an object', function () {
  //   expect(util.kindOf(todofx)).toBe('object');
  // });

  it ('patsy', function () {
    // expect(util.kindOf.oops).toBe('object');
  });

  // it ('is an init function', function () {
  //   expect(util.kindOf().toBe(true);
  // });

});
