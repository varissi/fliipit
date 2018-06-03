'use strict'

const Schema = use('Schema')

class StructSchema extends Schema {
  up () {
    this.create('structs', (table) => {
      table.increments()
      table.string('ya',256)//yom
      table.string('tya',256)
      table.string('sa',256)//sbo3
      table.string('tsa',256)
      table.string('ca',256)//chhar
      table.string('tca',256)
      table.string('ha',256)//7asal
      table.string('tha',256)
      table.string('ra',256)//reb7
      table.string('tra',256)
      table.string('th',256)

      table.text('y')//yom
      table.text('ty')
      table.text('s')//sbo3
      table.text('ts')
      table.text('c')//chhar
      table.text('tc')
      table.text('h')
    })
  }

  down () {
    this.drop('structs')
  }
}

module.exports = StructSchema
