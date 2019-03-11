// Polyfills necessary for test environment
require("@babel/polyfill");

global.fetch = require("jest-fetch-mock");

const nodeFetch = require("node-fetch");
global.Headers = nodeFetch.Headers;
