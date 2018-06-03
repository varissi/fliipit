'use strict'

const Model = use('Model')

class DailyContest extends Model {
    users(){
        return this.belongsToMany('App/Models/User','contest_id','user_id').pivotModel('App/Models/DailyParticipation')
    }

    balances(){
        return this.belongsToMany('App/Models/Balance').pivotModel('App/Models/DailyPrice')
    }
}

module.exports = DailyContest
