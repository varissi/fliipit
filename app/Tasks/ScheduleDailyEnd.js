'use strict'

const Task = use('Task')
const UserTicket =  use('App/Models/UserTicket')
const DailyParticipation =  use('App/Models/DailyParticipation')
const DailyPrice =  use('App/Models/DailyPrice')
const Balance =  use('App/Models/Balance')

class ScheduleDailyEnd extends Task {
  static get schedule () {
    return '0 22 * * *' //daily
  }


  async handle () {
    var datetime = require('node-datetime')
    var dt = datetime.create();
    var formatted = dt.format('Y-m-d H:M:S');
    const DailyContest = use('App/Models/DailyContest')
    try{
      const currentContest = await DailyContest.query().orderBy('id', 'desc').first()
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
          userTicket.daily = userTicket.daily +1
          await userTicket.save()
        }  
      }else{
        var win = currentContest.btc/currentContest.numWinners
        var dailyParticipation = await DailyParticipation.query().where('contest_id',currentContest.id).orderByRaw('RAND()').limit(currentContest.numWinners)
        var dailyParticipationArray = JSON.parse(JSON.stringify(dailyParticipation))
        for(var i=0;i<dailyParticipationArray.length;i++){
          var balance = await Balance.query().where('user_id',dailyParticipationArray[i].user_id).first()
          await DailyParticipation.query().where('user_id',dailyParticipationArray[i].user_id).update({isWinner:1,btc:win})
          await DailyPrice.create({
            contest_id:currentContest.id,
            balance_id: balance.id,
            btc: win
          })
        }
      }
    }catch(error){}
    
  }
}

module.exports = ScheduleDailyEnd
