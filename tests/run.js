'use strict'

let child_process = require('child_process');

setTimeout(() => child_process.fork('./tests/other.js'), 100);
setTimeout(() => child_process.fork('./tests/index.js'), 200);
