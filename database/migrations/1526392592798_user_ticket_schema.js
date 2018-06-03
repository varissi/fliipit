'use strict'

const Schema = use('Schema')

class UserTicketSchema extends Schema {
  up () {
    this.create('user_tickets', (table) => {
      table.increments()
      table.integer('daily').defaultTo(0)
      table.integer('weekly').defaultTo(0)
      table.integer('monthly').defaultTo(0)
      table.integer('user_id').unsigned().index('user_id').unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('user_tickets')
  }
}

module.exports = UserTicketSchema
