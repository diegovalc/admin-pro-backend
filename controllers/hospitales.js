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

const actualizarHospital = async ( req, res = response )=>{

    const hospitalId = req.params.id;
    const uid = req.uid;

    try {

        const hospital = await Hospital.findById( hospitalId ); //verficiar si existe el hospital en la bd

        if ( !hospital ) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado por id'
            });
        }

        // se mete el nombre que viene en el body de la peticion en el hospital junto con el usuario que esta haciendo el cambio
        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const hosptialActualizado = await Hospital.findByIdAndUpdate( hospitalId, cambiosHospital, { new: true });


        res.json({
            ok: true,
            hospital: hosptialActualizado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })

    }
    


}

const borrarHospital = async ( req, res = response )=>{
    
    const hospitalId = req.params.id;

    try {

        const hospital = await Hospital.findById( hospitalId ); //verficiar si existe el hospital en la bd

        if ( !hospital ) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado por id'
            });
        }
  
        await Hospital.findByIdAndDelete( hospitalId );
  
        res.json({
            ok: true,
            msg: 'Hospital Elimanado'
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
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}