const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const posterSchema = new Schema({
	poster_name: { type: String, required: true },
	poster_thumbnail: { type: String, required: true },
	poster_id: { type: Schema.ObjectId, required: true }
},{ "_id": false });

const subReply = new Schema({
	poster: posterSchema,
	to: posterSchema,
	media: {
		name: { type: String },
		location: { type: String },
		mimetype: { type: String },
		size: { type: Number },
		thumbnail: { type: String }
	},
	removed: { type: Boolean, required: true, default: false },
	text: { type: String, required: true, maxlength: 200 }
});

const replySchema = new Schema({
	thread: { type: Schema.ObjectId, required: true, index: true },
	poster: posterSchema,
	media: {
		name: { type: String },
		location: { type: String },
		mimetype: { type: String },
		size: { type: Number },
		thumbnail: { type: String }
	},
	removed: { type: Boolean, required: true, default: false },
	text: { type: String, required: true, maxlength: 500 },
	reply_count: { type: Number, required: true, default: 0 },
	replies: [ subReply ]
}, { timestamps: { "createdAt": "created_at", "updatedAt": "updated_at" } });

module.exports = mongoose.model("Reply", replySchema);
