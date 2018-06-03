'use strict'

const Hash = use('Hash')
const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeCreate', async (userInstance) => {
      if (userInstance.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  btcWallet(){
    return this.hasOne('App/Models/BtcWallet')
  }

  userTicket(){
    return this.hasOne('App/Models/UserTicket')
  }

  balance(){
    return this.hasOne('App/Models/Balance')
  }

  dailyContests(){
    return this.belongsToMany('App/Models/DailyContest','user_id','contest_id').pivotModel('App/Models/DailyParticipation')
  }

  weeklyContests(){
    return this.belongsToMany('App/Models/WeeklyContest','user_id','contest_id').pivotModel('App/Models/WeeklyParticipation')
  }

  monthlyContests(){
    return this.belongsToMany('App/Models/MonthlyContest','user_id','contest_id').pivotModel('App/Models/MonthlyParticipation')
  }
}

module.exports = User
