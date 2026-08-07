exports.middlewareGlobal = (req, res, next) => {
    //servem para passar mensagens de erro e sucesso para as views
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    //servem para passar o usuário logado para as views
    res.locals.user = req.session.user;
    next();

}

exports.loginRequired = (req, res, next) => {
  if (!req.session.user) {
    req.flash('errors', 'Login Necessário!');
    return req.session.save(() => res.redirect('/'));
  }
  next();
};

exports.outroMiddware = (req, res, next) => {
    console.log('outro middware');
    next();
}

//criando middleware para chegar o crfs
exports.checkCsrfError = (err, req, res, next) => {
    if(err){
        return res.render('404');
    }
    next();
};

exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next()
};