'use strict'

const Model = use('Model')

class Balance extends Model {
    user(){
        return this.belongsTo('App/Models/User')
    }

    dailyContests(){
        return this.belongsToMany('App/Models/DailyContest').pivotModel('App/Models/DailyPrices')
      }

    weeklyContests(){
    return this.belongsToMany('App/Models/WeeklyContest').pivotModel('App/Models/WeeklyPrices')
    }

    monthlyContests(){
        return this.belongsToMany('App/Models/MonthlyContest').pivotModel('App/Models/MonthlyPrices')
      }
}

module.exports = Balance
