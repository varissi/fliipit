'use strict'

const Task = use('Task')
const UserTicket =  use('App/Models/UserTicket')
const WeeklyParticipation =  use('App/Models/WeeklyParticipation')
const WeeklyPrice =  use('App/Models/WeeklyPrice')
const Balance =  use('App/Models/Balance')

class ScheduleWeeklyEnd extends Task {
  static get schedule () {
    return '0 12 * * FRI' //Weekly
  }

  async handle () {
    var datetime = require('node-datetime')
    var dt = datetime.create();
    var formatted = dt.format('Y-m-d H:M:S');
    const WeeklyContest = use('App/Models/WeeklyContest')
    try{
      const currentContest = await WeeklyContest.query().orderBy('id', 'desc').first()
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
          userTicket.weekly = userTicket.weekly +1
          await userTicket.save()
        } 
      }else{
        var win = currentContest.btc/currentContest.numWinners
        var weeklyParticipation = await WeeklyParticipation.query().where('contest_id',currentContest.id).orderByRaw('RAND()').limit(currentContest.numWinners)
        var weeklyParticipationArray = JSON.parse(JSON.stringify(weeklyParticipation))
        for(var i=0;i<weeklyParticipationArray.length;i++){
          var balance = await Balance.query().where('user_id',weeklyParticipationArray[i].user_id).first()
          await WeeklyParticipation.query().where('user_id',weeklyParticipationArray[i].user_id).update({isWinner:1,btc:win})
          await WeeklyPrice.create({
            contest_id:currentContest.id,
            balance_id: balance.id,
            btc: win
          })
        }
     }
    }catch(error){}
  }
}

module.exports = ScheduleWeeklyEnd
