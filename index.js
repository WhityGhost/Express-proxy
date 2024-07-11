const express = require("express");
const proxy = require("express-http-proxy");
const https = require("https");
const fs = require("fs");

const key = fs.readFileSync("./rootSSL.dec.key");
const cert = fs.readFileSync("./rootSSL.pem");

app = express();

const ALLOWED_CONTENT_TYPE = [
  "application/javascript",
  "text/plain",
  "text/html",
  "text/css",
  "text/javascript",
  "text/csv",
  "application/json",
  "application/xml",
  "application/x-www-form-urlencoded",
  "application/javascript",
  "application/vnd.api+json",
  "application/graphql",
];

const loadConfig = () => {
  var config;
  configLocations.some(function (location) {
    if (fs.existsSync(location)) {
      config = JSON.parse(fs.readFileSync(location, "utf-8"));
      return true;
    }
  });
  if (!config) {
    console.error("Failed to load config");
    process.exit(1);
  }
  return config;
};

const reloadConfig = () => {
  config = loadConfig();
};

const getConfig = () => {
  return config;
};

const isAllowedType = (current_type) => {
  ALLOWED_CONTENT_TYPE.forEach((type) => {
    if (current_type.startsWith(type)) return true;
  });
  return false;
};

var configLocations = ["./.proxyrc.json", process.env.HOME + "/.proxyrc.json"];
var config = loadConfig();

app.use(
  "/",
  proxy(`https://${config.targetHost}/`, {
    proxyReqPathResolver: function (req, res) {
      return require("url").parse(req.url).path;
    },
    // proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    //   // proxyReqOpts.headers;
    //   return proxyReqOpts;
    // },
    userResHeaderDecorator(headers, _userReq, _userRes, _proxyReq, _proxyRes) {
      if (headers.location) {
        headers.location = headers.location.replaceAll(
          config.targetHost,
          config.host
        );
      }
      if (
        headers["set-cookie"] &&
        config.cookieReplacer &&
        config.cookieReplacer.length
      ) {
        for (let i = 0; i < headers["set-cookie"].length; i++) {
          let cookie = headers["set-cookie"][i];
          config.cookieReplacer.forEach((replacer) => {
            cookie = cookie.replace(replacer.from, replacer.to);
          });
          headers["set-cookie"][i] = cookie;
        }
        console.log(headers["set-cookie"]);
      }
      return headers;
    },
    userResDecorator: function (proxyRes, proxyResData, _userReq, _userRes) {
      if (isAllowedType(proxyRes.headers["content-type"])) {
        return proxyResData
          .toString("utf8")
          .replaceAll(config.targetHost, config.host);
      } else return proxyResData;
    },
  })
);

const server = https.createServer({ key: key, cert: cert }, app);
server.listen(config.port, () => {
  console.log(`Proxy server listening on ${config.port}`);
});
