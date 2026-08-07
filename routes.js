const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const registerController = require('./src/controllers/registerController');
const contatoController = require('./src/controllers/contatoController');
const { loginRequired } = require('./src/middlewares/middleware');

//um exemplo de trabalho com middlewares é para salvar informações de um user

//pessoa tal tal tem email tal senha tal, é salvo então nas seções do usuarios/cookies

//as seções são salvas no server-side, cookies client-side


//rotas da home
//antes do home vou colocar um middleware para a rota fazer alguma coisa
//route.get('/home',homeController.index);

//rotas do login
route.get('/', loginController.index);
route.get('/login', loginController.index);
route.post('/login', loginController.login);
route.get('/login/logout', loginController.logout);

//rotas do register
route.get('/register',registerController.index);
route.post('/register',registerController.register);

//rotas de contato
route.get('/contato', loginRequired, contatoController.index);
route.post('/contato/register', loginRequired, contatoController.contatoCreate);
//aqui vamos usar parametro de url para modificar o contato cadastrado, usamos a url com a chave id 
route.get('/contato/:id', loginRequired, contatoController.contatoUpdateCreate);
route.post('/contato/update/:id', loginRequired, contatoController.contatoUpdate);
route.get('/contato/delete/:id', loginRequired, contatoController.contatoDelete);

// --- ROTAS PROTEGIDAS (Exigem Autenticação) ---
route.get('/home', loginRequired, homeController.index);

//exportando função para que possam ser executadas normalmente pelo server.js
module.exports = route;