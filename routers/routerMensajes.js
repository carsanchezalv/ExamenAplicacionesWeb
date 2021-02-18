const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mysql = require("mysql");
const config = require("../config");
router.use(bodyParser.urlencoded({ extended: true }));
const controllerMensajes = require("../controllers/controllerMensajes");
const modelMensajes = require("../models/modelMensajes");
const pool = mysql.createPool(config.mysqlConfig);
const modelUsuarios = require("../models/modelUsuarios");
const mus = new modelUsuarios(pool);
const mme = new modelMensajes(pool);
const cme = new controllerMensajes();

function identificacionRequerida(request, response, next) {
    if (request.session.currentUser !== undefined) {
        response.locals.userEmail = request.session.currentUser;

        mus.getUserImageName(response.locals.userEmail, function(err, result){
            if (err) {
                console.log(err.message); 
            }
            else {
                let nombre = result[0].nombre;
                response.locals.userName = nombre;
                let numero = result[0].num_usuario;
                response.locals.numUsuario = numero;
            }
            next();
        })
    }
    else
        response.redirect("/loginout/login");
}

router.get("/", identificacionRequerida, cme.getMensajes);
router.get("/enviar", identificacionRequerida, cme.getEnviarMensajes);
router.post("/enviar/:idReceptor", identificacionRequerida, cme.postEnviarMensajes);
router.get("/borrar/:idMensaje", identificacionRequerida, cme.borrarMensajes);


module.exports = router;