
# cassert

C-style assertions for javascript and coffee-script, running in node.js.
Extracts assertion failure messages from the expressions themselves. Based on
[better-assert](https://github.com/visionmedia/better-assert).

## Installation

    npm install cassert

## Usage

Require the module and use it as an assert function, [just as you would in C](http://www.cplusplus.com/reference/cassert/assert/). As long as the NODE_ENV
environment variable is not set to `production`, cassert will perform the
check. Note that for coffee-script, the assert failure message will show the
compiled javascript expression.

**Important:** The assert function must be invoked as `assert(expression)`,
`cassert(expression)`, or similar name ending on `assert`.

## Javascript Example

```js
var assert = require('cassert');

function foo(bar) {
    assert(typeof bar === 'number');
    assert(bar > 10);
}

foo(5);
```

```
AssertionError: bar > 10
    at foo (d:\git\cassert\test.js:5:5)
    at Object.<anonymous> (d:\git\cassert\test.js:8:1)
    at Module._compile (module.js:449:26)
    at Object.Module._extensions..js (module.js:467:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:312:12)
    at Module.runMain (module.js:492:10)
    at process.startup.processNextTick.process._tickCallback (node.js:244:9)
```

## CoffeeScript Example

```coffee
assert = require 'cassert'

foo = (bar) ->
    assert typeof bar is 'number'
    assert bar > 10

foo 5
```

```
AssertionError: bar > 10
    at foo (d:\git\cassert\test.coffee:8:12)
    at Object.<anonymous> (d:\git\cassert\test.coffee:11:3)
    at Object.<anonymous> (d:\git\cassert\test.coffee:13:4)
    at Module._compile (module.js:449:26)
    at Object.exports.run (c:\Users\Johan\AppData\Roaming\npm\node_modules\coffee-script\lib\coffee-script\coffee-script.js:83:25)
    at compileScript (c:\Users\Johan\AppData\Roaming\npm\node_modules\coffee-script\lib\coffee-script\command.js:177:29)
    at fs.stat.notSources.(anonymous function) (c:\Users\Johan\AppData\Roaming\npm\node_modules\coffee-script\lib\coffee-script\command.js:152:18)
    at fs.readFile (fs.js:176:14)
    at Object.oncomplete (fs.js:297:15)
```

## License (BSD)

Copyright (c) 2013, Johan Sköld &lt;johan@skold.cc&gt;  
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this
list of conditions and the following disclaimer in the documentation and/or
other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.