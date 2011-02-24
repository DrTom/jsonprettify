var BINDIR, ChildProcess, FS, LIBDIR, MAINDIR, PATH, exec, jsonprettify, testCase;
PATH = require('path');
FS = require('fs');
MAINDIR = PATH.join(PATH.dirname(FS.realpathSync(__filename)), '../../');
LIBDIR = MAINDIR + "lib/";
BINDIR = MAINDIR + "bin/";
testCase = require('nodeunit').testCase;
ChildProcess = require('child_process');
exec = ChildProcess.exec;
jsonprettify = require(LIBDIR + "jsonprettify");
module.exports = testCase((function() {
  return {
    "json2prettyjson": function(test) {
      var obj, parsed;
      obj = {
        somkey: "asdf",
        arr: ["bla", 5, true],
        bool: false
      };
      parsed = JSON.parse(jsonprettify.json2prettyjson(JSON.stringify(obj)));
      test.ok(parsed.somkey === obj.somkey, "value retains");
      test.ok(parsed.arr.length === obj.arr.length, "array length retains");
      test.ok(parsed.bool === false, "bool retains");
      return test.done();
    }
  };
})());