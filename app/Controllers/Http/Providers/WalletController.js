'use strict'
const Buffer = require('buffer').Buffer
const Bitcore = require('bitcore-explorers/node_modules/bitcore-lib')
var explorers = require('bitcore-explorers');
var insight = new explorers.Insight();
const crypto = require('crypto')

class WalletController {
    constructor(user){
        this.user = user
        this.secret = 'wDdt6uXcgaRX4v8H9Ane'+user.email+user.username
        this.balance = 0
    }

    createWallet(){
        this.PrivateKey = this.newPrivateKey()
        this.adress = this.PrivateKey.toAddress()
        this.encryptedPrivateKey = this.encrypt(this.PrivateKey.toString())
    }

    getUTXOS(address) {
        return new Promise(function(resolve, reject) {
            insight.getUnspentUtxos(address, function(err, utxos) {
                if (err) {
                    resolve(-1)
                } else {
                    var balance = 0
                    utxos.forEach(function(utxo){
                        balance = balance + Bitcore.Unit.fromSatoshis(utxo.satoshis).toBTC()
                    })
                    resolve(balance)
                }
            })  
        });
    }

    getUnspentUtxos(address){
        return new Promise(function(resolve, reject) {
            insight.getUnspentUtxos(address, function(err, utxos) {
                if (err) {
                    resolve(err)
                } else {
                    resolve(utxos)
                }
            })  
        });
    }

    async getBalance(address){
        this.balance = this.getUTXOS(address).then(function(r){return r}).catch(function(r){})
        return this.balance
    }

    encrypt(string){
        var cipher = crypto.createCipher('aes-256-cbc',this.secret)
        var crypted = cipher.update(string,'utf8','hex')
        crypted += cipher.final('hex');
        return crypted;
    }

    decrypt(string){
        var decipher = crypto.createDecipher('aes-256-cbc',this.secret)
        var dec = decipher.update(string,'hex','utf8')
        dec += decipher.final('utf8');
        return dec;
    }

    decryptSecret(string,secret){
        var decipher = crypto.createDecipher('aes-256-cbc',secret)
        var dec = decipher.update(string,'hex','utf8')
        dec += decipher.final('utf8');
        return dec;
    }

    async transaction(from,to,amount,sign){
        var correctAmount = Bitcore.Unit.fromBTC(amount).toSatoshis()
        var UTEXOS = await  this.getUnspentUtxos(from)
        var tx = Bitcore.Transaction()
        tx.from(UTEXOS)
        tx.to(to,correctAmount)
        tx.change(from)
        tx.fee(50000)
        tx.sign(sign)
        tx.serialize()
        await insight.broadcast(tx,function(err,returnedTxId){
            if(err){
                return 0
            }else{
                return 1
            }
        })
    }

    convertToSatoshis(amount){
        return Bitcore.Unit.fromBTC(amount).toSatoshis()
    }

    newPrivateKey(){
        const value = Buffer.from(this.user.username+this.user.password);
        const hash = Bitcore.crypto.Hash.sha256(value);
        const bn = Bitcore.crypto.BN.fromBuffer(hash);
        const PrivateKey = new Bitcore.PrivateKey(bn);
        return PrivateKey;
    }
}

module.exports = WalletController
