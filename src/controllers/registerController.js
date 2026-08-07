const RegisterModel = require("../models/RegisterModel");

exports.index = (req, res) => {
  res.render('register'); //vai renderizar esse template
};

exports.register = async (req, res) => {
  try {
    const register = new RegisterModel(req.body); //criando uma instância do model com os dados do formulário

    await register.cadastraBD(); //chamando o método cadastraBD do model

    if (register.errors.length > 0) {
      req.flash("errors", register.errors); //se tiver algum erro, vamos enviar os erros para o front-end
      return req.session.save(() => res.redirect("/register")); //salva a sessão e redireciona para a página de registro
    }

    req.flash("success", "Usuário cadastrado com sucesso!"); //se não tiver erros, vamos enviar uma mensagem de sucesso para o front-end
    return req.session.save(() => res.redirect("/register")); //salva a sessão e redireciona para a página de registro
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    res.render("404"); //renderiza a página de erro 404
  }
};

//O que for "post" aqui, nós queremos receber os dados do formulário, e então processar eles (valido ou não, se bate com o que está no banco de dados, etc)
