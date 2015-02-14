var callsite = require('callsite')
  , fs = require('fs')
  , path = require('path')
  , util = require('util')
  , AssertionError = require('assert').AssertionError

/**
 * Enable the module only if not in the `production` environment.
 */

module.exports = (process.env.NODE_ENV === 'production')
    ? function() {}
    : assert

/**
 * Asserts that `expression` is true.
 */

function fail(extraMessage) {
    var stack = callsite()
      , file = stack[2].getFileName()
      , line = stack[2].getLineNumber()
      , message = getAssertionExpression(file, line)

    if (fail.caller !== assert)
        message = "assert." + fail.caller.name + ": " + message
    
    if (extraMessage)
        message += " (" + extraMessage + ")"

    var err = new AssertionError({
        message: message,
        stackStartFunction: stack[1].getFunction()
    })

    throw err    
}

function assert(expression)
{
    if (expression) return

    fail()
}

assert.equal = function equal(x, y)
{
    if (x == y) return

    fail(util.format("%s != %s", util.inspect(x), util.inspect(y)))
}

assert.strictEqual = function strictEqual(x, y)
{
    if (x === y) return

    fail(util.format("%s !== %s", util.inspect(x), util.inspect(y)))
}

/**
 * Gets the expression inside the assertion on line number
 * `lineno` of `file`.
 */

function getAssertionExpression(file, lineno)
{
    var ext = path.extname(file)
      , line = null

    switch (ext) {
        case '.coffee':
        case '.litcoffee':
            line = readCoffeeLine(file, lineno)
            break
        default:
            line = readJsLine(file, lineno)
            break
    }

    return line.match(/assert(?:\.\w+)?\s*\((.*)\)/)[1]
}

/**
 * Reads `file` and returns line number `lineno`.
 */

function readJsLine(file, lineno)
{
    var src = fs.readFileSync(file, 'utf8')
    return src.split('\n')[lineno - 1]
}

/**
 * Reads `file`, compiles it as coffee-script, and returns line
 * number `lineno` of the results.
 */

function readCoffeeLine(file, lineno)
{
    var coffee = findCoffee()
      , raw = fs.readFileSync(file, 'utf8')
      , src = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw
      , options = { filename: file }

    if (coffee.helpers.isLiterate) {
        options.literate = coffee.helpers.isLiterate(file)
    }

    var src = coffee.compile(src, options)
    return src.split('\n')[lineno - 1]
}

/**
 * Attempts to find the coffee-script module.
 */

function findCoffee()
{
    try { return require('coffee-script') } catch (e) {}

    var coffeebin = null

    if (isCoffeeBin(process.execPath)) {
        coffeebin = process.execPath
    } else if (isCoffeeBin(require.main.filename)) {
        coffeebin = require.main.filename
    }

    if (coffeebin) {
        return require(path.join(coffeebin, '../..'))
    }

    throw new Exception("coffee-script module not found")
}

/**
 * Returns whether the file at `path` *looks like* it could be
 * the coffee binary.
 */

function isCoffeeBin(path)
{
    return /(\\|\/)coffee$/.test(path)
}
