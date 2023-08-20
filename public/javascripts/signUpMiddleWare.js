
signUpMiddleWare.use(siggner);

function validPhoneNumber(number)
{
    for(let i = 0; i<number.length; i++)
    {
        if(isNaN(number[i]))
        return false;
    }


        $(document).ready(function() {
      
          const checkIfExists = (data) => {
              data.forEach(phoneNumber => {
                  if(phoneNumber === number)
                    return false;
              });
          }
      
          $.ajax({
              url:"/api/user",
              method: "GET",
              success: (data) => {
                  checkIfExists(data);
                  console.log("success");

              },
              error: (error) => {
                  console.log(error);
              }
          });
      });
    
    return true;
}

function checkField(inp)
{
  if(inp === "")
  {
    return true;
  }
  return false;
}

function isEmpty(req)
{
  if(checkField(req.body.phoneNumber))
    return true;
    if(checkField(req.body.fname))
    return true;
  if(checkField(req.body.lname))
    return true;
  if(checkField(req.body.password))
    return true;
  if(checkField(req.approvePassword))
    return true;
  return false;
}


function nameValidation(name)
{
    if(name.length < 2 || name.length > 10)
    {
        return false;
    }
    
    for (let i = 0; i < name.length; i++) {
        const charCode = name.charCodeAt(i);
        
        // Check if the character is a valid Hebrew letter
        if (charCode < 1488 || charCode > 1514) {
            return false;
        }
    }

    return true;
}


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