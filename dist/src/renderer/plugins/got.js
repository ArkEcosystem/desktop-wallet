"use strict";
/* eslint-disable @typescript-eslint/no-var-requires */
var got = require('got/source/index');
var request = require('stream-http').request;
var client = got.extend({ request: request });
module.exports = client;
//# sourceMappingURL=got.js.map