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
    const cmd = `
    FIREBASE_CONFIG="${JSON.stringify(JSON.stringify(await getDefaultSetup()))}" ./node_modules/.bin/functions deploy --trigger-http --timeout 600s ${functionName} && ./node_modules/.bin/functions inspect ${functionName} --port 9229
    `
    console.log({cmd})
    const { stdout, stderr }  = await exec(cmd)
    
    if(stderr) console.log(stderr);
    else console.log(stdout);
  },
  start: async () => {
    const { stdout, stderr }  = await exec(`
      ./node_modules/.bin/functions start
    `)

    if(stderr) console.log(stderr);
    else console.log(stdout);
  }
}