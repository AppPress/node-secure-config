# Node Secure Config

[![Build Status](https://travis-ci.org/AppPress/node-secure-config.png?branch=master)](https://travis-ci.org/AppPress/node-secure-config)

A simple module for loading application configuration settings from JSON files. Default settings are loaded and then merged with environment specific settings. Environment settings override defaults. Settings are stored as JSON as plain text `.json` or encrypted `.store`.

## Example Usage

```javascript
var path = require("path");
var homePath = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
var keyPath = path.join(homePath, ".app-press", "secure-store.pem");

var config = require("secure-config")({
  keyPath: keyPath
});

var cbConn = db.createConnection(confg.db.connectionString, config.db.options, function (err) {
  ...
});
```

## License

View the [LICENSE](https://github.com/AppPress/node-connect-datadog/blob/master/LICENSE) file.
