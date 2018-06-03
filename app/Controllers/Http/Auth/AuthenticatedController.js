'use strict'

class AuthenticatedController {

    async logout({auth,response}){
        await auth.logout()
        return response.route('loginForm')
    }
}

module.exports = AuthenticatedController
