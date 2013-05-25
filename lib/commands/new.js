var fs = require('../util/fs-promised');
var rsvp = require('rsvp-that-works');
var message = require('../util/message');
var appDirs = require('../util/appDirs');
var template = require('../util/template');
var root = '.';

module.exports = function(path, env) {
  message.notify("-> Creating RESTful files and directories");

  var env = arguments[arguments.length - 1];
  root = arguments.length > 1 ? path : root;

  files = [
    'app.js',
    'package.json',
    'Jakefile.js',
    'README.md',
    'views/layout.jade',
    'views/restError/500.jade',
    'views/restError/restError.jade',
  ];

  return makeRootDirectory().
    then(mkdirs).
    then(createFiles);
};

function makeRootDirectory() {
  return mkdirUnlessExists(root);
}

function mkdirs() {
  return rsvp.all(appDirs.map(mkdir));
}

function mkdir(path) {
  return mkdirUnlessExists(rootify(path));
}

function createFiles() {
  return rsvp.all(files.map(createFile));
}

function createFile(name) {
  var path = rootify(name);
  return template.write('create/' + name, path, {appName: root});
}

function rootify(path) {
  return root + '/' + path;
}

function error(err) {
  throw new Error(err);
}

function mkdirUnlessExists(path) {
  return fs.exists(path).then(function(exists) {
    if (exists) {
      message.fileExists(path);
      return exists;
    } else {
      message.fileCreated(path);
      return fs.mkdir(path);
    }
  });
}
