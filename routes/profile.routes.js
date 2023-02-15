const express = require('express');
const router = express.Router();

const {isLoggedIn} = require("../middlewares/auth-middlewares.js") 

router.get("/", isLoggedIn, (req,res,next)=>{

    res.render("profile/private.hbs")

})



module.exports = router;