const mongoose = require("mongoose");
const validator = require("validator");
const bryptjs = require("bcryptjs");
require("./RegisterModel");

const Register = mongoose.model("Register");

class LoginModel {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async entrar() {
    this.valida();
    if (this.errors.length > 0) return;

    // 3. Agora você usa o Mongoose para fazer o acesso ao banco (Read)
    try {
      this.user = await Register.findOne({ email: this.body.email });

      if (!this.user) {
        this.errors.push("Usuário não cadastrado.");
        return;
      }

      if (!bryptjs.compareSync(this.body.password, this.user.password)) {
        this.errors.push("Senha incorreta.");
        this.user = null;
        return;
      }
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      this.errors.push("Erro interno ao validar login");
    }
  }

  valida() {
    this.cleanUp();

    // No login, validamos apenas se os formatos estão corretos (sem checar confirmPassword)
    if (!validator.isEmail(this.body.email)) {
      this.errors.push("E-mail inválido");
    }
    if (!validator.isLength(this.body.password, { min: 3, max: 50 })) {
      this.errors.push("Senha inválida");
    }
  }

  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== "string") {
        this.body[key] = "";
      }
    }
    this.body = {
      email: this.body.email,
      password: this.body.password,
    };
  }
}

module.exports = LoginModel;
