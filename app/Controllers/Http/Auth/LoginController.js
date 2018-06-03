'use strict'
const User = use('App/Models/User')
const {validateAll} = use('Validator')
const Hash = use('Hash')
class LoginController {

    showLoginForm({view}){
        return view.render('auth.login')
    }

    async login({request, auth, session,response}){
        const {username, password, remember} = request.all()
        const validation = await validateAll(request.all(),{
            username: 'required',
            password: 'required'
        })
        if(validation.fails()){
            session.withErrors(validation.messages()).flashExcept(['password'])
            return response.redirect('back')
        }
        const user = await User.query().where('username',username).where('email_verified',true).first()

        if(user){
            const passwordVerified = await Hash.verify(password, user.password)
            if(passwordVerified){
                await auth.logout()
                await auth.remember(!!remember).login(user)
                return response.route('profile')
            }
        }

        session.flash({
            notification:{
                type: 'warning',
                message: "we couldn't verify your credientials. Make sure you have confirmed your email adress or regsiter."
            }
        })
        return response.redirect('back')
    }
}

module.exports = LoginController
