//arquivo de configuração do webpack

//importando modulo node path para trabalhar com caminhos

const path = require('path'); //CommonJS(padrão do node)

//todo arquivo js no node é um módulo específico

//exportando para que possa ser usado

//esse objeto vai ser a configuração do webpack
module.exports = {
    mode: 'production',
    entry: './frontend/main.js',
    output: {
        path: path.resolve(__dirname, 'public','assets','js'),
        filename: 'bundle.js'
    }, //bundle é o arquivo modificado para ser lido pelo navegador
    module: {
        rules: [{
            exclude: /node_modules/,
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/env']
                }
            }
            
        },
        {
        test: /\.css$/, // Se o arquivo terminar com .css
        use: ['style-loader', 'css-loader'] // Use esses dois caras
        }]
    },
    devtool: 'source-map'
};

