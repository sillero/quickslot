import { scripts as testScripts } from '../../test.json'
import runScript from './runScript'

export default (sourceScripts = testScripts) => (
  Object.keys(sourceScripts)
  .map(scriptName => (
    {
      name: scriptName,
      runner: runScript(scriptName)
    })
  )
)