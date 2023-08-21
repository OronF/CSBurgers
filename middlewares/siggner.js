function auth (req, res, next) {
  //check client has user cookie
  console.log(req.cookies);

  if (!req.cookies.user && !req.cookies.admin) {
    if (req.url.indexOf('/api/user') >= 0) {
      next();
    } else {
      res.redirect('/logInPage');
    }
      return;
  }
  else {
    next(); 
  }
}

module.exports = { auth };