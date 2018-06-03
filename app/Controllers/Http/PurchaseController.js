'use strict'
const WalletController = use('App/Controllers/Http/Providers/WalletController')
const Struct = use('App/Models/Struct')
class PurchaseController {
    async daily({request,response,session,auth}){
        var {quantity} = request.all()
        await this.processPayments(auth.user,session,response,quantity,1,0.001)
    }

    async weekly({request,response,session,auth}){
        var {quantity} = request.all()
        await this.processPayments(auth.user,session,response,quantity,2,0.00066)
    }

    async monthly({request,response,session,auth}){
        var {quantity} = request.all()
        await this.processPayments(auth.user,session,response,quantity,3,0.00022)
    }

    async processPayments(user,session,response,quantity,type,cost){
        quantity = parseInt(quantity)
        if(quantity < 1){
            session.flash({
                notification:{
                    type:'warning',
                    message:'The quantity should be at least 1'
                }
            }) 
            return response.redirect('back')
        }else{
            const total = quantity * cost
            const amountContest = 0.95 * total
            const amountSouleimane = 0.05 * total

            //userWallet
            const wallet = new WalletController(user)
            const userWallet = await user.btcWallet().fetch()
            const from = userWallet.adress
            const userPkEnc = userWallet.privateKey
            const userPkDeEnc = wallet.decrypt(userPkEnc)
            const currentUserBalance = await wallet.getBalance(userWallet.adress)
            //chack balance
            const diff= wallet.convertToSatoshis(currentUserBalance) - wallet.convertToSatoshis(total)
            const newbalance =  diff - 3*500000.2
            if(newbalance < 0){
                session.flash({
                    notification:{
                        type:'warning',
                        message:'You do not have enough balance in your wallet. Please consider the transaction fees.'
                    }
                }) 
                return response.redirect('back')
            }
            //struct
            const struct = await Struct.query().first()
            const rAddress = struct.rr
            var poolAddress  = struct.yy
            //send to pool 
            const val1 = await wallet.transaction(from,poolAddress,amountContest,userPkDeEnc)
            //send  to earnings
            const val2 = await wallet.transaction(from,rAddress,amountSouleimane,userPkDeEnc)
            const validation = val1*val2
            if(val1*val2 ==0){
                session.flash({
                    notification:{
                        type:'danger',
                        message:'There was a problem in the transaction. Please send us an email to solve your issue.'
                    }
                }) 
                return response.redirect('back')
            }

            //increment user tockets
            const userTicket = await user.userTicket().fetch()
            if(type == 1){userTicket.daily = userTicket.daily+quantity}
            else if(type == 2){userTicket.weekly = userTicket.weekly+quantity}
            else{userTicket.monthly = userTicket.monthly+quantity}
            await userTicket.save()
            session.flash({
                notification:{
                    type:'success',
                    message:'Congratulations! You can now join the contests.'
                }
            }) 
            return response.route('profile')
        }
    }

}

module.exports = PurchaseController
