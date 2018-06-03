'use strict'

const Model = use('Model')

class UserTicket extends Model {
    user(){
        return this.belongsTo('App/Models/User')
    }
}

module.exports = UserTicket
