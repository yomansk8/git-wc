#!/usr/bin/env node
"use strict";

var _inquirer = _interopRequireDefault(require("inquirer"));

var _util = require("util");

var _child_process = require("child_process");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pExec = (0, _util.promisify)(_child_process.exec);
pExec("git branch -vv | grep 'origin/.*: gone]' | awk '{print $1}'").then(function (_ref) {
  var stdout = _ref.stdout;
  var clearable = stdout.split("\n").filter(function (branch) {
    return branch != "";
  });

  if (clearable.length === 0) {
    console.log("👏 Everything is clean here. There is nothing to clean !");
  } else {
    _inquirer.default.prompt([{
      type: "checkbox",
      message: "".concat(clearable.length, " branches clearable found. Select the one you want to delete :"),
      name: "branches",
      choices: clearable.map(function (el) {
        return {
          name: el,
          checked: true
        };
      })
    }]).then(function (_ref2) {
      var branches = _ref2.branches;

      if (branches.length === 0) {
        console.log("No branches selected. Nothing has been changed, bye ! 👋");
      }

      pExec("git branch -D ".concat(branches.join(" "))).then(function () {
        console.log("\uD83D\uDDD1 ".concat(clearable.length, " branches deleted. Bye ! \uD83D\uDC4B"));
      });
    });
  }
});