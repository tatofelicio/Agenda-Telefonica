import validator from 'validator';

export default class ValidaLogin {
    constructor() {
        this.form = document.querySelector('.form-login');
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
    let errors = [];

    if(!validator.isEmail(email.value)){
        errors.push('E-mail inválido (validação no frontend)');
    }

    if(!validator.isLength(senha.value, { min: 3, max: 50 })){
        errors.push('Senha precisa ter entre 3 e 50 caracteres (validação no frontend)');
    }

    return errors;
}
}