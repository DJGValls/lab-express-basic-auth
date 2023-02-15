const router = require("express").Router();
const User = require("../models/User.model.js");
const bcrypt = require("bcryptjs");

// GET "/auth/signup"

router.get("/signup", (req, res, next) => {
  res.render("auth/signup-form.hbs");
});

// POST
router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.status(401).render("auth/signup-form.hbs", {
      errorMenssage: "Por favor, complete todos los campos",
    });
    return;
  }

  const passwordRegEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  if (passwordRegEx.test(password) === false) {
    res.status(401).render("auth/signup-form.hbs", {
      errorMenssage:
        "La contraseña ha de tener minimo 8 caracteres, una mayuscula, una minuscula y un caracter especial",
    });
    return;
  }

  try {

       //vamos a la BD y buscamos 1 usuario con ese username /email
    //          Buscame un usuario que tenga el username que me pasa el usuario
    //                                              ||
    const foundUser = await User.findOne({ username: username });
    // console.log(foundUser);
    if (foundUser !== null) {
      res.render("auth/signup-form.hbs", {
        errorMessage: "El usuario ya existe",
      });
      return;
    }



    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    await User.create({
        username: username,
        password: hashPassword
    })

    res.redirect("/auth/login");


  } 
  catch (error) {
    next(error) 
  }

});

// GET "/auth/login"
router.get("/login" , (req,res,next) =>{

  res.render("auth/login-form.hbs")

})

router.post("/login" , async (req,res,next)=>{

  const {username , password} = req.body

  if (username === "" || password === "") {
    res.render("auth/login-form.hbs", {
      errorMessage: "Todos los campos deben estar rellenos",
    });
    return; // detiene la ejecucion de la funcion
  }

  try {

    const foundUser = await User.findOne({ username: username });
    if (foundUser === null) {
      res.render("auth/login-form.hbs", {
        errorMessage: "Usuario no registrado",
      });
      return; // detiene la ejecucion de la funcion
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password
    );
    console.log(isPasswordCorrect);

    if (isPasswordCorrect === false) {
      res.redirect("/auth/login-form.hbs", {
        errorMessage: "Usuario con contraseña incorrecta",
      });
      return;
    }

    req.session.activeUser = foundUser; 
    
    req.session.save(() => {
      
      res.redirect("/profile");
    });
    
  } catch (error) {
    next (error)
  }

})

// GET "/auth/logout" => Cerrar / destruir la sesion del usuario
router.get("/logout" , (req,res,next)=>{
  req.session.destroy(()=>{
      res.redirect("/auth/login")
  })
})




module.exports = router;
