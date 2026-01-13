const express = require("express")
const bcrypt = require("bcryptjs")
const db = require("../db")
const auth = require("../middleware/auth")
const { v4: uuid } = require("uuid")

const router = express.Router()

router.post("/", auth(["ADMIN"]), async (req, res) => {
  db.get("SELECT COUNT(*) as total FROM users", async (_, row) => {
    if (row.total >= 8)
      return res.status(400).json({ msg: "Máximo 8 usuarios" })

    const password = await bcrypt.hash(req.body.password, 10)

    db.run(
      "INSERT INTO users VALUES (?, ?, ?, ?)",
      [uuid(), req.body.username, password, "USER"],
      () => res.json({ msg: "Usuario creado" })
    )
  })
})

module.exports = router
