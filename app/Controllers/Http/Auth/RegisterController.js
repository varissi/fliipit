'use strict'

const {validateAll} = use('Validator')
const User = use('App/Models/User')
const randomString = require('random-string')
const Mail = use('Mail')
const WalletController = use('App/Controllers/Http/Providers/WalletController')


class RegisterController {
    showRegistrationForm({view}){
        return view.render('auth.register')
    }

    async register({request, session, response}){
        //validation
        const validation = await validateAll(request.all(),{
            username:'required|unique:users,username',
            email:'required|email|unique:users,email',
            password:'required',
            agree:'required'
        })
        if(validation.fails()){
            session.withErrors(validation.messages()).flashExcept(['password'])
            return response.redirect('back')
        }else if(request.input('password').length < 6){
            session.flash({
                notification:{
                    type:'danger',
                    message: 'Your password is too short. Enter at least 6 characters'
                }
            })
            return response.redirect('back')
        }else if(request.input('username').length < 4){
            session.flash({
                notification:{
                    type:'danger',
                    message: 'Your username is too short. Enter at least 4 characters'
                }
            })
            return response.redirect('back')     
        }

        //create user
        const user = await User.create({
            username: request.input('username'),
            email: request.input('email'),
            password: request.input('password'),
            confirmation_token: randomString({length:40})
        })
        
        const Wallet = new WalletController(user)
        Wallet.createWallet()
        await user.btcWallet().create({user_id:user.id,privateKey: Wallet.encryptedPrivateKey,adress:Wallet.adress.toString()})
        await user.userTicket().create({user_id:user.id})
        await user.balance().create({user_id:user.id})

        //send email
        await Mail.send('auth.emails.confirm_email',user.toJSON(), message =>{
            message
            .to(user.email)
            .from('no-reply@example.com')
            .subject('Email confirmation - Fliipit')
        })

        //success
        session.flash({
            notification: {
                type: 'success',
                message:'Registration successful! Please confirm your email adress.'
            }
        })

        return response.redirect('back')
    }

    async confirmEmail({params, session, response}){
        const user = await User.findBy('confirmation_token',params.token)
        user.confirmation_token = null
        user.email_verified = true
        await user.save()

        session.flash({
            notification: {
                type: 'success',
                message: 'Your email adress has been confirmed.'
            }
        })

        return response.route('loginForm')
    }

}

module.exports = RegisterController
