'use strict'
const {validate,validateAll} = use('Validator')
const User = use('App/Models/User')
const Mail = use('Mail')
const Hash = use('Hash')
const passwordReset = use('App/Models/PasswordReset')
const randomString = require('random-string')

class PasswordResetController {
    showSendEmailForm({view}){
        return view.render('auth.forgotPassword')
    }

    showResetForm({view,params}){
        return view.render('auth.resetPassword',{token:params.token})
    }

    async sendResetLink({request,session,response}){

        const validation = await validate(request.only('email'),{
            email: 'required|email'
        })
        
        if(validation.fails()){
            session.withErrors(validation.messages()).flashAll()
            return response.redirect('back')
        }
        try{
            const user = await User.findBy('email',request.input('email'))
            await passwordReset.query().where('email',user.email).delete()
            const {token} = await passwordReset.create({
                email: user.email,
                token: randomString({length:40})
            })
            const emailData = {
                user:user.toJSON(),
                token
            }
            await Mail.send('auth.emails.reset_password',emailData,message =>{
                message
                .to(user.email)
                .from('no-reply@fliipit.com')
                .subject('Reset your password - Fliipit')
            })
            session.flash({
                notification: {
                    type:'success',
                    message: 'An email has been sent your email adress.'
                }
            })
            return response.redirect('back')
        }catch(error){
            session.flash({
                notification: {
                    type:'warning',
                    message: 'Sorry, there is no user with this email adress.'
                }
            })
            return response.redirect('back')
        }
    }

    async resetPassword({request, session,response}){
        const validation = await validateAll(request.all(),{
            email: 'required',
            token: 'required',
            password: 'required|confirmed'
        })

        if(validation.fails()){
            session.withErrors(validation.messages()).flashExcept(['password'])
            return response.redirect('back')
        }

        try{
            const user = await User.findBy('email',request.input('email'))
            const token = await passwordReset.query().where('email',user.email).where('token',request.input('token')).first()
            if(!token){
                session.flash({
                    notification: {
                        type: 'warning',
                        message: 'Invalid token.'
                    }
                }) 
                return response.redirect('back')
            }

            user.password =await Hash.make(request.input('password'))
            await user.save()
            await passwordReset.query().where('email',user.email).delete()
            session.flash({
                notification: {
                    type: 'success',
                    message: 'Password updated successfuly.'
                }
            })
            return response.redirect('/login')

        }catch(error){
            session.flash({
                notification: {
                    type: 'warning',
                     message: 'Sorry, there is no user with this email adress. Please register.'
                }
            })
            return response.redirect('back')
        }
    }
}

module.exports = PasswordResetController
