const { type } = require('express/lib/response')
const { required } = require('nodemon/lib/config')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const usuario = new Schema({
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
    required
  },
  senha: {
    type: String,
    required: true
  }
})

mongoose.model("usuarios", usuario)