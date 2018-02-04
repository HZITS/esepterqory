const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const sid = require('shortid-36')

const Problem = require('../models/problem');
const Topic = require('../models/topic');

router.route('/')

.post((req, res) => {


    var problem = new Problem()

    problem._id = sid.generate()
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
    Problem.find((err, problems) =>{
        if (err) res.json(err)
        res.json(problems);
    });
})

router.route('/topic/:topicId')
.get((req,res) => {
    Problem.find({
        path: req.params.topicId,
    })
    .populate({
        path: 'topics',
        model: 'Topic',
        select: '_id title'
    })
    .select('problem topics _id')
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
    })
})
.put((req,res)=>{
    problem.findById(req.params.id, (err, problem) => {

        problem.title = req.body.title
        problem.path = req.body.path

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
    problem.remove({
        _id: req.params.id
    }, err => {
        res.send('deleted')
    })
})

// Return router
module.exports = router;