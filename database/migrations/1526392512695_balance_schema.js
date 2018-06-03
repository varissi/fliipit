'use strict'

const Schema = use('Schema')

class BalanceSchema extends Schema {
  up () {
    this.create('balances', (table) => {
      table.increments()
      table.decimal('btc',17,8).defaultTo(0)
      table.integer('user_id').unsigned().index('user_id').unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('balances')
  }
}

module.exports = BalanceSchema
