const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const Problem = require('../models/problem')
const Article = require('../models/article')
const cheerio = require('cheerio')
const math = require('mathjax-node-page/lib/main').mjpage
const pdf = require('html-pdf')
const fs = require('fs')
const options = {
    "border": {
      "top": "10mm",         
      "right": "20mm",
      "bottom": "5mm",
      "left": "10mm"
    },
    "footer": {
      "height": "10mm",
      "contents": {
        default: '<span style="color: #444;text-align: center">Деректер <a href="www.esepterqory.kz">www.esepterqory.kz</a> сайтынан алынған</span>'
      }
    },
}

router.route('/problem/:id')
.get((req, res) => {
    res.set({
        "Content-Type": "application/octet-stream",
    })
    Problem.findById(req.params.id, (err, problem) => {

        if(err) {
            res.json(err)
            return
        }

        const $ = cheerio.load(problem.problem)
        const arr = $('editor-formula-module').toArray()

        arr.forEach((el, index) => {
            if($(el).attr('display') == "block")
                $(el).after("$$" + $(el).attr('math') + "$$")
            else 
                $(el).after("$" + $(el).attr('math') + "$")

            $(el).remove()
        })

        $.root().prepend(`<h3>${problem.number}</h3>`)

        math($.html(), 
            {
                format: ["TeX"],
                output: 'html',
                singleDollars: true,
            }, 
            {
                html: true
            }, 
            (html) => {

                pdf.create(html, options).toStream(function(err, stream){
                    res.set({
                        "Content-Disposition": `attachment; filename="${problem.number}.pdf"`
                    })
                    stream.pipe(res);
                });
        })

    })
})

router.route('/article/:id')
.get((req, res) => {
    
    Article.findById(req.params.id, (err, article) => {

        if(err) {
            res.json(err)
            return
        }

        const $ = cheerio.load(article.article)
        const arr = $('editor-formula-module').toArray()

        arr.forEach((el, index) => {
            if($(el).attr('display') == "block")
                $(el).after("$$" + $(el).attr('math') + "$$")
            else 
                $(el).after("$" + $(el).attr('math') + "$")

            $(el).remove()
        })

        $.root().prepend(`<h3>${article.title}</h3>`)

        math($.html(), 
            {
                format: ["TeX"],
                output: 'html',
                singleDollars: true,
            }, 
            {
                html: true
            }, 
            (html) => {
                res.set({
                    "Content-Disposition": `attachment; filename="${article.title}.pdf"`
                })
                pdf.create(html, options).toStream(function(err, stream){
                    stream.pipe(res);
                });
        })

    })
})

router.route('/topic/:id/:page')
.get((req,res) => {

    const perPage = 10

    Problem.find({
        path: req.params.id
    })
    .select('problem number')
    .skip(perPage * (req.params.page - 1))
    .limit(perPage)
    .sort({title: 1})
    .exec((err, problems) => {
        if(err) {
            res.json(err)
            return
        }

        const source = problems.map(el => {return `<h2>${el.number}</h2><p>` + el.problem}).join('</p>')
        const $ = cheerio.load(source)
        const arr = $('editor-formula-module').toArray()

        arr.forEach((el, index) => {
            if($(el).attr('display') == "block")
                $(el).after("$$" + $(el).attr('math') + "$$")
            else 
                $(el).after("$" + $(el).attr('math') + "$")
            $(el).remove()
        })


       math($.html(), 
           {
               format: ["TeX"],
               output: 'html',
               singleDollars: true,
           }, 
           {
               html: true
           }, 
           (html) => {
               res.set({
                   "Content-Disposition": `attachment; filename="${req.params.id}.pdf"`
               })
               pdf.create(html, options).toStream(function(err, stream){
                   stream.pipe(res);
               });
       })

    })
})

module.exports = router
