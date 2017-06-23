const express = require("express");
const shortid = require("shortid");
const passport = require("passport");
const router = express.Router();

//MODELS
const Board = require("../models/board");
const User = require("../models/user");

const settings = require("../config/settings"); // Site configurations
const utils = require("../config/utils"); //System utils

// Include passport module as passport strategy
require("../config/passport")(passport);

const board_list_default = "_id slug name short_name last_activity";

/* POST create new board */
router.post("/", passport.authenticate("jwt", {session: false}), (req, res) => {
	if(utils.hasRequiredPriviledges(req.user.data.priviledges, ["create_board"])){
		let newBoard = new Board({
			"slug": shortid.generate(),
			"name": req.body.name,
			"short_name": req.body.short_name,
			"description": req.body.description,
			"created_by": {
				"name": req.user.data.username,
				"id": req.user.data._id
			}
		});
		Board.create(newBoard, (err, board) => {
			if(err){
				// Check for validation errors
				res.json({ "success": false });
			}
			else{
				//Return successful board creation
				res.json({ "success": true, "doc": board });
			}
		});
	}
	else{
		res.status(401).send("Unauthorized");
	}
});

/* GET specific board by slug */
router.get("/:board_slug", passport.authenticate("jwt", {session: false}), (req, res) => {
	// Simple get of a board
	Board.findOne({ "slug": req.params.board_slug, "active": true }, (err, board) => {
		if(err){
			res.json({ "success": false });
		}
		else if(!board){
			res.status(404).send();
		}
		else{
			res.json({ "success": true, "doc": board });
		}
	});
});

/* GET the short_name's of all boards */
router.get("/list/short", passport.authenticate("jwt", {session:false}), (req, res) => {
	Board.find({ "active": true }, "short_name name slug", {"sort":{"short_name":1}}, (err, boards) => {
		if(err){
			res.json({ "success": false });
		}
		else{
			res.json({ "success": true, "doc": boards });
		}
	});
});

/* PUT edit specific board */
router.put("/:board_slug", passport.authenticate("jwt", {session: false}), (req, res) => {
	// Check user is allowed to update board
	if(utils.hasRequiredPriviledges(req.user.data.priviledges, ["edit_board"])){
		// Preprocess and clean data
		const json_data = JSON.parse(req.body.object);
		Board.findOneAndUpdate({ "slug": req.params.board_slug },
		{
			"$set":{
				"name": json_data.name,
				"short_name": json_data.short_name,
				"description": json_data.description,
				"active": json_data.active
			}
		}, { "new": true }, (err, board) => {
			if(err || !board){
				res.json({ "success": false });
			}
			else{
				res.json({ "success": true });
			}
		});
	}
	else{
		res.status(401).send("Unauthorized");
	}
});

/* DELETE board */
router.delete("/:board_slug", passport.authenticate("jwt", {session: false}), (req, res) => {
	// Check if user is allowed to delete board
	if(utils.hasRequiredPriviledges(req.user.data.priviledges, ["delete_board"])){
		Board.deleteOne({ "slug": req.params.board_slug }, (err) => {
			if(err){
				res.json({ "success": false });
			}
			else{
				res.json({ "success": true });
			}
		});
	}
	else{
		res.status(401).send("Unauthorized");
	}
});

/* GET newest boards */
router.get("/list/new", passport.authenticate("jwt", {session: false}), (req, res) => {
	Board.find({ "active": true }, board_list_default,
	{
		"limit": settings.max_board_search_count,
		"sort": {
			"created_at": -1
		}
	}, (err, boards) => {
		if(err){
			res.json({ "success": false });
		}
		else{
			res.json({ "success": true, "doc": boards });
		}
	});
});

/* PUT delete admin from board
router.put("/:board_slug/admins/remove", passport.authenticate("jwt", {session: false}), (req, res) => {
	// Check if user can update and remove admins
	// Preprocess and clean data
	Board.update({ "slug": req.params.board_slug },
	{ "$pull": {"admins":{"_id":req.body.admin_reg_id }}},
	{ "safe": true }, (err, board) => {
		if(err || !board){
			res.json({ "success": false });
		}
		else{
			res.json({ "success": true, "doc": board });
		}
	});
});*/

module.exports = router;
