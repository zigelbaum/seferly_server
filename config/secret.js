require("dotenv").config()

exports.config = {
  userDb:process.env.USER_DB,
  passDb:process.env.PASS_DB,
  tokenSecret:process.env.TOKENSECRET,
  adminId:process.env.ADMIN_ID
}

