const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuarioSchema = new Schema({
  nome: {
    type: String,
    required: true
  },
  eAdmin: {
    type: Number,
    default: 0
  },
  email: {
    type: String,
    required: true
  },
  senha: {
    type: String,
    required: true
  }
});

// Registra o modelo com o nome correto
mongoose.model("usuarios", UsuarioSchema);
