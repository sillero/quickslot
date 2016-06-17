#!/usr/bin/env node

const spawn = require('child_process').spawn
const dir = __dirname + '/../'

spawn(dir + '/node_modules/.bin/electron', [dir + '/lib/entryMain.js', process.cwd() + '/package.json'], { stdio: 'inherit' })