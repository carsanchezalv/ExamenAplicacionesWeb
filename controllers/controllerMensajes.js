const mysql = require("mysql");
const config = require("../config");
const modelMensajes = require("../models/modelMensajes");
const modelUsuarios = require("../models/modelUsuarios");
const pool = mysql.createPool(config.mysqlConfig);
const mme = new modelMensajes(pool);
const mus = new modelUsuarios(pool);
const path = require("path");

class controllerMensajes {

    constructor() {}

    getMensajes(request, response, next) {
        mme.getMensajesUsuario(response.locals.userEmail, function(err, datos) {
            if(err) {
                let estilos = "<link rel='stylesheet' href='/css/index.css'>";
                response.status(200);
                response.render("index", { styles: estilos, numero: response.locals.numUsuario, nombre: response.locals.userName, errorMsg: err.message });
            }
            else {
                let estilos = "<link rel='stylesheet' href='/css/mensajes.css'>";
                let enc = "Mensajes de " + response.locals.userName;
                response.status(200);
                response.render("mensajes", { contador: datos.length, styles: estilos, numero: response.locals.numUsuario, datos: datos, nombre: response.locals.userName, encabezado: enc });
            }
        });
    }

    borrarMensajes(request, response, next) {
        console.log("hola")
        mme.borrarMensajes(request.params.idMensaje, function(err) {
            if(err) {
                let estilos = "<link rel='stylesheet' href='/css/index.css'>";
                response.status(200);
                response.render("index", { styles: estilos, numero: response.locals.numUsuario, nombre: response.locals.userName, errorMsg: err.message });
            }
            else {
                response.redirect("/mensajes");
            }
        })
    }

    getEnviarMensajes(request, response, next) {
        mus.getAllUsers(function(err, datos) {
            if(err) {
                let estilos = "<link rel='stylesheet' href='/css/index.css'>";
                response.status(200);
                response.render("index", { styles: estilos, numero: response.locals.numUsuario, nombre: response.locals.userName, errorMsg: err.message });
            }
            else {
                let estilos = "<link rel='stylesheet' href='/css/mensajes.css'>";
                let enc = "Mensajes de " + response.locals.userName;
                response.status(200);
                response.render("enviarMensajes", { contador: datos.length, styles: estilos, numero: response.locals.numUsuario, datos: datos, nombre: response.locals.userName, encabezado: enc });
            }
        });
    }

    postEnviarMensajes(request, response, next) {
        let texto = request.body.texto;
        let receptor = request.params.idReceptor;

        mme.postMensaje(response.locals.userEmail, texto, receptor, function(err, datos) {
            if(err) {
                let estilos = "<link rel='stylesheet' href='/css/index.css'>";
                response.status(200);
                response.render("index", { styles: estilos, numero: response.locals.numUsuario, nombre: response.locals.userName, errorMsg: err.message });
            }
            else {
                response.redirect("/mensajes");
            }
        });
    }

}

module.exports = controllerMensajes;