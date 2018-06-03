'use strict'

const Model = use('Model')

class WeeklyContest extends Model {
    users(){
        return this.belongsToMany('App/Models/User','contest_id','user_id').pivotModel('App/Models/WeeklyParticipation')
    }

    balances(){
        return this.belongsToMany('App/Models/Balance').pivotModel('App/Models/WeeklyPrice')
    }
}

module.exports = WeeklyContest
