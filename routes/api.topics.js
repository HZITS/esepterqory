const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const sid = require('shortid-36')
const Topic = require('../models/topic');

router.route('/')

.post((req, res) => {
    var topic = new Topic()

    topic._id = req.body._id !== undefined ? req.body._id: sid.generate()
    topic.title = req.body.title
    topic.path = req.body.path !== undefined ? req.body.path + '/' + topic._id: topic._id
    topic.prepath = req.body.path !== undefined ? req.body.path: undefined
    topic.topicsPath = topic.path.split('/')

    topic.save( err => {
        if(err) {
            res.json(err)
            return
        }
        res.json('ok')
    })
})
.get((req,res) => {
    Topic.find((err, topics) =>{
        if(err) {
            res.json(err)
            return
        }
        res.json(topics)

    });
})

router.route('/:id')
.get((req,res) => {

    if(req.query.populate == 'true'){

        Topic.findById(req.params.id)
        .populate({
            path: 'subtopics',
            model: 'Topic',
            select: '_id title prepath problemsCount'
        })
        .populate({
            path: 'topicsPath',
            model: 'Topic',
            select: '_id title'
        })
        .exec((err, topic) => {
            if(err || !topic) {
                res.json("doesn't exist")
                return
            }
            res.json(topic)
        })
    } else {
        Topic.findById(req.params.id, (err, topic) => {
            if(err || !topic) {
                res.json("doesn't exist")
                return
            }
            res.json(topic)
        })
    }
    
})
.put((req,res)=>{

    Topic.findById(req.params.id, (err, topic) => {

        topic.title = req.body.title
        
        topic.save(err=>{
            if(err) {
                res.json(err)
                return
            }
            res.send('updated')
        })

    })
})
.delete((req,res)=>{
    Topic.remove({
        _id: req.params.id
    }, err => {
        if(err) {
            res.json(err)
            return
        }
        res.send('deleted')
    })
})

module.exports = router;
