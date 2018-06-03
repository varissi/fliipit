'use strict'

const Schema = use('Schema')

class BtcWalletSchema extends Schema {
  up () {
    this.create('btc_wallets', (table) => {
      table.increments()
      table.string('adress')
      table.string('privateKey')
      table.decimal('btc',17,8).defaultTo(0)
      table.integer('user_id').unsigned().index('user_id').unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('btc_wallets')
  }
}

module.exports = BtcWalletSchema
