/* globals describe, it, expect, _, root */

var root = this;

describe ("todo", function(){

  // load('lib/vanilla.js');

  it ("has underscore function", function () {
    expect(typeof _).toBe('function');
  });

  it ("is an object", function () {
    // expect(_.isObject(tracer)).toBe(true);
  });

  it ("has a trace function", function () {
    // expect(_.isFunction(tracer.trace)).toBe(true);
  });

  it ("has an untrace function", function () {
    // expect(_.isFunction(tracer.untrace)).toBe(true);
  });

});
