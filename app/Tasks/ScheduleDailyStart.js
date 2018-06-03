'use strict'

const Task = use('Task')

class ScheduleDailyStart extends Task {
  static get schedule () {
    return '0 0 * * *' //daily
  }


  async handle () {
    var datetime = require('node-datetime')
    var dt = datetime.create();
    var formatted = dt.format('Y-m-d H:M:S');
    const DailyContest = use('App/Models/DailyContest')
    try{
      await DailyContest.create({
        start: formatted
      })
    }catch(error){}
    
  }
}

module.exports = ScheduleDailyStart
