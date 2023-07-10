const path = require("path");
const express = require("express");
const livereload = require("livereload");
const connect = require("connect-livereload");
const server = livereload.createServer();

server.watch(path.join(__dirname, "public"));

const app = express();
app.use(connect());
app.use("/", express.static("public"));

app.listen(8083, () => console.log("Express is listening.."));
