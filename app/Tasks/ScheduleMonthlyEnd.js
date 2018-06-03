'use strict'

const Task = use('Task')
const UserTicket =  use('App/Models/UserTicket')
const MonthlyParticipation =  use('App/Models/MonthlyParticipation')
const MonthlyPrice =  use('App/Models/MonthlyPrice')
const Balance =  use('App/Models/Balance')

class ScheduleMonthlyEnd extends Task {
  static get schedule () {
    return '0 19 28 * *' // every month
  }

  async handle () {
    var datetime = require('node-datetime')
    var dt = datetime.create();
    var formatted = dt.format('Y-m-d H:M:S');
    const MonthlyContest = use('App/Models/MonthlyContest')
    try{
      const currentContest = await MonthlyContest.query().orderBy('id', 'desc').first()
      currentContest.isDone = 1
      currentContest.end =  formatted
      await currentContest.save()
      var minParticipants = currentContest.numWinners*3
      if(currentContest.numParticipants < minParticipants){
        currentContest.isValid = 0
        await currentContest.save()
        var users = await currentContest.users().fetch()
        var usersJSON = users.toJSON()
        usersJSON = JSON.stringify(usersJSON)
        var usersArray = JSON.parse(usersJSON)
        for(var i =0;i<usersArray.length;i++){
          var user = usersArray[i]
          var userTicket = await UserTicket.query().where('user_id',user.id).first()
          userTicket.monthly = userTicket.monthly +1
          await userTicket.save()
        }
      }else{
        var win = currentContest.btc/currentContest.numWinners
        var monthlyParticipation = await MonthlyParticipation.query().where('contest_id',currentContest.id).orderByRaw('RAND()').limit(currentContest.numWinners)
        var monthlyParticipationArray = JSON.parse(JSON.stringify(monthlyParticipation))
        for(var i=0;i<monthlyParticipationArray.length;i++){
          var balance = await Balance.query().where('user_id',monthlyParticipationArray[i].user_id).first()
          await MonthlyParticipation.query().where('user_id',monthlyParticipationArray[i].user_id).update({isWinner:1,btc:win})
          await MonthlyPrice.create({
            contest_id:currentContest.id,
            balance_id: balance.id,
            btc: win
          })
        }
      }
    }catch(error){}
  }
}

module.exports = ScheduleMonthlyEnd
