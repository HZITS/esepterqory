const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const Problem = require('../models/problem')
const cheerio = require('cheerio')
const math = require('mathjax-node-page/lib/main').mjpage
const pdf = require('html-pdf')
const fs = require('fs')

router.route('/problem/:id')
.get((req, res) => {
    res.set({
        "Content-Type": "application/octet-stream",
        "Content-Disposition": "attachment"
    })
    Problem.findById(req.params.id, (err, problem) => {

        if(err) {
            res.json(err)
            return
        }

        const $ = cheerio.load(problem.problem)
        const arr = $('editor-formula-module').toArray()
        arr.forEach((el, index) => {
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
                pdf.create(html, null).toStream(function(err, stream){
                    stream.pipe(res);
                });
        })

    })
})

router.route('/article/:id')
.get((req, res) => {
    res.set({
        "Content-Type": "application/octet-stream",
        "Content-Disposition": "attachment"
    })
    Problem.findById(req.params.id, (err, problem) => {

        if(err) {
            res.json(err)
            return
        }

        const $ = cheerio.load(problem.problem)
        const arr = $('editor-formula-module').toArray()
        arr.forEach((el, index) => {
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
                pdf.create(html, null).toStream(function(err, stream){
                    stream.pipe(res);
                });
        })

    })
})

router.route('/topic/:id/:page')
.get((req,res) => {

    const perPage = 5

    Problem.find({
        path: req.params.id,
    })
    .populate({
        path: 'topics',
        model: 'Topic',
        select: '_id title'
    })
    .select('problem topics _id')
    .skip(perPage * (req.params.page - 1))
    .limit(perPage)
    .sort({createdAt: -1})
    .exec((err, problems) => {
        if(err) {
            res.json(err)
            return
        }

        const source = problems.map(el => {return el.problem}).join('<br/><br/><br/>')
        const $ = cheerio.load(source)
        const arr = $('editor-formula-module').toArray()

        arr.forEach((el, index) => {
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
               pdf.create(html, null).toStream(function(err, stream){
                   stream.pipe(res);
               });
       })

    })
})

module.exports = router
