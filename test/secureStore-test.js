var vows = require("vows");
var assert = require("assert");
var path = require("path");
var fs = require("fs");

var SecureStore = require("../lib/secureStore");

var basePath = path.join(__dirname, "files");

var keyPaths = {
	missing: path.join(basePath, "not-a-real-key.pem"),
	generate: path.join(basePath, "key1.pem"),
	key: path.join(basePath, "key.pem")
};

var missingStore = "missing";
var sampleJSONpath = path.join(basePath, "sample.json");
var sampleStorePath = sampleJSONpath.replace(".json", ".store");

vows.describe("Secure Store").addBatch({
	"without a key": {
		topic: SecureStore,
		"we throw an error": function () {
			assert.throws(function (Store) {
				var store = new Store({keyPath: keyPaths.missing});
			}, Error, "Missing .pem");
		}
	},
	"when we GenerateKey": {
		topic: SecureStore.GenerateKey(keyPaths.generate, 1),
		"we make a .pem file": function (key) {
			assert.isTrue(fs.existsSync(keyPaths.generate));
		},
		teardown: function () {
			fs.unlinkSync(keyPaths.generate);
		}
	},
	"with a key": {
		topic: new SecureStore({basePath: basePath, keyPath: keyPaths.key}),
		"we return an instance of SecureStore": function (store) {
			assert.instanceOf(store, SecureStore);
		},
		"when we encrypt a missing file we throw an error": function (store) {
			assert.throws(function () {
				store.encrypt(missingStore);
			}, Error, "JSON file not found");
		},
		"when we decrypt a missing file we throw an error": function (store) {
			assert.throws(function () {
				store.encrypt(missingStore);
			}, Error, "Encrypted JSON file not found");
		},
		"when we encrypt a json file": {
			topic: function (store) {
				return store.encrypt("sample");
			},
			"we make a .store file": function () {
				assert.isTrue(fs.existsSync(sampleStorePath));
			},
			"we return the encrypted data as a Buffer": function (data) {
				assert.instanceOf(data, Buffer);
			},
			"and when we can decrypt it": {
				topic: function (data, store) {
					return store.decrypt("sample");
				},
				"we get an object": function (object) {
					assert.instanceOf(object, Object);
				},
				"that is equal to the origianl": function (object) {
					var decryptedJson = JSON.stringify(object);

					var origianl = fs.readFileSync(sampleJSONpath).toString();

					// parse and stringify to remove formatting
					origianl = JSON.stringify(JSON.parse(origianl));

					assert.equal(origianl, decryptedJson);
				}
			},
			teardown: function () {
				fs.unlinkSync(sampleStorePath);
			}
		}
	}
}).export(module);
