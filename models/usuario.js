const { Schema, model, models } = require('mongoose');

const UsuarioSchema = new Schema({

    nombre:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    img:{
        type: String,
    },
    role:{
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google:{
        type: Boolean,
        default: false
    }

});

UsuarioSchema.method('toJSON', function(){
    const { __v, _id, password, ...object } = this.toObject(); // se extran los campos  __v, _id, password, del objeto
    object.uid = _id; // se agrega el campo _id al objeto pero con el nombre uid
    return object;
})

module.exports = model( 'Usuario', UsuarioSchema);