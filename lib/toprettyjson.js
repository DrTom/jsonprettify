/*
Copyright 2011 Thomas Schank
Released under the GNU AFFERO GENERAL PUBLIC LICENSE Version 3
*/var helpers, json2prettyjson, obj2prettyjson, println, _;
helpers = require('drtoms-nodehelpers');
_ = require('underscore');
println = helpers.printer.println;
obj2prettyjson = function(level, obj, buffer, opts) {
  var appendValue, first, indent, key, keys, line, sort, value, _i, _j, _len, _len2;
  first = true;
  indent = (opts != null) && (opts.indent != null) ? opts.indent : "  ";
  sort = (opts != null) && (opts.sort != null) ? opts.sort : false;
  line = function(s) {
    var doindent;
    doindent = function(i) {
      return ((function() {
        var _results;
        _results = [];
        while (i -= 1) {
          _results.push(indent);
        }
        return _results;
      })()).join("");
    };
    if (level > 1 || s !== "{") {
      buffer.append("\n");
    }
    return buffer.append(doindent(level) + s + " ");
  };
  appendValue = function(value) {
    if (typeof value === 'object') {
      return obj2prettyjson(level + 1, value, buffer, opts);
    } else {
      return buffer.append(JSON.stringify(value));
    }
  };
  if (_.isArray(obj)) {
    if (sort) {
      obj.sort();
    }
    line("[");
    for (_i = 0, _len = obj.length; _i < _len; _i++) {
      value = obj[_i];
      if (!first) {
        line(",");
      }
      if (first) {
        first = false;
      }
      appendValue(value);
    }
    return line("]");
  } else if (typeof obj === 'object') {
    keys = (function() {
      var _results;
      _results = [];
      for (key in obj) {
        value = obj[key];
        _results.push(key);
      }
      return _results;
    })();
    if (sort) {
      keys.sort();
    }
    line("{");
    for (_j = 0, _len2 = keys.length; _j < _len2; _j++) {
      key = keys[_j];
      value = obj[key];
      if (!first) {
        line(",");
      }
      if (first) {
        first = false;
      }
      buffer.append((JSON.stringify(key)) + " : ");
      appendValue(value);
    }
    line("}");
    if (level === 1) {
      return buffer.append("\n");
    }
  }
};
exports.obj2prettyjson = obj2prettyjson;
json2prettyjson = function(injson, opts) {
  var outBuffer;
  outBuffer = helpers.stringhelper.createStringBuffer();
  obj2prettyjson(1, JSON.parse(injson), outBuffer, opts);
  return outBuffer.toString();
};
exports.json2prettyjson = json2prettyjson;