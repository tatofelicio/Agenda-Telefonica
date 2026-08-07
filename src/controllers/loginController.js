const LoginModel = require("../models/LoginModel.js");

//criando o documento index
exports.index = (req, res) => {
  //será aplicado o conteúdo como obj dentro de render
  if (req.session.user) {
    return res.redirect('/home');
  }
  return res.render("login");
};

//O que for "post" aqui, nós queremos receber os dados do formulário, e então processar eles (valido ou não, se bate com o que está no banco de dados, etc)
exports.login = async (req, res) => {
  try {
    const login = new LoginModel(req.body);
    await login.entrar(); // Esse método faz a busca lá dentro do Model!

    if (login.errors.length > 0) {
      req.flash("errors", login.errors);
      return req.session.save(() => res.redirect("/login"));
    }

    req.session.user = login.user;
    req.flash("success", "Você entrou no sistema!");
    return req.session.save(() => res.redirect("/home"));
  } catch (e) {
    console.error("Erro ao processar login:", e);
    res.render("404");
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};
