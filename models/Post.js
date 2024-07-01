const mongoose = require("mongoose")
const Schema = mongoose.Schema

const PostSchema = new Schema({
  nome: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  Date: {
    type: Date,
    default: Date.now()
  }
})

mongoose.model("posts", PostSchema )