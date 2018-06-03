'use strict'

class Authenticated {
  async handle ({ request,auth }, next) {
    try{
      await auth.check()
    }catch(error){
      await next()
    }
  }
}

module.exports = Authenticated
