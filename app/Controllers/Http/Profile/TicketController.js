'use strict'

class TicketController {
    async show({view,auth,request}){
        const tickets = {}
        const data = {
            tickets,
            contest: request.input('contest')
        }
        return view.render('users/profile/tickets',data)
    }
}

module.exports = TicketController
