#!/usr/bin/env node
import inquirer from "inquirer";
import { promisify } from "util";
import { exec } from "child_process";

const pExec = promisify(exec);

pExec("git branch -vv | grep 'origin/.*: gone]' | awk '{print $1}'").then(
  ({ stdout }) => {
    const clearable = stdout.split("\n").filter(branch => branch != "");
    if (clearable.length === 0) {
      console.log("👏 Everything is clean here. There is nothing to clean !");
    } else {
      inquirer
        .prompt([
          {
            type: "checkbox",
            message: `${
              clearable.length
            } branches clearable found. Select the one you want to delete :`,
            name: "branches",
            choices: clearable.map(el => ({ name: el, checked: true }))
          }
        ])
        .then(({ branches }) => {
          if (branches.length === 0) {
            console.log(
              "No branches selected. Nothing has been changed, bye ! 👋"
            );
          }
          pExec(`git branch -D ${branches.join(" ")}`).then(() => {
            console.log(`🗑 ${clearable.length} branches deleted. Bye ! 👋`);
          });
        });
    }
  }
);
