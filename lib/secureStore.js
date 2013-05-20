var fs = require("fs");
var path = require("path");
var ursa = require("ursa");

var SecureStore = module.exports = function (options) {
	options = (typeof(options) == "object") && options || {};

	this.basePath = options.basePath;
	var keyPath = options.keyPath;

	// check for key
	if (!fs.existsSync(keyPath)) {
		// key not found throw an error
		throw new Error("Missing .pem at " + keyPath);
	}

	// load the key
	this.key = ursa.createPrivateKey(
		fs.readFileSync(keyPath)
	);
};

SecureStore.GenerateKey = function (keyPath, size) {
	size = size || 8;

	var key = ursa.generatePrivateKey(1024 * size);

	fs.writeFileSync(keyPath, key.toPrivatePem(), "utf8");
};

SecureStore.prototype.encrypt = function (storeName) {
	var filePath = path.join(this.basePath, storeName + ".json");

	if (!fs.existsSync(filePath)) {
		throw new Error("JSON file not found");
	}

	var data = fs.readFileSync(filePath).toString();

	var out = this.key.encrypt(data, "utf8");

	fs.writeFileSync(
		path.join(this.basePath, storeName + ".store"),
		out, "utf8"
	);

	return out;
};

SecureStore.prototype.decrypt = function (storeName) {
	var filePath = path.join(this.basePath, storeName + ".store");

	if (!fs.existsSync(filePath)) {
		throw new Error("Encrypted JSON file not found at " + filePath + ".");
	}

	var data = fs.readFileSync(filePath);

	var out = this.key.decrypt(data, undefined, "utf8");

	out = JSON.parse(out);

	return out;
};
