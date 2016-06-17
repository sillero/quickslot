import {
  ipcRenderer,
  remote
} from 'electron'

ipcRenderer.on('action-running', (e, action) => document.forms.actions[action].disabled = true)
ipcRenderer.on('action-stopped', (e, action) => document.forms.actions[action].disabled = false)

setTimeout(() => {
  const buttonsWidth = [].reduce.call(
    document.querySelectorAll('.actions button'),
    (out, btn) => out + btn.offsetWidth + 10,
    0
  );
  remote.BrowserWindow.getAllWindows()[0].setSize(40 + buttonsWidth, 40)
  document.body.classList.add('loaded')
}, 300)

window.run = run

window.addEventListener('keyup', (e) => {
  console.log(`keypress ${e.key}`)

  if (!isNaN(parseInt(e.key, 10))) {
    send(`action${e.key}`);
  }
});


function run (action) {
  console.log(`ipcRenderer send action-run-${action}`)
  ipcRenderer.send('action-run-' + action)

  return false
}