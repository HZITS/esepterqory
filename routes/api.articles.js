const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const sid = require('shortid-36')
const Article = require('../models/article');
const Topic = require('../models/topic');

router.route('/')
.post((req, res) => {

    var article = new Article()

    article._id = sid.generate()
    article.title = req.body.title
    article.article = req.body.article
    article.path = req.body.path.split('/')
    article.topics = [article.path[article.path.length - 1]]
    article.topic = article.path[article.path.length - 1]

    article.save( err => {
        
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
        .update({ $inc: { articlesCount: 1 } })
        .exec((err, t) => {
            if(err) {
                res.json(err)
                return
            }
            res.sendStatus(200)
        })
    })
})

.get((req,res) => {
    Article.find((err, articles) =>{
        if (err) res.json(err)
        res.json(articles);
    });
})

router.route('/topic/:topicId/:pageId')
.get((req,res) => {

    const perPage = 10

    Article.find({
        path: req.params.topicId,
        createdAt: {
            $lte: req.query.createdAt || Date.now()
        }
    })
    .populate({
        path: 'topics',
        model: 'Topic',
        select: '_id title'
    })
    .select('topics title _id createdAt')
    .skip(perPage * (req.params.pageId - 1))
    .limit(perPage)
    .sort({createdAt: -1})
    .exec((err, articles) => {
        if(err) {
            res.json(err)
            return
        }
        res.json(articles)
    })
})

router.route('/id/:id')
.get((req,res) => {
    Article.findById(req.params.id)
    .populate({
        path: 'path',
        model: 'Topic',
        select: '_id title'
    })
    .exec((err, article) => {
        if(err) {
            res.json(err)
            return
        }
        res.json(article)
    })
})
.put((req,res)=>{
    Article.findById(req.params.id, (err, article) => {

        article.article = req.body.article
        article.title = req.body.title

        article.save(err=>{
            if(err) {
                res.json(err)
                return
            }

            res.send('updated')
        })

    })
})
.delete((req,res)=>{
    Article.findById(req.params.id, (err, article) => {

        if(err || !article) {
            res.json(err)
            return
        }
    
        Topic.find()
        .or(article.path.map(el => {
            return {
                _id: el
            }
        }))
        .setOptions({ multi: true })
        .update({ $inc: { articlesCount: -1 } })
        .exec((err, t) => {
            if(err) {
                res.json(err)
                return
            }

            article.remove({
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