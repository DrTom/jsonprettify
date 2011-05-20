###

   jsonprettify utility

   (c) 2011,  Dr. Thomas Schank

###

###
Copyright 2011 Thomas Schank
Released under the GNU AFFERO GENERAL PUBLIC LICENSE Version 3
###

path = require('path')
fs = require('fs')
main = path.join(path.dirname(fs.realpathSync(__filename)), '../')
lib = main + "lib/"

_ = require 'underscore'
helpers = require 'drtoms-nodehelpers'

toprettyjson = require (lib + 'toprettyjson')

inBuffer= helpers.stringhelper.createStringBuffer()
outBuffer= helpers.stringhelper.createStringBuffer()

readStdin = true
outfile = undefined
compact = false

exports.json2prettyjson = toprettyjson.json2prettyjson

exports.obj2prettyjson = toprettyjson.obj2prettyjson

exports.run = () ->

  opts =
    { indent : "  "
    , sort : false
    }

  options = [
      { short: "i"
      , long : "infile"
      , description: "input file, can be repeated multiple times"
      , value : true
      , callback : (value) ->
          readStdin = false
          inBuffer.append fs.readFileSync(value,'utf8')
      }
    , { short: "l"
      , long : "indent"
      , description: "indentlevel, number of spaces to indent for each level, default is 2"
      , value : true
      , callback : (value) -> (opts.indent = ( " " for i in [1..value]).join "")
      }
    , { short: "o"
      , long : "outfile"
      , value : true
      , callback : (value) -> outfile = value
      }
    , { short: "s"
      , long : "sort"
      , description: "try to sort arrays and objects lexicographically"
      , callback : () -> opts.sort = true
      }
    , { short: "r"
      , long : "replace"
      , value : true
      , callback : (value) ->
          outfile = value
          readStdin = false
          inBuffer.append fs.readFileSync(value,'utf8')
      }
    , { short: "c"
      , long : "compact"
      , callback :  -> compact = true
      }
  ]

  helpers.argparser.parse
    options: options
    help: true


  # not DRY, should it be in helpers ??? 
  read = (cont) ->
    if readStdin
      stdin = process.openStdin()
      stdin.setEncoding('utf8')
      stdin.on 'data', (chunk) ->
        inBuffer.append chunk
      stdin.on 'end', () ->
        cont()
    else
      cont()

  # not DRY, should it be in helpers ???
  write = (data,cont) ->
    if not outfile?
      process.stdout.write data
      cont()
    else
      fs.writeFile outfile,data, 'utf8', (err) ->
        cont()

  read (err) ->
    obj = JSON.parse(inBuffer.toString())
    json =
      if compact
        JSON.stringify(obj)
      else
        toprettyjson.obj2prettyjson 1, obj, outBuffer, opts
        outBuffer.toString()
    write json, (err)->
  
