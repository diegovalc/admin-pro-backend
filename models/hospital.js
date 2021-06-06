const { Schema, model } = require('mongoose');

const HospitalSchema = new Schema({

    nombre:{
        type: String,
        required: true
    },
    img:{
        type: String,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
}, { collection: 'hospitales' }); // se cambia el nombre para que aparezca como hospitales en la bd

HospitalSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject(); // se extran los campos  __v, _id, password, del objeto
    return object;
})

module.exports = model( 'Hospital', HospitalSchema);