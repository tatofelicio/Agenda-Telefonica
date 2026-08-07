const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

//objeto com a configuração dos dados que queremos
const RegisterSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

//é o que cria a verdadeira "Entidade de Banco de Dados". É ela quem diz: "Um registro de usuário tem email e senha"
const Register = mongoose.model("Register", RegisterSchema);

class RegisterModel {
  constructor(body) {
    this.body = body;
    this.errors = []; //se tive algum erro aqui dentro não vou poder cadastrar o usuário na base de dados
    this.user = null;
  }

    async cadastraBD() { //é async porque vamos usar o await dentro dele, e o await só pode ser usado dentro de funções async


    this.valida();
    if (this.errors.length > 0) return; //se tiver algum erro aqui dentro não vou poder cadastrar o usuário na base de dados

    //inserindo os dados no BD propriamente
    try {
      const salt = bcryptjs.genSaltSync(); //gerando um "sal" para a senha, que é uma forma de dificultar a quebra da senha
      this.body.password = bcryptjs.hashSync(this.body.password, salt); //criptografando a senha com o "sal" gerado acima
      this.user = await Register.create(this.body);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      this.errors.push("Erro ao criar usuário");
    }


  }

  async valida() {
    this.cleanUp(); //limpando os dados do formulário

    //o email precisa ser valido
    if (!validator.isEmail(this.body.email)) {
      this.errors.push("E-mail inválido");
    }

    //a senha precisa ter entre 3 e 50 caracteres
    if (!validator.isLength(this.body.password, { min: 3, max: 50 })) {
      this.errors.push("A senha precisa ter entre 3 e 50 caracteres");
    }

    //a confirmação da senha precisa ser igual à senha
    if (this.body.password !== this.body.confirmPassword) {
      this.errors.push("As senhas não coincidem");
    }

    //checando se o email já existe no banco de dados
    if (this.body.email && validator.isEmail(this.body.email)) {
      const userExists = await Register.findOne({ email: this.body.email });
      if (userExists) this.errors.push("E-mail já cadastrado");
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
      confirmPassword: this.body.confirmPassword,
    };
  }
}

module.exports = RegisterModel;
