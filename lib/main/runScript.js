import { spawn } from 'child_process'

export default (scriptName) => {
  // ipcMain listener
  return (dispatcher) => (event, arg) =>
    dispatcher({
      name: scriptName,
      process: spawn(
        'npm', ['run', scriptName],
        { cwd: process.cwd(), stdio: 'inherit' }
      )
    })
}