const mongoose = require('mongoose');
const validator = require('validator');

//objeto com a configuração dos dados que queremos
const ContatoSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    sobrenome: {type: String, required: false, default: ''},
    email: {type: String, required: false, default: ''},
    telefone: {type: String, required: false, default: ''},
    criadoEm: {type: Date, default: Date.now},
    idCriador: {type: String, required: true}
})

const Contato = mongoose.model('Contato', ContatoSchema);

class ContatoModel{
    constructor(body){
        this.body = body;
        this.errors = [];
        this.contato = null;
    }

    static async buscaPorId(id){
        const user = await Contato.findById(id); //devolve um unico contato
        return user;
    }

    static async buscaContatos(idCriador){
        const contatos = await Contato.find({ idCriador: idCriador }) //devolve um array de contatos
            .sort({ criadoEm: -1 }); //ordenando do mais recente para o mais antigo
        return contatos;
    }

    static async delete(id){
        if(typeof id !== "string") return;
        //esse _id é porque essa é a chave primaria do documento, que é gerada automaticamente pelo mongoDB,ou seja, é o elemento do bd 
        const contato = await Contato.findOneAndDelete({_id: id});
        return contato;
    }

    async cadastraBD(){
        this.valida();
        if(this.errors.length > 0) return;

        try {
            this.contato = await Contato.create(this.body);
        } catch (error) {
            console.error("Erro ao criar contato:", error);
            this.errors.push("Erro ao criar contato");
        }
    }


     valida() {
        this.cleanUp(); //limpando os dados do formulário

        if(!this.body.nome) this.errors.push("Nome é obrigatório");
        if(!this.body.email && !this.body.telefone) { this.errors.push("Pelo menos um contato precisa ser enviado: email ou telefone"); }
    
        //o email precisa ser valido
        if (!validator.isEmail(this.body.email)) {
          this.errors.push("E-mail inválido");
        }
    

        
      }
      cleanUp() {
        for (const key in this.body) {
          if (typeof this.body[key] !== "string") {
            this.body[key] = "";
          }
        }
        this.body = {
            nome: this.body.nome,
            sobrenome: this.body.sobrenome,
            email: this.body.email,
            telefone: this.body.telefone,
            idCriador: this.body.idCriador
        };
      }

      async update(id) {
        if (typeof id !== "string") return;
        this.valida();
        if (this.errors.length > 0) return;
        this.contato = await Contato.findByIdAndUpdate(id, this.body, { new: true });
      }
}

module.exports = ContatoModel;