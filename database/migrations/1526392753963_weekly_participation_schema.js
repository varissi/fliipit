'use strict'

const Schema = use('Schema')

class WeeklyParticipationSchema extends Schema {
  up () {
    this.create('weekly_participations', (table) => {
      table.increments()
      table.boolean('isWinner').defaultTo(0)
      table.decimal('btc',17,8).defaultTo(0)
      table.integer('user_id').unsigned()
      table.integer('contest_id').unsigned()
      table.timestamps()
    })
  }

  down () {
    this.drop('weekly_participations')
  }
}

module.exports = WeeklyParticipationSchema
