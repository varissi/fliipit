'use strict'

const Schema = use('Schema')

class WeeklyPriceSchema extends Schema {
  up () {
    this.create('weekly_prices', (table) => {
      table.increments()
      table.decimal('btc',17,8).defaultTo(0)
      table.integer('balance_id').unsigned()
      table.integer('contest_id').unsigned()
      table.boolean('paid').defaultTo(0)
      table.timestamps()
    })
  }

  down () {
    this.drop('weekly_prices')
  }
}

module.exports = WeeklyPriceSchema
