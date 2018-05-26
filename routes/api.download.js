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
      "right": "10mm",
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

router.route('/ids/:arr')
.get((req,res) => {
    res.set({
        "Content-Type": "application/octet-stream",
    })

    const arr = req.params.arr.split(',')

    Problem.find({
        '_id': {
            $in: arr
        }
    })
    .sort({number: 1})
    .exec((err, problems) => {
        if(err) {
            res.json(err)
            return
        }

        const source = problems.map(el => {return `<h3>${el.number}</h3><p>` + el.problem}).join('</p>')


        const html = `
        <!doctype html>
        <html>
            <head>
                <style>
                    h3{
                        margin-bottom: 0px;
                    }
                    p{
                        margin-top:0px;
                    }
                    body{
                        font-size:12px;
                    }
                </style>
            </head>
            <body>
            ${source}</p>
            </body>
        </html>
        `

        const $ = setMath(html)

        renderMath($.html(), html => {
            const FILENAME = encodeURIComponent('есепетер.pdf')
            res.setHeader('Content-Disposition', 'attachment;filename*=UTF-8\'\'' + FILENAME)
            
            pdf.create(html, options).toStream(function(err, stream){
                stream.pipe(res);
            })

            Problem.find({
                '_id': {
                    $in: arr
                }
            })
            .setOptions({ multi: true })
            .update({ $inc: { downloaded: 1 } })
            .exec()
        })
    })

})

//Download problem by id
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

        const html = `
        <!doctype html>
        <html>
            <head>
                <style>
                     body{
                         font-size:12px;
                     }
                </style>
            </head>
            <body>
            <h3>${roblem.number}</h3>
            <p>${problem.problem}</p>
            </body>
        </html>
        `        

        const $ = setMath(html)

        renderMath($.html(), html => {
            const FILENAME = encodeURIComponent(problem.number) + '.pdf'
            res.setHeader('Content-Disposition', 'attachment;filename*=UTF-8\'\'' + FILENAME)
            pdf.create(html, options).toStream(function(err, stream){
                stream.pipe(res);
            })

            problem.downloaded += 1
            problem.save()
        })
    })
})

//Download article by id
router.route('/article/:id')
.get((req, res) => {
    
    Article.findById(req.params.id, (err, article) => {

        if(err) {
            res.json(err)
            return
        }

        const html = `
        <!doctype html>
        <html>
            <head>
                <style>
                     body{
                         font-size:11px;
                     }
                </style>
            </head>
            <body>
            <h3>${article.title}</h3>
            <p>${article.article}</p>
            </body>
        </html>
        `

        const $ = setMath(html)
        
        renderMath($.html(), html => {
            const FILENAME = encodeURIComponent(article.title) + '.pdf'
            res.setHeader('Content-Disposition', 'attachment;filename*=UTF-8\'\'' + FILENAME)
            pdf.create(html, options).toStream(function(err, stream){
                stream.pipe(res);
            })
            article.downloaded += 1
            article.save()
        })
    })
})

//Setting math
const setMath = (html) => {
    const $ = cheerio.load(html)

    const arr = $('editor-formula-module').toArray()

    arr.forEach((el, index) => {

        if($(el).children().first().attr('id') == undefined) {
            let p = $(el).parent()

            let contents = p.contents()
            p.after(contents)
            p.remove()
        }

        if($(el).attr('display') == "block")
            $(el).after("$$" + $(el).attr('math') + "$$")
        else 
            $(el).after("$" + $(el).attr('math') + "$")
        
        $(el).remove()

    })

    $('#body').remove()

    return $
}

//Rendering math
const renderMath = (html, cb) => {
    math(html, 
        {
            format: ["TeX"],
            output: 'html',
            singleDollars: true,
        }, 
        {
            html: true
        }, 
        (res) => {
            cb(res)
    })
}


module.exports = router
