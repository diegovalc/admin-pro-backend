const { Schema, model, models } = require('mongoose');

const MedicoSchema = new Schema({

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
    },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    }
}); 

MedicoSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject(); // se extran los campos  __v, _id, password, del objeto
    return object;
})

module.exports = model( 'Medico', MedicoSchema);