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
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    await User.create({
        username: username,
        password: hashPassword
    })

    res.redirect("auth/login");


  } 
  catch (error) {
    next(error) 
  }

});

module.exports = router;
