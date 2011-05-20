/*

   jsonprettify utility

   (c) 2011,  Dr. Thomas Schank

*/
/*
Copyright 2011 Thomas Schank
Released under the GNU AFFERO GENERAL PUBLIC LICENSE Version 3
*/var compact, fs, helpers, inBuffer, lib, main, outBuffer, outfile, path, readStdin, toprettyjson, _;
path = require('path');
fs = require('fs');
main = path.join(path.dirname(fs.realpathSync(__filename)), '../');
lib = main + "lib/";
_ = require('underscore');
helpers = require('drtoms-nodehelpers');
toprettyjson = require(lib + 'toprettyjson');
inBuffer = helpers.stringhelper.createStringBuffer();
outBuffer = helpers.stringhelper.createStringBuffer();
readStdin = true;
outfile = void 0;
compact = false;
exports.json2prettyjson = toprettyjson.json2prettyjson;
exports.obj2prettyjson = toprettyjson.obj2prettyjson;
exports.run = function() {
  var options, opts, read, write;
  opts = {
    indent: "  ",
    sort: false
  };
  options = [
    {
      short: "i",
      long: "infile",
      description: "input file, can be repeated multiple times",
      value: true,
      callback: function(value) {
        readStdin = false;
        return inBuffer.append(fs.readFileSync(value, 'utf8'));
      }
    }, {
      short: "l",
      long: "indent",
      description: "indentlevel, number of spaces to indent for each level, default is 2",
      value: true,
      callback: function(value) {
        var i;
        return opts.indent = ((function() {
          var _results;
          _results = [];
          for (i = 1; 1 <= value ? i <= value : i >= value; 1 <= value ? i++ : i--) {
            _results.push(" ");
          }
          return _results;
        })()).join("");
      }
    }, {
      short: "o",
      long: "outfile",
      value: true,
      callback: function(value) {
        return outfile = value;
      }
    }, {
      short: "s",
      long: "sort",
      description: "try to sort arrays and objects lexicographically",
      callback: function() {
        return opts.sort = true;
      }
    }, {
      short: "r",
      long: "replace",
      value: true,
      callback: function(value) {
        outfile = value;
        readStdin = false;
        return inBuffer.append(fs.readFileSync(value, 'utf8'));
      }
    }, {
      short: "c",
      long: "compact",
      callback: function() {
        return compact = true;
      }
    }
  ];
  helpers.argparser.parse({
    options: options,
    help: true
  });
  read = function(cont) {
    var stdin;
    if (readStdin) {
      stdin = process.openStdin();
      stdin.setEncoding('utf8');
      stdin.on('data', function(chunk) {
        return inBuffer.append(chunk);
      });
      return stdin.on('end', function() {
        return cont();
      });
    } else {
      return cont();
    }
  };
  write = function(data, cont) {
    if (!(outfile != null)) {
      process.stdout.write(data);
      return cont();
    } else {
      return fs.writeFile(outfile, data, 'utf8', function(err) {
        return cont();
      });
    }
  };
  return read(function(err) {
    var json, obj;
    obj = JSON.parse(inBuffer.toString());
    json = compact ? JSON.stringify(obj) : (toprettyjson.obj2prettyjson(1, obj, outBuffer, opts), outBuffer.toString());
    return write(json, function(err) {});
  });
};