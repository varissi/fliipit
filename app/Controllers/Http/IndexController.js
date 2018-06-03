'use strict'

class IndexController {
    show({view}){
        return view.render('index')
    }

    terms({view}){
        return view.render('pages.terms')
    }
}

module.exports = IndexController
