'use strict'

const Model = use('Model')

class BtcWallet extends Model {
    user(){
        return this.belongsTo('App/Models/User')
    }

}

module.exports = BtcWallet
