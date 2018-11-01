const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { getDefaultSetup } = require('./logic')

module.exports = {
  makeSetup: async () => {
    const { stdout, stderr } = await exec('firebase setup:web');
    const setup = JSON.parse(stdout.split('(')[1].split(')')[0])
  
    if(stderr) console.log(stderr);
    else console.log(stdout);
    
    return setup
  },
  debug: async (functionName) => {
    const { stdout, stderr }  = await exec(`
      FIREBASE_CONFIG="${JSON.stringify(getDefaultSetup())}" ./node_modules/.bin/functions deploy --trigger-http --timeout 600s ${functionName} && ./node_modules/.bin/functions inspect ${functionName} --port 9229
    `);
    
    if(stderr) console.log(stderr);
    else console.log(stdout);
  }
}