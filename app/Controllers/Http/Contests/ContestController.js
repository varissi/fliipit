'use strict'

const crypto = require('crypto')

class ContestController {
    async daily({view,auth,params,response}){
        this.contestType = 1
        return await this.show(view,auth,params,response)
    }

    async weekly({view,auth,params,response}){
        this.contestType = 2
        return await this.show(view,auth,params,response)
    }

    async monthly({view,auth,params,response}){
        this.contestType = 3
        return await this.show(view,auth,params,response)
    }

    async show(view,auth,params,response){
        var redirect
        var ContestClass
        var Participation = 0
        var numTickets = 0
        var dateEnd

        if(this.contestType == 1){
            redirect = '/daily'
            ContestClass = use('App/Models/DailyContest')
            Participation = use('App/Models/DailyParticipation')
        }else if(this.contestType == 2){
            redirect = '/weekly'
            ContestClass = use('App/Models/WeeklyContest')
            Participation = use('App/Models/WeeklyParticipation')
        }else if(this.contestType ==3){
            redirect = '/monthly'
            ContestClass = use('App/Models/MonthlyContest')
            Participation = use('App/Models/MonthlyParticipation')
        }      

        this.secret = 'wDdt6uXcgaRX4v8H9gavicha6er!jvG56WhdHVD6LC5'
        var contest
        var previousContest
        var nextContest

        if(params.contest){
            try{
                var id = this.decrypt(params.contest+'')
                contest = await ContestClass.query().where('id',id).first()
            }catch(error){
                return response.redirect(redirect)
            }
        }else{
            contest = await ContestClass.query().orderBy('id', 'desc').first()
        }
        
        if(contest == null){
            var datetime = require('node-datetime')
            var dt = datetime.create();
            var formatted = dt.format('Y-m-d H:M:S')
            try{
                await ContestClass.create({
                    start: formatted
                })
            }catch(err){
                return err
            }
            return response.route('index')
        }

        var numparticipation
        var userTicket
        try{
            numparticipation = await Participation.query().where('contest_id', contest.id ).where('user_id',auth.user.id).getCount()
            userTicket = await auth.user.userTicket().fetch()
            if(this.contestType == 1){
                numTickets = parseInt(userTicket.daily)
            }else if(this.contestType == 2){
                numTickets = parseInt(userTicket.weekly)
            }else if(this.contestType ==3){
                numTickets = parseInt(userTicket.monthly)
            }
        }catch(err){}

        try{
             const PreviousContest = await ContestClass.query().where('id','<',contest.id).orderBy('id', 'desc').first()
             previousContest = redirect+'/'+this.encrypt(PreviousContest.id+'')
        }catch(error){
             previousContest = 0
        }

        try{
            const NextContest = await ContestClass.query().where('id','>',contest.id).orderBy('id', 'asc').first()
            nextContest = redirect+'/'+this.encrypt(NextContest.id+'')
        }catch(error){
            nextContest = 0
        }

        var participants
        var winners
        const showWinners = (contest.isDone == 1) ? 1 : 0
        try{
            const participations = await contest.users().fetch()
            participants= participations.toJSON()
        }catch(err){}

        if(showWinners == 1){
            try{
                const winnings = await contest.users().wherePivot('isWinner',true).fetch()
                winners = winnings.toJSON()
            }catch(err){winners=err}
        }
        
        //stats
        const status = (contest.isDone == 1) ? 'led-red': 'led-green'
        const full = (contest.isFull == 1) ? 'led-red': 'led-green'
        const progress = parseInt(contest.numParticipants/contest.maxParticipants*100)
        const progressStyle = this.getProgressStyle(progress)
        const stats = {status,full,progress,progressStyle}
        const win = contest.btc/contest.numWinners
        const contestType = this.contestType
        const minParticipants = contest.numWinners*3
        
        var alreadyJoined = 0
        if(numparticipation > 0){alreadyJoined = 1}

        const data = {
            contest:contest.toJSON(),
            stats,
            showWinners,
            previousContest,
            nextContest,
            win,
            contestType,
            numTickets,
            minParticipants,
            alreadyJoined,
            participants,
            winners
        }
        return view.render('pages.contest',data)
    }

    getProgressStyle(progress){
        var style
        if(progress < 25){
            style = 'bg-success'
        }else if(progress < 50){
            style = 'bg-info'
        }else if(progress < 75){
            style = 'bg-warning'
        }else{
            style = 'bg-danger'
        }
        return style
    }

    encrypt(string){
        var cipher = crypto.createCipher('aes-256-cbc',this.secret)
        var crypted = cipher.update(string,'utf8','hex')
        crypted += cipher.final('hex');
        return crypted;
    }

    decrypt(string){
        var decipher = crypto.createDecipher('aes-256-cbc',this.secret)
        var dec = decipher.update(string,'hex','utf8')
        dec += decipher.final('utf8');
        return dec;
    }
}

module.exports = ContestController
