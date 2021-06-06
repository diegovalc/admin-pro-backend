const { response } = require('express');
const Hospital = require('../models/hospital');

const getHospitales = async ( req, res = response )=>{

    // llena la info de campo usuario con info usuario, se especifica el campo de hospital (usuarios) y luego los
    // campos que se quieren mostrar en este caso el campo nombre y campo img
    const hopsitales = await Hospital.find().populate('usuario', 'nombre img');


    res.json({
        ok: true,
        hopsitales
    })
}

const crearHospital = async ( req, res = response )=>{

    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });

    try {

        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const actualizarHospital = ( req, res = response )=>{

    res.json({
        ok: true,
        msg: 'actualizarHospital'
    })
}

const borrarHospital = ( req, res = response )=>{

    res.json({
        ok: true,
        msg: 'borrarHospital'
    })
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}