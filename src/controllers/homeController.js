const contatoModel = require('../models/ContatoModel.js');

exports.index = async (req, res) => {
    const userId = req.session.user._id; //obtendo o id do usuário logado da sessão
    const contatos = await contatoModel.buscaContatos(userId); //chamando a função buscaContatos do contatoModel para buscar os contatos no banco de dados
    //será aplicado o conteúdo como obj dentro de render
    //envia o array de contatos para index renderizar
    res.render('index', { contatos }); //vai renderizar esse template
    
}
    