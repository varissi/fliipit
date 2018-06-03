'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')
Route.get('/sitemap', ({ view }) => view.render('pages/sitemap')).formats(['xml'])
Route.get('/robots.txt', ({ view,response }) => { 
	response.type('text/plain');
    	response.send("User-agent: * Allow: /");
})


Route.get('/notfound',({view}) => view.render('errors.pagenotfound')).as('notfound')
Route.get('/','IndexController.show').as('index')

Route.get('/terms','IndexController.terms').as('terms')


Route.get('/register','Auth/RegisterController.showRegistrationForm').as('registerForm').middleware(['authenticated'])
Route.post('/register','Auth/RegisterController.register').as('register')
Route.get('/register/confirm/:token','Auth/RegisterController.confirmEmail').middleware(['authenticated'])

Route.get('/login','Auth/LoginController.showLoginForm').as('loginForm').middleware(['authenticated'])
Route.post('/login','Auth/LoginController.login').as('login')

Route.get('/logout','Auth/AuthenticatedController.logout').as('logout')

Route.get('/forgot','Auth/PasswordResetController.showSendEmailForm').as('forgotForm').middleware(['authenticated'])
Route.post('/forgot','Auth/PasswordResetController.sendResetLink').as('forgot')
Route.get('forgot/reset/:token','Auth/PasswordResetController.showResetForm').as('resetForm')
Route.post('forgot/reset','Auth/PasswordResetController.resetPassword').as('reset').middleware(['authenticated'])

Route.get('/profile','Profile/SummaryController.show').as('profile').middleware(['auth'])
Route.get('/tickets','Profile/TicketController.show').as('tickets').middleware(['auth'])
Route.get('/tickets/:contest','Profile/TicketController.show').middleware(['auth'])
Route.get('/lucky','Profile/LuckyController.show').as('lucky').middleware(['auth'])

Route.post('/claim','Profile/ClaimController.process').as('claim').middleware(['auth'])

Route.post('/purchasedaily','PurchaseController.daily').as('purchasedaily').middleware(['auth'])
Route.post('/purchaseweekly','PurchaseController.weekly').as('purchaseweekly').middleware(['auth'])
Route.post('/purchasemonthly','PurchaseController.monthly').as('purchasemonthly').middleware(['auth'])

Route.get('/daily','Contests/ContestController.daily').as('daily')
Route.get('/daily/:contest','Contests/ContestController.daily')
Route.get('/weekly','Contests/ContestController.weekly').as('weekly')
Route.get('/weekly/:contest','Contests/ContestController.weekly')
Route.get('/monthly','Contests/ContestController.monthly').as('monthly')
Route.get('/monthly/:contest','Contests/ContestController.monthly')

Route.post('/join','Contests/JoinController.process').as('join').middleware(['auth'])