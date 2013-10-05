//kindOf.spec.js 12
/* globals describe, it, expect, _, root, util */

var root = this;

describe ("kindOf", function(){

  it ("is in a object ns", function () {
    expect(_.isObject(util)).toBe(true);
  });

  it ("is a function", function () {
    expect(_.isFunction(util.kindOf)).toBe(true);
  });

  it ("knows numbers", function () {
    expect(util.kindOf(23)).toBe('number');
  });

  it ("knows strings", function () {
    expect(util.kindOf('foo')).toBe('string');
  });

  it ("knows functions", function () {
    expect(util.kindOf(function () {})).toBe('function');
  });

  it ("knows arrays", function () {
    expect(util.kindOf([])).toBe('array');
  });

  it ("knows js objects", function () {
    expect(util.kindOf({})).toBe('object');
  });

  it ("knows java instances", function () {
    expect(util.kindOf(new java.lang.Thread())).toBe('java');
  });

  it ("knows java classes", function () {
    expect(util.kindOf(java.lang.Thread)).toBe('java');
  });

});
