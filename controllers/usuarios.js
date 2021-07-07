const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res)=>{

    const desde = Number(req.query.desde) || 0; //si viene vacio el parametro desde que ponga cero
    console.log(desde);

    // const usuarios = await Usuario.find( {}, 'nombre email role google ')// campos a mostra
    //                                 .skip(desde)// se salte los registros que tiene la variable desde 
    //                                 .limit( 5 ); // establece cuantos registros quiere desde la posicion de la variabled desde

    // const total = await Usuario.count();


    // realiza las dos operaciones al mismo tiempo y cuando termine manda el resultado del primer parametro de promise
    // a la variable usuarios y el segundo parametro a total
    const [ usuarios, total ] = await Promise.all([
        Usuario.find( {}, 'nombre email role google img')// campos a mostra
                .skip(desde)// se salte los registros que tiene la variable desde 
                .limit( 5 ),// establece cuantos registros quiere desde la posicion de la variabled desde
        
        Usuario.countDocuments() // cuenta los registros de usuarios
    ])

    res.json({
        ok: true,
        usuarios,
        total
    })

}

const crearUsuario = async (req, res = response)=>{

    const { email, password } = req.body;


    try {
        const existeEmail = await Usuario.findOne({email});

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            });
        }

        const usuario = new Usuario( req.body ); // crea una instancia del esquema usuario

        // encriptar contraseña
        const salt =  bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt);

        await usuario.save(); // graba en la bd de mongo el usuario y espera que termine para seguir con el codigo
    
        // Generar el TOKEN - JWT
        const token = await generarJWT( usuario.id );

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar log'
        })
    } 

}

const actualizarUsuario = async (req, res = response) =>{
    
    // TODO: validar token y comprobar si es el usuario correcto 

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );
        console.log('usuarioDB', usuarioDB);
        if ( !usuarioDB ) {
            console.log('usuarioDB no encontrado');
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            })
        }

        // Actualizaciones
        const { password, google, email, ...campos } = req.body; // se extraen los campos password, google, email,  del objeto campos

        if (usuarioDB.email !== email) {
            
            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }
        
        if ( !usuarioDB.google ) {
            campos.email = email;
        }else if( usuarioDB.email !== email){
            return res.status(400).json({
                ok: false,
                msg: 'Usuario de google no pueden cambiar su correo'
            });
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true });
 
        res.json({
            ok: true,
            usuario: usuarioActualizado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}  

const borrarUsuario = async (req, res = response)=>{

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );
     
        if ( !usuarioDB ) {
            console.log('usuarioDB no encontrado');
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            })
        }

        await Usuario.findByIdAndDelete( uid );

        res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado'
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Error inesperado!'
        })
    }
  
}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}