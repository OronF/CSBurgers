function siggner(req, res, next)
{
  if(isEmpty(req))
    return;
    
  if(validPhoneNumber(req.body.phoneNumber))
  {
      if(req.body.password === req.body.approvePassword)
      {
          if(req.body.password >= 8)
          {
              if(nameValidation(req.body.fname))
              {
                if(nameValidation(req.body.lname))
                {
                  res.cookie('signUpCookie', req.body.phoneNumber, { maxAge: 20  * 60  * 1000}); // Set cookie to expire in 20 minutes 
                  next();
                }
              }
          }
      }
  }
  return;
}

module.exports = siggner;