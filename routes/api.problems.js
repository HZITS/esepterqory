const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const sid = require('shortid-36')
const Problem = require('../models/problem');
const Topic = require('../models/topic');
const math = require('mathjax-node-page/lib/main').mjpage
const cheerio = require('cheerio')

router.route('/')
.post((req, res) => {


    var problem = new Problem()

    problem._id = sid.generate()
    problem.number = req.body.number
    problem.problem = req.body.problem
    problem.solution = req.body.solution
    problem.path = req.body.path.split('/')

    problem.topics = [problem.path[problem.path.length - 1]]
    problem.topic = problem.path[problem.path.length - 1]

    problem.save( err => {
        
        if(err) {
            res.json(err)
            return
        }
        //increasing problems counter on each topic in the path
        Topic.find()
        .or(req.body.path.split('/').map(el => {
            return {
                _id: el
            }
        }))
        .setOptions({ multi: true })
        .update({ $inc: { problemsCount: 1 } })
        .exec((err, t) => {
            if(err) {
                res.json(err)
                return
            }
            res.json('ok')
        })
       
    })
})

.get((req,res) => {
    Problem.
    find()
    .limit(10)
    .sort({createdAt: -1})
    .exec((err, problems) =>{
        if (err) res.json(err)
        res.json(problems);
    });
})

router.route('/topic/:topicId/:pageId')
.get((req,res) => {

    const perPage = 10

    Problem.find({
        path: req.params.topicId
    })
    .populate({
        path: 'topics',
        model: 'Topic',
        select: '_id title'
    })
    .select('problem topics number _id seen downloaded')
    .skip(perPage * (req.params.pageId - 1))
    .limit(perPage)
    .sort({number: 1})
    .exec((err, problems) => {
        if(err) {
            res.json(err)
            return
        }
        res.json(problems)
    })
})

router.route('/id/:id')
.get((req,res) => {
    console.log(res.locals.admin)

    Problem.findById(req.params.id)
    .populate({
        path: 'path',
        model: 'Topic',
        select: '_id title'
    })
    .exec((err, problem) => {
        if(err) {
            res.json(err)
            return
        }
        res.json(problem)
        if(!res.locals.admin){
            problem.seen += 1
            problem.save()
        }
        
    })
})
.put((req,res)=>{
    Problem.findById(req.params.id, (err, problem) => {

        problem.problem = req.body.problem
        problem.solution = req.body.solution
        problem.number = req.body.number

        problem.save(err=>{
            if(err) {
                res.json(err)
                return
            }

            res.send('updated')
        })

    })
})
.delete((req,res)=>{

    console.log(req.params.id)

    Problem.findById(req.params.id, (err, problem) => {

        if(err || !problem) {
            res.json(err)
            return
        }
    
        Topic.find()
        .or(problem.path.map(el => {
            return {
                _id: el
            }
        }))
        .setOptions({ multi: true })
        .update({ $inc: { problemsCount: -1 } })
        .exec((err, t) => {
            if(err) {
                res.json(err)
                return
            }

            Problem.remove({
                _id: req.params.id
            }, err => {

                if(err) {
                    res.json(err)
                    return
                }

                res.send('deleted')
            })
        })
    })

})

// Return router
module.exports = router;