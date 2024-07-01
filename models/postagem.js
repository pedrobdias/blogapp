const { request } = require("express");
const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const postagem = new Schema({
  titulo: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  descricao: {
    type: String,
    required: true
  },
  conteudo: {
    type: String,
    required: true
  },
  categoria: {
    type: Schema.Types.ObjectId,
    ref: "posts",
    required: true
  },
  Data: {
    type: Date,
    default: Date.now()
  }
})

mongoose.model("postagens", postagem)