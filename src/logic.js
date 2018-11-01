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
      return document
    })
  })
}

function setDefaultProject(project) {
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

function getDefaultProject(project) {
  return new Promise((res, rej) => {
    db.findOne({
      project: project
    }, (err, document) => {
      assert.equal(err, null)
      return document
    })
  })
}
module.exports = {addSetup, getSetup, setDefaultProject, getDefaultProject}