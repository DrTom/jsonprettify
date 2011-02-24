PATH = require 'path'
FS = require 'fs'

MAINDIR = PATH.join(PATH.dirname(FS.realpathSync(__filename)),'../../')
LIBDIR = MAINDIR + "lib/"
BINDIR = MAINDIR + "bin/"

testCase = require('nodeunit').testCase

ChildProcess = require 'child_process'
exec = ChildProcess.exec

jsonprettify = require LIBDIR + "jsonprettify"

module.exports = testCase((()->


  "json2prettyjson": (test) ->

    obj =  { somkey: "asdf"
      , arr:
        [ "bla"
        , 5
        , true
        ]
      , bool: false
      }

    parsed = JSON.parse jsonprettify.json2prettyjson JSON.stringify obj
      
    test.ok parsed.somkey is obj.somkey, "value retains"
    test.ok parsed.arr.length is obj.arr.length, "array length retains"
    test.ok parsed.bool is false ,"bool retains"

    test.done()

)())
