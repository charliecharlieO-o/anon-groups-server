const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  owner: { type: Schema.ObjectId, required: true },
  title: { type: String, required: true },
	description: { type: String, required: true },
  reference_url: { type: String, required: false, default: null, index: true },
  seen: { type: Boolean, required: true, default: false },
  date_seen: { type: Date, default: null }
}, { timestamps: { "createdAt": "date_alerted" }});

module.exports = mongoose.model("Notification", notificationSchema);
