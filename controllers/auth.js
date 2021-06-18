const { response, json } = require('express');
const Usuario= require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async (req, res = response )=>{

    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify(googleToken);

        // verificar si ya esta registrado ese correo en la bd de mongo
        const usuarioBD = await Usuario.findOne({email}); // buscar uno por el email

        let usuario;

        if ( !usuarioBD ) {
            // si no existe el usuario
            usuario =  new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        }else{
            // existe usuario
            usuario = usuarioBD;
            usuario.google =true;
        }

        // Guardar en DB
        await usuario.save();

        // Generar el TOKEN - JWT
        const token = await generarJWT( usuario.id );

        res.json({
            ok: true,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'Token incorrecto'
        })

    }


}

// genra un nuevo token
const renewToken = async (req, res = response )=>{

    const uid = req.uid;

    // Generar el TOKEN - JWT
    const token = await generarJWT( uid );

    res.json({
        ok: true,
        token
    })
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}