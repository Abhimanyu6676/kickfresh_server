const express = require("express");
const { keystone, apps } = require("./index.js");

keystone
  .prepare({
    apps: apps,
    dev: process.env.NODE_ENV !== "production"
  })
  .then(async ({ middlewares }) => {
    await keystone.connect();
    const app = express();

    /* app.use("/test", function(req, res) {
      res.send("Hello World");
    }); */

    //NOTE: http redirect
    /* app.use(function(req, res, next) {
      if (req.protocol === "http") {
        console.log("redirect http");
        res.redirect(301, `https://${req.headers.host}${req.url}`);
        next();
      }
    }); */
    app.use(middlewares).listen(3000);
  });
