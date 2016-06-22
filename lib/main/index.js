const launchOptions = {
  htmlPath: `${__dirname}/../..`,
  // openDevTools: true
}
const windowOptions = {
  transparent: true,
  frame: false,
  resizable: true,
  alwaysOnTop: true,
  hasShadow: false
}
const htmlOptions = {
  title: 'quickslot app'
}

let mainWindow

import {
  electron,
  ipcMain,
  app,
  BrowserWindow
} from 'electron'

import fs from 'fs'
const pkgPath = process.argv[2]
let pkgScripts

try {
  if (fs.statSync(pkgPath).isFile()) {
    pkgScripts = require(pkgPath).scripts
  }
} catch (err) {
    return console.log('You must be inside a directory with a package.json file that has scripts')
}

import html from '../html'
import actionsMap from './actions'
const actions = actionsMap(pkgScripts, actionDispatcher)
let runningProcesses = []

ipcMain.on('action-run', (e, actionName) => {
  console.log(`[quickslot] Running script ${actionName}`)
  actions.filter((action) => action.name === actionName)[0].runner()
})
ipcMain.on('action-stop', (e, actionName) => {
  process.kill(
    runningProcesses.filter((action) => action.name === actionName)[0].pid
  );
  console.log(`[quickslot] Killed script ${actionName}`)
})

app
  .on('ready', createWindow)
  .on('window-all-closed', () => process.platform !== 'darwin' && app.quit())
  .on('activate', () => !mainWindow && createWindow())
  .on('before-quit', () => runningProcesses.forEach((actionProcess) => process.kill(actionProcess.pid)))

function actionDispatcher (action) {
  console.log('action dispatched')
  runningProcesses = runningProcesses.concat({ name: action.name, pid: action.process.pid })
  mainWindow.webContents.send('action-running', action.name)
  action.process.on('close', () => {
    runningProcesses = runningProcesses.filter(actionProcess => actionProcess.name !== action.name)
    mainWindow && mainWindow.webContents.send('action-stopped', action.name)
  })
};

function createWindow () {
  windowOptions.width = windowOptions.height = 0;
  mainWindow = new BrowserWindow(windowOptions);

  fs.writeFileSync(`${launchOptions.htmlPath}/index.html`, html(htmlOptions, actions))

  mainWindow.loadURL(`file://${launchOptions.htmlPath}/index.html`)

  launchOptions.openDevTools && mainWindow.webContents.openDevTools()

  bindWindow();
}

function bindWindow () {
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}