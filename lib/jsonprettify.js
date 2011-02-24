/*

   jsonprettify utility

   (c) 2011,  Dr. Thomas Schank

*/var compact, fs, inBuffer, lib, main, outBuffer, outfile, path, readStdin, simplecli, toprettyjson, _;
path = require('path');
fs = require('fs');
main = path.join(path.dirname(fs.realpathSync(__filename)), '../');
lib = main + "lib/";
_ = require('underscore');
simplecli = require('simplecli');
toprettyjson = require(lib + 'toprettyjson');
inBuffer = simplecli.string.createStringBuffer();
outBuffer = simplecli.string.createStringBuffer();
readStdin = true;
outfile = void 0;
compact = false;
exports.json2prettyjson = toprettyjson.json2prettyjson;
exports.obj2prettyjson = toprettyjson.obj2prettyjson;
exports.run = function() {
  var options, opts, read, write;
  opts = {
    indent: "  ",
    sort: true
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
          for (i = 1; (1 <= value ? i <= value : i >= value); (1 <= value ? i += 1 : i -= 1)) {
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
      short: "S",
      long: "noSort",
      description: "arrays and objects are sorted lexicographically by default, disable sorting;",
      callback: function() {
        return opts.sort = false;
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
  simplecli.argparser.parse({
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