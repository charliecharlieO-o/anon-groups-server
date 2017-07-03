// Import required dependencies for media upload
const multer = require("multer");
// Import models required for notification
const Notification = require("../models/notification");
const User = require("../models/user");
// Import system configurations
const settings = require("./settings");

//=================================================================================
//									--	ALGORITHMS --
//=================================================================================

// Check user priviledge (not social priviledge)
const priviledgeCheck = (priviledgeList, requiredPriviledges) => {
  for(let i = 0; i < requiredPriviledges.length; i++){
    if(!priviledgeList.includes(requiredPriviledges[i])){
      return false;
    }
  }
  return true;
};

// Hot ranking algorithm - Source from Reddit translated to JS
const log10 = (value) => {
  return Math.log(value) / Math.LN10;
};

const secondsf = (date) => {
  const epoch = new Date(1970, 1, 1);
  const td = date.getTime() - epoch.getTime();
  return Math.abs(td/1000);
};

const signf = (score) => {
  if(score > 0){
    return 1;
  }
  if(score < 0){
    return -1;
  }
  return 0;
};

const hotAlgorithm = (ups, downs, date) => {
  const score = ups - downs;
  const order = log10(Math.max(Math.abs(score), 1));
  const sign = signf(score);
  const seconds = secondsf(date) - 1134028003;
  const result = sign * order + seconds / 45000;
  return Math.round(Math.pow(10, 7) * result) / Math.pow(10, 7);
};

// Safely parse JSON with try catch
const parseJSON = (json, callback) => {
  let parsed;
  try{
    parsed = JSON.parse(json);
    return callback(null, parsed);
  }
  catch(e){
    return callback(e, null);
  }
};

//=================================================================================
//									--	Notifications --
//=================================================================================

// Create a new notification
const createAndSendNotification = (owner_id, title, description, url, callback) => {
  // Create the notification in the database and up user notification count
  let notification = new Notification({
    "owner": owner_id,
    "title": title,
    "description": description,
    "reference_url": url
  });
  Notification.create(notification, (err, notification) => {
    if(typeof callback === 'function'){
      User.findOneAndUpdate({ "_id": owner_id }, { "$inc": { "new_notifications": 1 }}); // Increment notification counter
      return callback(err, notification);
    }
    else{
      return (err == null);
    }
  });
};

//=================================================================================
//									--	MULTER --
//=================================================================================

// Multer storage object
const storage = multer.diskStorage({
  "destination": function(req, file, cb){
    cb(null, __dirname + "../public/media/");
  },
  "filename": function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
    });
  }
});
// Utility function/middleware to upload a media file
const uploadMediaFile = multer({
  "storage": storage,
  "limits": {"fileSize": settings.max_upload_size, "files": 1}, // 8 MB max size
  "fileFilter": function(req, file, cb){
    if(settings.allowed_file_types.includes(path.extension(file.originalname))){
      cb(null, true);
    }
    else{
      return cb(new Error("Wrong file format"));
    }
  }
});

module.exports = {
  "hasRequiredPriviledges": priviledgeCheck,
  "HotAlgorithm": hotAlgorithm,
  "CreateAndSendNotification": createAndSendNotification,
  "ParseJSON": parseJSON,
  "UploadMediaFile": uploadMediaFile
};
