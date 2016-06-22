import {
  ipcRenderer,
  remote
} from 'electron'
const actionQueue = {};

ipcRenderer.on('action-running', (e, action) => {
  actionQueue[action] = true
  document.forms.actions[action].classList.add('running')
})
ipcRenderer.on('action-stopped', (e, action) => {
  actionQueue[action] = false
  document.forms.actions[action].classList.remove('running')
})

setTimeout(() => {
  const buttonsWidth = [].reduce.call(
    document.querySelectorAll('.actions button'),
    (out, btn) => out + btn.offsetWidth + 12,
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
  let actionType = 'run';

  if (actionQueue[action]) {
    actionType = 'stop'
  }

  console.log(`ipcRenderer send action-${actionType} ${action}`)
  ipcRenderer.send(`action-${actionType}`, action)
}