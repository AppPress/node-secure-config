var vows = require("vows");
var assert = require("assert");
var path = require("path");
var fs = require("fs");

var Config = require("../lib");

var basePath = path.join(__dirname, "files");

vows.describe("Secure Config").addBatch({
	"when no config files loaded": {
		topic: new Config({
			keyPath: path.join(basePath, "key.pem")
		}),
		"we only get 1 key": function (config) {
			assert.lengthOf(Object.keys(config), 1);
		},
		"we get an env key": function (config) {
			assert.equal(config.env, process.env.NODE_ENV || "development");
		}
	},
	"with config": {
		topic: new Config({
			env: "production",
			basePath: path.join(basePath, "config"),
			keyPath: path.join(basePath, "key.pem")
		}),
		"defaults values are used when not overridden": function (config) {
			assert.equal(config.noOverride, "original value");
		},
		"environment values override defaults": function (config) {
			assert.equal(config.override, "overridden value from env config");
		},
		"environment values don't need to be in defaults": function (config) {
			assert.equal(config.noDefault, "original value from env config");
		},
		"default secure values override default values": function (config) {
			assert.equal(config.overrideSecure, "overriden secure value");
		},
		"secure values don't need to be in defaults": function (config) {
			assert.equal(config.noOverrideDefaultSecure, "original secure value");
		},
		"secure env values don't need to be in any other file": function (config) {
			assert.equal(config.noOverrideEnvSecure, "original secure value");
		},
		"secure env values override all other values": function (config) {
			assert.equal(config.overrideEnvSecure, "overriden secure value");
		}
	}
}).export(module);
