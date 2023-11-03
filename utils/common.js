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


function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role == '2')
      return next();
  res.redirect('/');
}

module.exports = {
  isAdmin,
  // isLoggedIn,
  getusername,
};
