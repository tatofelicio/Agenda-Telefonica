const ContatoModel = require('../models/ContatoModel.js');

exports.index = (req, res) => {
    res.render('contato', { contato: {} }); //vai renderizar esse template
}

exports.contatoCreate = async (req, res) => {
    try {
        const contato = new ContatoModel({ ...req.body, idCriador: req.session.user._id }); //criando uma instância do model com os dados do formulário
        await contato.cadastraBD();

        if (contato.errors.length > 0) {
            req.flash("errors", contato.errors);
            return req.session.save(() => res.redirect("/contato"));
        }
        
        req.flash("success", "Contato registrado com sucesso!");
        return req.session.save(() => res.redirect(`/contato/${contato.contato._id}`));
        
    } catch (error) {
        console.error("Erro ao registrar contato:", error);
        res.render('404').send("Erro ao registrar contato");
    }
}

exports.contatoUpdateCreate = async (req, res) => {
    if (!req.params.id) return res.render('404');
    
        const contato = await ContatoModel.buscaPorId(req.params.id);
        if (!contato) return res.render('404');
        res.render('contato', { contato }); //vai renderizar esse template
    }

exports.contatoUpdate = async (req, res) => {
    try{
        if (!req.params.id) return res.render('404');
    } catch (error) {
        console.error("Erro ao atualizar contato:", error);
        res.render('404').send("Erro ao atualizar contato");
    }
        
    }

exports.contatoDelete = async (req, res) => {
    try {
        if (!req.params.id) return res.render('404');
        const contato = await ContatoModel.delete(req.params.id);
        if (!contato) return res.render('404');
        req.flash("success", "Contato deletado com sucesso!");
        return req.session.save(() => res.redirect("/home"));
    } catch (error) {
        console.error("Erro ao deletar contato:", error);
        res.render('404').send("Erro ao deletar contato");
    }}
