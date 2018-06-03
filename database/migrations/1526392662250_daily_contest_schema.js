'use strict'

const Schema = use('Schema')

class DailyContestSchema extends Schema {
  up () {
    this.create('daily_contests', (table) => {
      table.increments()
      table.datetime('start')
      table.datetime('end')
      table.boolean('isDone').defaultTo(0)
      table.boolean('isFull').defaultTo(0)
      table.boolean('isValid').defaultTo(1)
      table.integer('maxParticipants').defaultTo(70000)
      table.integer('numParticipants').defaultTo(0)
      table.decimal('priceTicket',17,8).defaultTo(0.00044)
      table.decimal('btc',17,8).defaultTo(0)
      table.integer('numWinners').defaultTo(70)
      table.timestamps()
    })
  }

  down () {
    this.drop('daily_contests')
  }
}

module.exports = DailyContestSchema
