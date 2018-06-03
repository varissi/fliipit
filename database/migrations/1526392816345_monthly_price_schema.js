'use strict'

const Schema = use('Schema')

class MonthlyPriceSchema extends Schema {
  up () {
    this.create('monthly_prices', (table) => {
      table.increments()
      table.decimal('btc',17,8).defaultTo(0)
      table.integer('balance_id').unsigned()
      table.integer('contest_id').unsigned()
      table.boolean('paid').defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('monthly_prices')
  }
}

module.exports = MonthlyPriceSchema
