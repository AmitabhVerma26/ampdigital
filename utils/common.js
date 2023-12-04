function getusername(user){
  var name = "";
  if(user.local.name){
      name = user.local.name
  }
  else if(user.google.name){
      name = user.google.name;
  }
  else if(user.twitter.displayName){
      name = user.twitter.displayName;
  }
  else if(user.linkedin.name){
      name = user.linkedin.name;
  }
  return name;
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  req.session.returnTo = req.baseUrl+req.url;
  res.redirect('/signin');
}

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role == '2')
      return next();
  res.redirect('/');
}

function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);
  var interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
      return interval + " years";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
      return interval + " months";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
      return interval + " days";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
      return interval + " hours";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
      return interval + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

module.exports = {
  isAdmin,
  isLoggedIn,
  getusername,
  timeSince
};
