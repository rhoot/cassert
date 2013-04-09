var callsite = require('callsite')
  , fs = require('fs')
  , path = require('path')
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

function assert(expression)
{
    if (expression) return

    var stack = callsite()
      , file = stack[1].getFileName()
      , line = stack[1].getLineNumber()

    var err = new AssertionError({
        message: getAssertionExpression(file, line),
        stackStartFunction: stack[0].getFunction()
    })

    throw err
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

    return line.match(/assert\s*\((.*)\)/)[1]
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
    try { require('coffee-script') } catch (e) {}

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
