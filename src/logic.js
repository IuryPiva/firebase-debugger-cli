const path = require('path');
const dbPath = path.join(__dirname, 'my.db');

const assert = require('assert')

const Datastore = require('nedb'),
  db = new Datastore({
    filename: dbPath,
    autoload: true
  });

function addSetup(project, setup) {
  db.findOne({ project }, (err, document) => {
    console.log({ project, setup });
    if (!document) db.insert({ project, setup })
    else db.update({ project }, { $set: { setup } })
  })
}

function getSetup(project) {
  return new Promise((res, rej) => {
    db.findOne({
      project: project
    }, (err, document) => {
      assert.equal(err, null)
      console.log(document);
      res(document)
    })
  })
}

function setDefaultProject(project) {
  console.log(project);
  getSetup(project).then((res) => {
    if(res != null) {
      db.findOne({
        settings: 'default'
      }, (err, document) => {
        if (!document) db.insert({ settings: 'default', defaultProject: project })
        else db.update({ settings: 'default' }, { $set: { defaultProject: project } })
      })
    } else {
      console.log('This project has not yet been configured.')
    }
  })
}

function getDefaultProject() {
  return new Promise((res, rej) => {
    db.findOne({
      settings: 'default'
    }, (err, document) => {
      assert.equal(err, null)
      if(document == null) {
        console.log('No project is set as default')
        return rej()
      }
      res(document.defaultProject)
    })
  })
}

async function getDefaultSetup() {
  const project = await getDefaultProject()
  
  return new Promise((res, rej) => {
    db.findOne({
      project
    }, (err, document) => {
      assert.equal(err, null)
      res(document.setup)
    })
  })
}

module.exports = {addSetup, getSetup, setDefaultProject, getDefaultProject, getDefaultSetup}