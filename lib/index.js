var fs = require("fs");
var path = require("path");

var SecureStore = require("../lib/secureStore");


module.exports = function (options) {
	options = options || {};
	var env = options.env || process.env.NODE_ENV || "development";
	var basePath = options.basePath || path.join(__dirname, "..", "config");
	var configPath = options.configPath || path.join(basePath, "settings");
	var securePath = options.securePath || path.join(basePath, "secure");
	var keyPath = options.keyPath || path.join(securePath, "key.pem");

	var secureStore = new SecureStore({
		basePath: securePath,
		keyPath: keyPath
	});

	var config = {env: env};

	var extend = function(dest, src) {
		for (var key in src) {
			if (typeof src[key] === "object") {
				dest[key] = dest[key] || {};
				extend(dest[key], src[key]);
			} else {
				dest[key] = src[key];
			}
		}

		return dest;
	};

	var extendSecureConfig = function (name) {
		try {
			var json = secureStore.decrypt(name);

			extend(config, json);
		} catch (err) {
		}
	};

	var extendConfig = function (name) {
		try {
			var json = fs.readFileSync(
				path.join(configPath, name + ".json")
			).toString();

			extend(config, JSON.parse(json));
		} catch (err) {
		}
	};

	extendConfig("defaults");
	extendSecureConfig("defaults");
	extendConfig(env);
	extendSecureConfig(env);

	return config;
};
