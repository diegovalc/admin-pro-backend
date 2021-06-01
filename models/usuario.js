const { Schema, model, models } = require('mongoose');

const UsuarioSchema = new Schema({

    nombre:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    password:{
        type: String,
        require: true
    },
    img:{
        type: String,
    },
    role:{
        type: String,
        require: true,
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