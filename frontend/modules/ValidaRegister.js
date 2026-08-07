import validator from 'validator';

export default class ValidaRegister {
    constructor() {
        this.form = document.querySelector('.form-register');
        this.eventos();
    }

    eventos() {
        if (this.form) {
            this.form.addEventListener('submit', e => {
                e.preventDefault();
                const errors = this.valida(e);
                if (errors.length > 0) {
                    alert(errors.join('\n'));
                } else {
                    alert('Formulário enviado! validação no frontend');
                    this.form.submit(); // Envia o formulário se não houver erros
                }
            });
        }
}
    valida(e){
        const el = e.target;
        const email = el.querySelector('input[name="email"]');
        const senha = el.querySelector('input[name="password"]');
        const senha2 = el.querySelector('input[name="confirmPassword"]');
        let errors = [];

        if(!validator.isEmail(email.value)){
            errors.push('E-mail inválido (validação no frontend)');
        }
        if(senha.value.length < 3 || senha.value.length > 50){
            errors.push('Senha precisa ter entre 3 e 50 caracteres (validação no frontend)');
        }
        if(senha.value !== senha2.value){
            errors.push('As senhas não coincidem (validação no frontend)');
        }
        return errors;
    }
}