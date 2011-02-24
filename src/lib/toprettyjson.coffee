simplecli = require 'simplecli'
_ = require 'underscore'

println = simplecli.printer.println

obj2prettyjson= (level,obj,buffer,opts) ->
  first = true
  indent = if opts? and opts.indent? then opts.indent else "  "
  sort = if opts? and opts.sort? then opts.sort else true

  line = (s) ->
    doindent = (i) ->
      (while i -= 1
        indent).join ""
    if level > 1 or s isnt "{" then buffer.append "\n"
    buffer.append doindent(level) + s + " "
  
  appendValue = (value) ->
    if typeof value is 'object' then obj2prettyjson  level+1, value, buffer, opts
    else buffer.append JSON.stringify value

  if _.isArray obj
    obj.sort() if sort
    line "["
    for value in obj
      if not first then line ","
      if first then first=false
      appendValue value
    line "]"

  else if typeof obj is 'object'
    # the whole keys business is because of sorting
    keys = (key for key,value of obj)
    keys.sort() if sort
    line "{"
    for key in keys
      value = obj[key]
      if not first then line ","
      if first then first=false
      buffer.append (JSON.stringify key) + " : "
      appendValue value
    line "}"
    if level is 1 then buffer.append "\n"

exports.obj2prettyjson= obj2prettyjson


json2prettyjson = (injson,opts) ->
  outBuffer = simplecli.string.createStringBuffer()
  obj2prettyjson 1, (JSON.parse injson), outBuffer, opts
  outBuffer.toString()

exports.json2prettyjson = json2prettyjson

