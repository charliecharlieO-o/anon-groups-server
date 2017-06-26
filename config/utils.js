// Import notification
const Notification = require("../models/notification");

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
      return callback(err, notification);
    }
    else{
      return (err == null);
    }
  });
};

module.exports = {
  "hasRequiredPriviledges": priviledgeCheck,
  "HotAlgorithm": hotAlgorithm,
  "CreateAndSendNotification": createAndSendNotification,
  "ParseJSON": parseJSON
};
