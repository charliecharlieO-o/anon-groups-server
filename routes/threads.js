const express = require("express");
const shortid = require("shortid");
const passport = require("passport");
const router = express.Router();

// Models
const Board = require("../models/board");
const User = require("../models/user");
const Thread = require("../models/thread");
const Reply = require("../models/reply");

const settings = require("../config/settings"); //System settings
const utils = require("../config/utils"); //System utils

// Include passport module as passport strategy
require("../config/passport")(passport);

//=================================================================================
//									--	THREADS --
//=================================================================================

const thread_list_default = "_id title board poster text media reply_count reply_excerpts"

/* GET X Hot Threads overall */
router.get("/hot-top", passport.authenticate("jwt", {session: false}), (req, res) => {
  Thread.find(
    { "alive": true }
  ).select(
    thread_list_default
  ).sort(
    { "thread_decay": -1 }
  ).limit(
    settings.creme_of_the_top_max
  ).exec((err, threads) => {
    if(err || !threads)
      res.json({ "success": false });
    else
      res.json({ "success": true, "doc": threads });
  });
});

/* GET thread based on shortid */
router.get("/:thread_id", passport.authenticate("jwt", {session: false}), (req, res) => {
  Thread.findOne({ "_id": req.params.thread_id, "alive": true }, (err, thread) => {
    if(err || !thread)
      res.json({ "success": false });
    else
      res.json({ "success": true, "doc": thread });
  });
});

/* POST new thread to board (User protected) */
router.post("/:board_slug/post", passport.authenticate("jwt", {session: false}), (req, res) => {
  // Check if user can post, Check last time user posted a thread
  if(utils.hasRequiredPriviledges(req.user.data.priviledges, ["can_post"])){
    Board.findOne({ "slug": req.params.board_slug, "active": true }, "_id", (err, board) => {
      if(err || !board){
        res.json({ "success": false, "error": 109 });
      }
      else{
        let newThread = new Thread({
          "board": board._id,
          "poster": {
            "name": req.user.data.username,
            "thumbnail": req.user.data.profile_pic.thumbnail,
            "id": req.user.data._id
          },
          "title": req.body.title,
          "text": req.body.text,
          "media": {
            "file": "/some/file.jpg",
            "size": "12 MB"
          },
          "reply_excerpts": []
        });
        Thread.create(newThread, (err, thread) => {
          if(err || !thread){
            res.json({ "success": false });
          }
          else{
            res.json({ "success": true, "doc": thread });
          }
        });
      }
    });
  }
  else{
    res.status(401).send("Unauthorized");
  }
});

/* GET thread's with specific related board ordered by relevance limit X */
router.get("/list/hot/:board_slug", passport.authenticate("jwt", {session: false}), (req, res) => {
  Board.findOne({ "slug": req.params.board_slug, "active": true }, "_id", (err, board) => {
    if(err || !board){
      res.json({ "success": false, "error": 105 });
    }
    else{
      Thread.find(
        { "board": board._id, "alive": true }
      ).select(
        thread_list_default
      ).sort(
        { "thread_decay": -1 }
      ).limit(
        settings.max_thread_search_resutls
      ).exec((err, threads) => {
        if(err || !threads)
          res.json({ "success": false });
        else
          res.json({ "success": true, "doc": threads });
      });
    }
  });
});

/* GET thread's with specific related board ordered by date limit X */
router.get("/list/new/:board_slug", passport.authenticate("jwt", {session: false}), (req, res) => {
  Board.findOne({ "slug": req.params.board_slug, "active": true }, "_id", (err, board) => {
    if(err || !board){
      res.json({ "success": false, "error": 105 });
    }
    else{
      Thread.find(
        { "board": board._id, "alive": true }
      ).select(
        thread_list_default
      ).sort(
        { "created_at": -1 }
      ).limit(
        settings.max_thread_search_resutls
      ).exec((err, threads) => {
        if(err || !threads)
          res.json({ "success": false });
        else
          res.json({ "success": true, "doc": threads });
      });
    }
  });
});

/* PUT update thread status to alive or dead */ //(GENERATES NOTIFICATION)
router.put("/kill/:board_slug/:thread_id", passport.authenticate("jwt", {session: false}), (req, res) => {
  // Check if user can kill thread
  if(utils.hasRequiredPriviledges(req.user.data.priviledges, ["delete_thread"])){
    Board.findOne({ "slug": req.params.board_slug, "active": true }, "_id", (err, board) => {
      if(err || !board){
        res.json({ "success": false, "error": 105 });
      }
      else{
        Thread.findOneAndUpdate({ "_id": req.params.thread_id },
        {
          "$set": {
            "alive": false
          }
        },
        { "new": true },(err, thread) => {
          if(err || !thread)
            res.json({ "success": false });
          else
            res.json({ "success": true });
        });
      }
    });
  }
  else{
    res.status(401).send("Unauthorized");
  }
});

/* POST search for a thread based on title and board */
router.post("/search", passport.authenticate("jwt", {session: false}), (req, res) => {
  Thread.find(
    { "$text": { "$search": req.body.query }, "board": req.body.board_id },
    { "score": { "$meta": "textScore"}}
  ).select(
    thread_list_default
  ).sort(
    { "score": { "$meta": "textScore" }}
  ).limit(
    settings.max_thread_search_resutls
  ).exec((err, threads) => {
    if(err || !threads){
      res.json({ "success": false });
    }
    else{
      res.json({ "success": true, "doc": threads });
    }
  });
});

//=================================================================================
//									--	REPLIES --
//=================================================================================

/* GET replies to a thread based on thread's id with subReply field */
router.get("/:thread_id/replies", passport.authenticate("jwt", {session: false}), (req, res) => {
  Reply.find({ "thread": req.params.thread_id, "visible": true }, (err, replies) => {
    if(err || !replies){
      res.json({ "success": false });
    }
    else{
      res.json({ "success": true, "doc": replies });
    }
  });
});

/* GET replies to a thread based on thread's shortid without subReply field */
router.get("/:thread_id/replies/nosub", passport.authenticate("jwt", {session: false}), (req, res) => {
  Reply.find({ "thread": req.params.thread_id, "visible": true }, { "replies": 0 }, (err, replies) => {
    if(err || !replies){
      res.json({ "success": false });
    }
    else{
      res.json({ "success": true, "doc": replies });
    }
  });
});

/* GET replies to a thread with limited subReplies on sight */
router.get("/:thread_id/replies/limit-sub", passport.authenticate("jwt", {session: false}), (req, res) => {
  Reply.find({ "thread": req.params.thread_id, "visible": true }, { "replies": { "$slice": [0,2] }}, (err, replies) => {
    if(err || !replies){
      res.json({ "success": false });
    }
    else{
      res.json({ "success": true, "doc": replies });
    }
  });
});

/* GET reply without subreplies based on id */
router.get("/replies/:reply_id/nosub", (req, res) => {
  Reply.findOne({ "_id": req.params.reply_id, "visible": true}, { replies: 0 }, (err, reply) => {
    if(err || !reply){
      res.json({ "success": false });
    }
    else{
      res.json({ "success": true, "doc": reply });
    }
  })
});

/* GET reply with subreplies based on id */
router.get("/replies/:reply_id", (req, res) => {
  Reply.findOne({ "_id": req.params.reply_id, "visible": true}, (err, reply) => {
    if(err || !reply){
      res.json({ "success": false });
    }
    else{
      res.json({ "success": true, "doc": reply });
    }
  });
});

/* POST a new reply to a thread based on shortid */ //(GENERATES NOTIFICATION)
router.post("/:thread_id/reply", passport.authenticate("jwt", {session: false}), (req, res) => {
  if(utils.hasRequiredPriviledges(req.user.data.priviledges, ["can_reply"])){
    Thread.findOne({ "_id": req.params.thread_id, "alive": true, "reply_count": { "$lt":settings.max_thread_replies }}, (err, thread) => {
      if(err || !thread){
        res.status(404).send("Thread Not Found");
      }
      else{
        let newReply = new Reply({
          "thread": thread._id,
          "poster": {
            "poster_name": req.user.data.username,
            "poster_thumbnail": req.user.data.profile_pic.thumbnail,
            "poster_id": req.user.data._id
          },
          "media": {
            "file": "/test/file.jpg",
            "thumbnail": "/test/thumbnail.png",
            "size": "10 MB"
          },
          "text": req.body.text,
          "replies": []
        });
        newReply.save((err, reply) => {
          // Add an excerpt if needed
          if(thread.reply_excerpts.length < settings.excerpts_per_thread){
            thread.reply_excerpts.push({
              "reply_id": reply._id,
              "poster_name": req.user.data.username,
              "poster_id": req.user.data._id,
              "poster_pic": req.user.data.profile_pic.thumbnail,
              "text_excerpt": reply.text.substring(0, settings.excerpts_substring)
            });
          }
          thread.reply_count += 1;
          thread.save((err) => {
            if(err){
              // If it failed let us delete the reply
              Reply.remove({ "_id": reply._id });
              res.json({ "success": false, "error": 108 });
            }
            else{
              // Notificate OP about reply if not OP
              if(req.user.data._id !== thread.poster.id){
                utils.CreateAndSendNotification(thread.poster.id, "New Thread Reply",
                  `${req.user.data.username} replied to your thread`, `/thread/replies/${reply._id}`);
              }
              // Return a successfull response
              res.json({ "success": true, "doc": reply });
            }
          });
        });
      }
    });
  }
  else{
    res.status(401).send("Unauthorized");
  }
});

/* POST a SubReply to a Reply */ //(GENERATES NOTIFICATION)
router.post("/:thread_id/replies/:reply_id/reply", passport.authenticate("jwt", {session: false}), (req, res) => {
  if(utils.hasRequiredPriviledges(req.user.data.priviledges, ["can_reply"])){
    Thread.findById(req.params.thread_id, "alive reply_count", (err, thread) => {
      if(err || !thread || !thread.alive || thread.reply_count >= settings.max_thread_replies){
        res.status(404).send("Thread Not Found");
      }
      else{
        Reply.findOne({ "_id": req.params.reply_id, "visible": true, "reply_count": { "$lt": settings.max_reply_subreplies }},
        (err, reply) => {
          if(err || !reply){
            res.json({ "success": false });
          }
          else{
            User.findById(req.body.to, "_id username profile_pic", (err, user) => {
              // Prepare 'to' field you can post on your own sub-replies with null
              let to = null;
              // If user isn't addressing himself (he is OP or it's his id) create 'to' field
              if(user != null && (!reply.poster.poster_id.equals(req.user.data._id) || !user._id.equals(req.user.data._id))){
                to = {
                  "poster_name": user.username,
                  "poster_thumbnail": user.profile_pic.thumbnail,
                  "poster_id": user._id
                };
              }
              else if(user == null && !req.user.data._id.equals(reply.poster.poster_id)){
                to = {
                  "poster_name": reply.poster.poster_name,
                  "poster_thumbnail": reply.poster.poster_thumbnail,
                  "poster_id": reply.poster.poster_id
                };
              }
              // Prepare subDoc
              let subReply = {
                "poster": {
                  "poster_name": req.user.data.username,
                  "poster_thumbnail": req.user.data.profile_pic.thumbnail,
                  "poster_id": req.user.data._id
                },
                "to": to,
                "media": {
                  "file": "/test/imaage.jpg",
                  "thumbnail": "/test/thumb.png",
                  "size": "27 MB"
                },
                "text": req.body.text
              };
              reply.update({ "$push": { "replies": subReply }, "$inc": { "reply_count": 1 }}, (err) => {
                if(err){
                  res.json({ "success": false });
                }
                else{
                  // Send notification
                  if(subReply.to != null)
                    utils.CreateAndSendNotification(subReply.to.poster_id, "New Reply",
                    `${req.user.data.username} replied to you.`, `/thread/replies/${reply._id}`);
                  res.json({ "success": true });
                }
              });
            });
          }
        });
      }
    });
  }
  else{
    res.status(401).send("Unauthorized");
  }
});

/* PUT update reply visibility */ //(GENERATES NOTIFICATION)
router.put("/replies/kill/:reply_id", (req, res) => {
  // Check if current user has permission to kill replies
  // Search reply and change visibility to false
  Reply.findOneAndUpdate({ "_id": req.params.reply_id },
  { "$set": {"visible": false} },
  (err, reply) => {
    if(err || !reply){
      res.json({ "success": false });
    }
    else{
      res.json({ "success": true });
    }
  });
});

/* PUT update subreply visibility */ //(GENERATES NOTIFICATION)
router.put("/replies/kill/:reply_id/:sreply_id", (req, res) => {
  // Check if current user has permission to kill subreplies
  // Search subreply and change visibility to false
  Reply.update({ "_id": req.params.reply_id },
  {"$pull": {"replies": { "_id": req.params.sreply_id }}},
  {"safe": true}, (err, reply) => {
    if(err || !reply){
      res.json({ "success": false });
    }
    else{
      res.json({ "success": true, "doc": reply });
    }
  });
});

module.exports = router;
