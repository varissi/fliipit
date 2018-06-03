'use strict'
const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
  const Exception = use('Exception')

  Exception.handle('HttpException', async (error, { response, session }) => {
    return response.route('notfound')
  })

  Exception.handle('InvalidSessionException', async (error, { response}) => {
    return response.route('loginForm')
  })

  const View = use('View')
  const Env = use('Env')
  View.global('appUrl', path =>{
    const APP_URL = Env.get('APP_URL')
    return path ? `${APP_URL}/${path}` : APP_URL
  })
})