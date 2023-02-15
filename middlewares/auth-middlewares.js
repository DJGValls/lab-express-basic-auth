const isLoggedIn = (req, res, next) => {
    if (req.session.activeUser === undefined) {
      res.redirect("/auth/login")
    } else {
      next() // next sin argumentos significa continua con las rutas
    }
  }
  

  
  module.exports = {
    isLoggedIn: isLoggedIn,

  }
  
  // module.exports = {
  //   isLoggedIn,
  //   isAdmin
  // }