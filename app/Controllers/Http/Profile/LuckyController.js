'use strict'

const DailyPrice = use('App/Models/DailyPrice')
const WeeklyPrice = use('App/Models/WeeklyPrice')
const MonthlyPrice = use('App/Models/MonthlyPrice')

class LuckyController {

    async show({view,auth,request}){
        var totalErningsDaily = 0
        var totalErningsWeekly = 0
        var totalErningsMonthly = 0
        const balance = await auth.user.balance().fetch()
        const dailyPrice = await DailyPrice.query().where('balance_id',balance.id).orderBy('id','desc').fetch()
        const weeklyPrice = await WeeklyPrice.query().where('balance_id',balance.id).orderBy('id','desc').fetch()
        const monthlyPrice = await MonthlyPrice.query().where('balance_id',balance.id).orderBy('id','desc').fetch()
        const dailyPriceJSON = dailyPrice.toJSON()
        const weeklyPriceJSON = weeklyPrice.toJSON()
        const monthlyPriceJSON = monthlyPrice.toJSON()
        dailyPriceJSON.forEach(function(price) {totalErningsDaily = totalErningsDaily + price.btc});
        weeklyPriceJSON.forEach(function(price) {totalErningsWeekly = totalErningsWeekly + price.btc});
        monthlyPriceJSON.forEach(function(price) {totalErningsMonthly = totalErningsMonthly + price.btc});
        totalErningsDaily = (totalErningsDaily > 0)? totalErningsDaily : '0'
        totalErningsWeekly = (totalErningsWeekly > 0)? totalErningsWeekly : '0'
        totalErningsMonthly = (totalErningsMonthly > 0)? totalErningsMonthly : '0'
        const lucky = {}
        const data = {
            lucky,
            contest: request.input('contest'),
            dailyPrices:dailyPrice.toJSON(),
            weeklyPrices:weeklyPrice.toJSON(),
            totalErningsDaily,
            totalErningsWeekly,
            totalErningsMonthly,
            monthlyPrices:monthlyPrice.toJSON()
        }
        return view.render('users/profile/lucky',data)
    }
}

module.exports = LuckyController
