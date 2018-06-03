'use strict'
const Bitcore = require('bitcore-explorers/node_modules/bitcore-lib')
const WalletController = use('App/Controllers/Http/Providers/WalletController')
const {validate} = use('Validator')
const Struct = use('App/Models/Struct')
const DailyPrice = use('App/Models/DailyPrice')
const WeeklyPrice = use('App/Models/WeeklyPrice')
const MonthlyPrice = use('App/Models/MonthlyPrice')

class ClaimController {

    async process({request,response,session,auth}){
        const address = request.input('address')
        const struct = await Struct.query().first()
        const balance = await auth.user.balance().fetch()
        const validation = await validate(request.only('address'),{
            address: 'required'
        })
        if(validation.fails()){
            session.flash({
                notification:{
                    type:'warning',
                    message:'Please enter a valid address.'
                }
            })
            return response.redirect('back')
        }
        var totalErnings = 0
        var totalErningsDaily = 0
        var totalErningsWeekly = 0
        var totalErningsMonthly = 0
        const dailyPrice = await DailyPrice.query().where('balance_id',balance.id).where('paid',false).fetch()
        const dailyPriceJSON = dailyPrice.toJSON()
        const weeklyPrice = await WeeklyPrice.query().where('balance_id',balance.id).where('paid',false).fetch()
        const weeklyPriceJSON = weeklyPrice.toJSON()
        const monthlyPrice = await MonthlyPrice.query().where('balance_id',balance.id).where('paid',false).fetch()
        const monthlyPriceJSON = monthlyPrice.toJSON()
        dailyPriceJSON.forEach(function(price) {totalErningsDaily = totalErningsDaily + price.btc});
        weeklyPriceJSON.forEach(function(price) {totalErningsWeekly = totalErningsWeekly + price.btc});
        monthlyPriceJSON.forEach(function(price) {totalErningsMonthly = totalErningsMonthly + price.btc});

        totalErnings = totalErningsDaily + totalErningsWeekly + totalErningsMonthly
        balance.btc = totalErnings
        await balance.save()
        if(balance.btc <= 0.2){
            session.flash({
                notification:{
                    type:'warning',
                    message:'You must earn more than 0.2 Bitcoins in order to claim your earnings.'
                }
            })
            return response.redirect('back')
        }

        const wallet = new WalletController(auth.user)
        const userWallet = await auth.user.btcWallet().fetch()
        const from = struct.ya
        const privateEnc = struct.y
        const privateDeEnc = wallet.decryptSecret(privateEnc,'THIS CANNOT BE PUT ON GITHUB, IT IS THE SECRET KEY A WALLET')
        var totalAmount = totalErnings - 0.00050000

        const transValidation = await wallet.transaction(from,address,totalAmount,privateDeEnc)
        if(transValidation == 0){
            session.flash({
                notification:{
                    type:'warning',
                    message:'We could not process the payment. Please try again later or send us an email.'
                }
            })
            return response.redirect('back')
        }

        const dailyPriceArray = JSON.parse(JSON.stringify(dailyPriceJSON))
        const weeklyPriceArray = JSON.parse(JSON.stringify(weeklyPriceJSON))
        const monthlyPriceArray = JSON.parse(JSON.stringify(monthlyPriceJSON))

        for(var i =0;i<dailyPriceArray.length;i++){
            var price = await DailyPrice.query().where('id',dailyPriceArray[i].id).first()
            price.paid = 1
            await price.save()
        }

        for(var i =0;i<weeklyPriceArray.length;i++){
            var price = await WeeklyPrice.query().where('id',weeklyPriceArray[i].id).first()
            price.paid = 1
            await price.save()
        }

        for(var i =0;i<monthlyPriceArray.length;i++){
            var price = await MonthlyPrice.query().where('id',monthlyPriceArray[i].id).first()
            price.paid = 1
            await price.save()
        }

        balance.btc = 0
        await balance.save()

        session.flash({
            notification:{
                type:'success',
                message:'Payment successful!'
            }
        })
        return response.redirect('back')
        
        
    }
}

module.exports = ClaimController
