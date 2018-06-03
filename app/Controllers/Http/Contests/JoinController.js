'use strict'
const UserTicket = use('App/Models/UserTicket')
class JoinController {

    async process({request,response,session,auth}){
        const {contestType,contest_id} = request.all()
        var ContestClass
        var Participation
        if(contestType == 1){
            Participation = use('App/Models/DailyParticipation')
            ContestClass = use('App/Models/DailyContest')
        }else if(contestType == 2){
            Participation = use('App/Models/WeeklyParticipation')
            ContestClass = use('App/Models/WeeklyContest')
        }else if(contestType == 3){
            Participation = use('App/Models/MonthlyParticipation')
            ContestClass = use('App/Models/MonthlyContest')
        }

        const contest = await ContestClass.query().where('id',contest_id).first()

        if(contest.numParticipants >= contest.maxParticipants){
            contest.isFull = true
            await contest.save()
            session.flash({
                notification:{
                    type:'warning',
                    message:'This contest is full. Please wait for the next one.'
                }
            }) 
            return response.redirect('back')
        }
            const participation = await Participation.query().where('contest_id', contest_id ).where('user_id',auth.user.id).getCount()
            if(participation > 0){
                session.flash({
                    notification:{
                        type:'warning',
                        message:'You are already participating.'
                    }
                }) 
                return response.redirect('back')
            }
            const userTicket = await auth.user.userTicket().fetch()
            var poolAmount
            if(contestType == 1){
                poolAmount = 0.00095
                userTicket.daily = userTicket.daily - 1
                await userTicket.save()
            }else if(contestType == 2){
                poolAmount = 0.00063
                userTicket.weekly = userTicket.weekly - 1
                await userTicket.save()
            }else if(contestType == 3){
                poolAmount = 0.00021
                userTicket.monthly = userTicket.monthly - 1
                await userTicket.save()
            }

            await Participation.create({
                user_id:auth.user.id,
                contest_id: contest_id
            })

            contest.numParticipants = contest.numParticipants + 1
            contest.btc = contest.btc + poolAmount
            await contest.save()
            return response.redirect('back')
    }
}

module.exports = JoinController
