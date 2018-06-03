'use strict'

const Model = use('Model')

class MonthlyContest extends Model {
    users(){
        return this.belongsToMany('App/Models/User','contest_id','user_id').pivotModel('App/Models/MonthlyParticipation')
    }

    balances(){
        return this.belongsToMany('App/Models/Balance').pivotModel('App/Models/MonthlyPrice')
    }
}

module.exports = MonthlyContest
