const { response } = require('express');
const Medico = require('../models/medico');

const getMedicos = async ( req, res = response )=>{

    const medicos = await Medico.find()
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre img') ;

    res.json({
        ok: true,
        medicos
    })
}

const crearMedico = async ( req, res = response )=>{

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    })

    try {

        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB
        })
        
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

    

    
}

const actualizarMedico = async ( req, res = response )=>{

    const medicoId = req.params.id;
    const uid = req.uid;

    try {

        const medico = await Medico.findById( medicoId ); //verficiar si existe el hospital en la bd

        if ( !medico ) {
            return res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por id'
            });
        }

        // se mete el nombre que viene en el body de la peticion en el hospital junto con el usuario que esta haciendo el cambio
        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate( medicoId, cambiosMedico, { new: true });


        res.json({
            ok: true,
            medico: medicoActualizado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })

    }

}

const borrarMedico = async ( req, res = response )=>{

    const medicoId = req.params.id;

    try {

        const medico = await Medico.findById( medicoId ); //verficiar si existe el hospital en la bd

        if ( !medico ) {
            return res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por id'
            });
        }

        await Medico.findByIdAndDelete( medicoId );

        res.json({
            ok: true,
            msg: 'Medico eliminado'
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })

    }
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}