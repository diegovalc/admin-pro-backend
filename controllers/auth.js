const { response, json } = require('express');
const Usuario= require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const login = async ( req, res = response)=>{

    const { email, password } = req.body;
    
    try {

        // verificar email
        const usuarioBD = await Usuario.findOne( { email } );
        console.log(usuarioBD);
        if (!usuarioBD){
            return res.status(404).json({
                ok: false,
                msg: 'Email no valido'
            });
        }

        // verificar contraseña
        const validPassword = bcrypt.compareSync( password, usuarioBD.password );
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no valida'
            });
        }

        // Generar el TOKEN - JWT
        const token = await generarJWT( usuarioBD.id );
        

        res.json({
            ok: true,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500),json({
            ok: true,
            msg: 'Error inesperado!'
        })
    }

}

module.exports = {
    login
}