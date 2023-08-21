function admin (req, res, next) {
  //check client has user cookie
  console.log('admin middleware', req.cookies, req.url);

  if (req.url.indexOf('/branches') >= 0) {
    if (req.cookies.admin) {
      console.log('1');
      res.redirect('/manager/Managerbranches');
    } else {
      console.log('2');
      next();
    }
  } else {
    next();
  }
}

function auth (req, res, next) {
  //check client has user cookie
  console.log(req.cookies);

  if (!req.cookies.user && !req.cookies.admin) {
    if (req.url.indexOf('/api') >= 0) {
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

module.exports = { auth, admin };