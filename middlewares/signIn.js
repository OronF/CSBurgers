function admin (req, res, next) {
  //check client has user cookie
  console.log('admin middleware', req.cookies, req.url);

  if (req.url.indexOf('/branches') >= 0) {
    if (req.cookies.admin) {
      res.redirect('/manager/Managerbranches');
    } else {
      next();
    }
  } 
  
  else if (req.url.indexOf('/menu') >= 0) {
    if (req.cookies.admin) {
      res.redirect('/manager/managerMenu');
    } else {
      next();
    }
  } 
  
  else if (req.url.indexOf('/delivery') >= 0) {
    if (req.cookies.admin) {
      res.redirect('/manager/Managerdelivery');
    } else {
      next();
    }
  } 

  else if (req.url.indexOf('/manager/Managerbranches') >= 0) {
    if(req.cookies.admin) {
      next();
    } else {
      res.render('error');
    }
  } 

  else if (req.url.indexOf('/manager/managerMenu') >= 0) { 
    if(req.cookies.admin) {
      next();
    } else {
      res.render('error');
    }
  }

  else if (req.url.indexOf('/manager/Managerdelivery') >= 0) { 
    if(req.cookies.admin) {
      next();
    } else {
      res.render('error');
    }
  }

  else if (req.url.indexOf('/manager/graphs') >= 0) { 
    if(req.cookies.admin) {
      next();
    } else {
      res.render('error');
    }
  }

  else {
    next();
  }
}

function auth (req, res, next) {
  //check client has user cookie
  console.log(req.cookies);
  console.log('admin middleware', req.cookies, req.url);

  if (!req.cookies.user && !req.cookies.admin) {
    if (req.url.indexOf('/api') >= 0) {
      next();
    } else {
      res.redirect('/logInPage');
    }
      return;
  }
  else {
    if (req.url.indexOf('/logout') >= 0) 
    {
      if (req.cookies.user) {
        res.clearCookie('user');
        res.redirect('/');
      }
      if (req.cookies.admin) {
        res.clearCookie('admin');
        res.redirect('/');
      }
    } else {
      next();
    } 
  }
}

module.exports = { auth, admin };