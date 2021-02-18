"use strict"
const e = require("express");
const mysql = require("mysql");

class modelMensajes {
    constructor(pool) { this.pool = pool; }

    getMensajesUsuario(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT * FROM MENSAJES M JOIN USUARIO U ON U.EMAIL=M.ID_EMISOR WHERE M.ID_RECEPTOR = (?)",
                [email],
                function (err, rows) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if(rows.length == 0) 
                            callback(null, rows);

                        let datos = [];
                        
                        rows.forEach(e => {
                            let f_h = e.fecha_hora.toString().split(' ');
        
                            let hora_aux = f_h[4];
                                        
                            let dia = f_h[2];
                            let mes = f_h[1];
                            let anyo = f_h[3];

                            let fechaOrdenada = dia + "/" + mes + "/" + anyo;
                            let objeto = {
                                id_emisor: e.id_emisor,
                                id_receptor: e.id_receptor,
                                texto: e.texto,
                                id: e.id,
                                num_emisor: e.num_usuario,
                                nombre_emisor: e.nombre,
                                fecha: fechaOrdenada,
                                hora: hora_aux                                
                            }
                            datos.push(objeto);
                        });
                        
                        callback(null, datos);
                    }
                        
                });
            }
        });
    }

    postMensaje(emisor, texto, receptor, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                console.log(emisor)
                console.log(receptor)
                console.log(texto)
                connection.query("INSERT INTO MENSAJES (id_emisor, id_receptor, texto) VALUES(?, ?, ?)",
                [emisor, receptor, texto],
                function (err) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else
                        callback(null);
                });
            }
        });
    }

    borrarMensajes(mensaje, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("DELETE FROM MENSAJES WHERE ID = (?)",
                [mensaje],
                function (err) {
                    connection.release();
                    if (err) {
                        callback(new Error("Ha ocurrido un error al borrar el mensaje"));
                    }
                    else {
                        callback(null);
                    }
                });
            }
        });
    }
}


module.exports = modelMensajes;