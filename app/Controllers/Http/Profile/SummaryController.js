'use strict'
const WalletController = use('App/Controllers/Http/Providers/WalletController')
const DailyContest = use('App/Models/DailyContest')
const WeeklyContest = use('App/Models/WeeklyContest')
const MonthlyContest = use('App/Models/MonthlyContest')

const DailyPrice = use('App/Models/DailyPrice')
const WeeklyPrice = use('App/Models/WeeklyPrice')
const MonthlyPrice = use('App/Models/MonthlyPrice')

class SummaryController {
    async show({view,auth}){
        const user = auth.user
        const userTicket = await user.userTicket().fetch()
        const balance = await user.balance().fetch()
        const btcWallet = await user.btcWallet().fetch()
        
        //wallet
        const wallet = new WalletController(auth.user)
        btcWallet.btc = await wallet.getBalance(btcWallet.adress)
        await btcWallet.save()

        var totalErnings = 0
        const dailyPrice = await DailyPrice.query().where('balance_id',balance.id).where('paid',false).fetch()
        const dailyPriceJSON = dailyPrice.toJSON()
        const weeklyPrice = await WeeklyPrice.query().where('balance_id',balance.id).where('paid',false).fetch()
        const weeklyPriceJSON = weeklyPrice.toJSON()
        const monthlyPrice = await MonthlyPrice.query().where('balance_id',balance.id).where('paid',false).fetch()
        const monthlyPriceJSON = monthlyPrice.toJSON()
        dailyPriceJSON.forEach(function(price) {totalErnings = totalErnings + price.btc});
        weeklyPriceJSON.forEach(function(price) {totalErnings = totalErnings + price.btc});
        monthlyPriceJSON.forEach(function(price) {totalErnings = totalErnings + price.btc});

        balance.btc = totalErnings
        await balance.save()
        //contests
        const dailyContest = await DailyContest.query().orderBy('id', 'desc').first()
        const weeklyContest = await WeeklyContest.query().orderBy('id', 'desc').first()
        const monthlyContest = await MonthlyContest.query().orderBy('id', 'desc').first()
        //daily Stats
        const dailyStatus = (dailyContest.isDone == 1) ? 'led-red': 'led-green'
        const dailyFull = (dailyContest.isFull == 1) ? 'led-red': 'led-green'
        const dailyProgress = parseInt(dailyContest.numParticipants/dailyContest.maxParticipants*100)
        var dailyProgressStyle = this.getProgressStyle(dailyProgress)
        const dailyStat = {dailyStatus,dailyFull,dailyProgress,dailyProgressStyle}
        //weekly Stats
        const weeklyStatus = (weeklyContest.isDone == 1) ? 'led-red': 'led-green'
        const weeklyFull = (weeklyContest.isFull == 1) ? 'led-red': 'led-green'
        const weeklyProgress = parseInt(weeklyContest.numParticipants/weeklyContest.maxParticipants*100)
        var weeklyProgressStyle = this.getProgressStyle(weeklyProgress)
        const weeklyStat = {weeklyStatus,weeklyFull,weeklyProgress,weeklyProgressStyle}
        //monthly
        const monthlyStatus = (monthlyContest.isDone == 1) ? 'led-red': 'led-green'
        const monthlyFull = (monthlyContest.isFull == 1) ? 'led-red': 'led-green'
        const monthlyProgress = parseInt(monthlyContest.numParticipants/monthlyContest.maxParticipants*100)
        var monthlyProgressStyle = this.getProgressStyle(monthlyProgress)
        const monthlyStat = {monthlyStatus,monthlyFull,monthlyProgress,monthlyProgressStyle}
        
        const summary = {}

        var totalParticipations = 0
        var currentParticipations = 0
        const totalDaily = await user.dailyContests().pivotModel('App/Models/DailyParticipation').getCount()
        const totalWeekly = await user.weeklyContests().pivotModel('App/Models/WeeklyParticipation').getCount()
        const totalMonthly = await user.monthlyContests().pivotModel('App/Models/MonthlyParticipation').getCount()

        const currentDaily = await user.dailyContests().where('isDone',false).pivotModel('App/Models/DailyParticipation').getCount()
        const currentWeekly = await user.weeklyContests().where('isDone',false).pivotModel('App/Models/WeeklyParticipation').getCount()
        const currentMonthly = await user.monthlyContests().where('isDone',false).pivotModel('App/Models/MonthlyParticipation').getCount()
	

	const dec_privateKey = wallet.decrypt(btcWallet.privateKey)

        totalParticipations = totalDaily +totalWeekly + totalMonthly
        totalParticipations = (totalParticipations>0)? totalParticipations : '0'
        currentParticipations = currentDaily +currentWeekly + currentMonthly
        currentParticipations = (currentParticipations>0)? currentParticipations : '0'
        const data = {
            user: user.toJSON(),
            userTicket: userTicket.toJSON(),
            balance: balance.toJSON(),
            btcWallet: btcWallet.toJSON(),
	    dec_privateKey,
            summary,
            dailyStat,
            weeklyStat,
            monthlyStat,
            totalParticipations,
            currentParticipations,
            dailyContest:dailyContest.toJSON(),
            weeklyContest:weeklyContest.toJSON(),
            monthlyContest:monthlyContest.toJSON(),
        }

        return view.render('users/profile/summary',data)
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
}

module.exports = SummaryController
