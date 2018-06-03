'use strict'

const Task = use('Task')

class ScheduleWeeklyStart extends Task {
  static get schedule () {
    return '0 12 * * SUN' //Weekly
  }

  async handle () {
    var datetime = require('node-datetime')
    var dt = datetime.create();
    var formatted = dt.format('Y-m-d H:M:S');
    const WeeklyContest = use('App/Models/WeeklyContest')
    try{
      await WeeklyContest.create({
        start: formatted
      })
    }catch(error){}
  }
}

module.exports = ScheduleWeeklyStart
