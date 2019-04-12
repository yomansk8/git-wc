#!/usr/bin/env node
"use strict";

var _inquirer = _interopRequireDefault(require("inquirer"));

var _util = require("util");

var _child_process = require("child_process");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

const pExec = (0, _util.promisify)(_child_process.exec);
pExec('git fetch -p').then(() => pExec("git branch -vv | grep 'origin/.*: gone]' | awk '{print $1}'")).then(
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* ({
    stdout
  }) {
    const clearable = stdout.split('\n').filter(branch => branch != '');

    if (clearable.length === 0) {
      console.log('👏 Everything is clean here. There is nothing to clean !');
      return;
    }

    const {
      branches
    } = yield _inquirer.default.prompt([{
      type: 'checkbox',
      message: `${clearable.length} branches clearable found. Select the one you want to delete :`,
      name: 'branches',
      choices: clearable.map(el => ({
        name: el,
        checked: true
      }))
    }]);

    if (branches.length === 0) {
      console.log('No branches selected. Nothing has been changed, bye ! 👋');
      return;
    }

    yield pExec(`git branch -D ${branches.join(' ')}`);
    console.log(`🗑 ${clearable.length} branches deleted. Bye ! 👋`);
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}()).catch(error => {
  console.error(error);
});