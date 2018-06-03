'use strict'

const Task = use('Task')

class ScheduleMonthlyStart extends Task {
  static get schedule () {
    return '0 19 1 * *' // every month
  }

  async handle () {
    var datetime = require('node-datetime')
    var dt = datetime.create();
    var formatted = dt.format('Y-m-d H:M:S');
    const MonthlyContest = use('App/Models/MonthlyContest')
    try{
      await MonthlyContest.create({
        start: formatted
      })
    }catch(error){}
  }
}

module.exports = ScheduleMonthlyStart
