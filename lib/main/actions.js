import { scripts as testScripts } from '../../test.json'
import runScript from './runScript'

export default (sourceScripts = testScripts, dispatcher) => (
  Object.keys(sourceScripts)
  .map(scriptName => (
    {
      name: scriptName,
      runner: runScript(scriptName).bind(this, dispatcher)
    })
  )
)