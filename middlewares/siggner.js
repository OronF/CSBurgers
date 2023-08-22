function admin (req, res, next) {
  //check client has user cookie
  console.log('admin middleware', req.cookies, req.url);

  if (req.url.indexOf('/branches') >= 0) {
    if (req.cookies.admin) {
      res.redirect('/manager/Managerbranches');
    } else {
      next();
    }
  } else if (req.url.indexOf('/menu') >= 0) {
    if (req.cookies.admin) {
      res.redirect('/manager/managerMenu');
    } else {
      next();
    }
  } if (req.url.indexOf('/delivery') >= 0) {
    if (req.cookies.admin) {
      res.redirect('/manager/Managerdelivery');
    } else {
      next();
    }
  }
  else {
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