const { response } = require('express');

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const getTodo = async (req, res = response)=>{

    const busqueda = req.params.busqueda;

    const regex = new RegExp( busqueda, 'i'); //funcion para hacer insensible la busqueda con la variable busqueda

    const [ usuarios, medicos, hospitales ] = await Promise.all([
        Usuario.find( { nombre: regex } ),
        Medico.find( { nombre: regex } ),
        Hospital.find( { nombre: regex } )
    ])

    res.json({
        ok: true,
        usuarios,
        medicos,
        hospitales
    })
}

const getDocumentosColeccion = async (req, res = response)=>{

    const busqueda = req.params.busqueda;
    const tabla = req.params.tabla;

    const regex = new RegExp( busqueda, 'i'); //funcion para hacer insensible la busqueda con la variable busqueda

    let data = [];

    switch (tabla) {
        case 'medicos':
            data = await Medico.find( { nombre: regex } )
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre img');
            
            break;
        case 'hospitales':
            data = await Hospital.find( { nombre: regex } )
                                    .populate('usuario', 'nombre img');
            break;
        case 'usuarios':
            data = await Usuario.find( { nombre: regex } );
                            
            break;
    
        default:
            return res.status(400).json({
                ok: false,
                msg: 'la tabla tiene que ser medicos/hospitales/usuarios'
            })
    }

    res.json({
        ok: true,
        resultados: data
    })
}

const getMedicosById = async ( req, res = response)=>{

    const id = req.params.id;

    const medicos = await Medico.find().where( { hospital: { _id: id } } );

    res.json({
        ok: true,
        medicos
    })

}


module.exports = {
    getTodo,
    getDocumentosColeccion,
    getMedicosById
}