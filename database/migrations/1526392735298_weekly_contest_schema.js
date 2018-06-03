'use strict'

const Schema = use('Schema')

class WeeklyContestSchema extends Schema {
  up () {
    this.create('weekly_contests', (table) => {
      table.increments()
      table.datetime('start')
      table.datetime('end')
      table.boolean('isDone').defaultTo(0)
      table.boolean('isFull').defaultTo(0)
      table.boolean('isValid').defaultTo(1)
      table.integer('maxParticipants').defaultTo(500000)
      table.integer('numParticipants').defaultTo(0)
      table.decimal('priceTicket',17,8).defaultTo(0.00077)
      table.decimal('btc',17,8).defaultTo(0)
      table.integer('numWinners').defaultTo(200)
      table.timestamps()
    })
  }

  down () {
    this.drop('weekly_contests')
  }
}

module.exports = WeeklyContestSchema
