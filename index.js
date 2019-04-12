#!/usr/bin/env node
import inquirer from 'inquirer'
import { promisify } from 'util'
import { exec } from 'child_process'

const pExec = promisify(exec)

pExec('git fetch -p')
  .then(() => pExec("git branch -vv | grep 'origin/.*: gone]' | awk '{print $1}'"))
  .then(async ({ stdout }) => {
    const clearable = stdout.split('\n').filter(branch => branch != '')
    if (clearable.length === 0) {
      console.log('👏 Everything is clean here. There is nothing to clean !')
      return
    }
    const { branches } = await inquirer.prompt([
      {
        type: 'checkbox',
        message: `${
          clearable.length
        } branches clearable found. Select the one you want to delete :`,
        name: 'branches',
        choices: clearable.map(el => ({ name: el, checked: true })),
      },
    ])
    if (branches.length === 0) {
      console.log('No branches selected. Nothing has been changed, bye ! 👋')
      return
    }
    await pExec(`git branch -D ${branches.join(' ')}`)
    console.log(`🗑 ${clearable.length} branches deleted. Bye ! 👋`)
  })
  .catch(error => {
    console.error(error)
  })
