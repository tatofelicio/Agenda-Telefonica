//escodendo dados confidenciais

//Carrega variáveis secretas (como senhas do banco de dados) de um arquivo .env para que elas não fiquem expostas no código público.
require('dotenv').config();

const express = require('express');
const app = express();

//fazendo primeira conexão com a base de dados Tenta conectar ao MongoDB.
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTIONSTRING)
    .then(() => {

        app.emit('pronto')
    }
    )
    .catch(e => console.log(e)
    );

    //session e MongoStore: Configuram a "memória" do servidor para lembrar quem está logado. Em vez de salvar isso na memória RAM (que apaga se o servidor reiniciar), o MongoStore salva as sessões dos usuários direto no banco de dados.
const session = require('express-session');
const MongoStore = require('connect-mongo').default

//Permite mandar mensagens rápidas de erro ou sucesso que somem sozinhas (como "Usuário cadastrado com sucesso").
const flash = require('connect-flash');

const routes = require('./routes')
const path = require('path');

//o csrf injeta um token na sessão para identificar o usuário e evitar hackers
//Ativa aquele "escudo" de cabeçalhos HTTP, protegendo contra vulnerabilidades conhecidas.
const helmet = require('helmet');
const csrf = require('csurf');


const { middlewareGlobal, checkCsrfError ,csrfMiddleware , outroMiddware } = require('./src/middlewares/middleware')

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        // Mantém as regras padrão de segurança...
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        // ...mas abre uma exceção para o Bootstrap
        "script-src": ["'self'", "https://cdn.jsdelivr.net"],
      },
    },
  })
);

//Permite que o servidor entenda dados enviados por formulários (sem isso, o req.body fica vazio).
app.use(express.urlencoded(
    { extended: true }))

//Libera a pasta public para o navegador acessar diretamente (é aqui que você coloca suas imagens, CSS puro e JavaScript do Front-end).
app.use(express.static(path.resolve(__dirname, 'public')));

const sessionOptions = session({
    secret: 'aula15',
    store: MongoStore.create({mongoUrl: process.env.CONNECTIONSTRING}),
    resave: false,
    saveUninitialized: false,
    //tempo de duração da sessão/cookie
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly:true
    }
})
app.use(sessionOptions);
app.use(flash());


//Diz ao servidor: "Nossas telas HTML estão na pasta 'views' e nós vamos usar o EJS para renderizá-las".
app.set('views', path.resolve(__dirname, 'src', 'views'))
app.set('view engine', 'ejs');


//posto nessa aula '\'
//Ativa a geração de tokens de segurança.
app.use(csrf());

//middlewares
//quero enviar para todas as paginas um csrf token
//(middlewareGlobal, checkCsrfError, routes): Aqui você está colocando os Middlewares na "linha de montagem". Toda requisição vai passar primeiro pelas suas validações de segurança, depois vai receber o token CSRF, e só no final vai cair nas routes (suas rotas, como /register ou /login).
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(outroMiddware);
app.use(routes);


//quando tiver pronto vai executar a função
//O servidor fica esperando aquele aviso lá do passo 1. Quando ele escuta o evento 'pronto', ele executa o app.listen(3000). Isso liga a "antena" do servidor na porta 3000, garantindo que ninguém consiga acessar o seu site antes de o banco de dados estar 100% conectado.

app.on('pronto', () => {
    app.listen(3000, () => {
        console.log('acessar http://localhost:3000');

        console.log('servidor executando na porta 3000');
        // então a conexão só vai ocorrer quando o banco estiver conectado
    });
})


