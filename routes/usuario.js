const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/usuario")
const Usuario = mongoose.model("usuarios")
const bcrypt = require("bcryptjs")
const Passport = require('passport')

router.get("/registro", (req, res) => {
  res.render("usuarios/registro")
})

router.post("/registro", (req, res) => {
  var erros = []

  if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
    erros.push({texto: "Nome inválido"})
  }

  if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
    erros.push({texto: "E-mail inválido"})
  }

  if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
    erros.push({texto: "Senha inválida"})
  }

  if(req.body.senha.length < 4){
    erros.push({texto: "senha pequena"})
  }

  if(req.body.senha != req.body.senha2){
    erros.push({texto: "Senhas deferentes"})
  }

  if(erros.length > 0){

    res.render("usuarios/registro", {erros: erros})

  }else{
    Usuario.findOne({email: req.body.email}).then((usuario) => {
      if(usuario){
        req.flash("error_msg", "e-mail igual de outra pessoa")
        res.redirect("/usuarios/registro")
      }else{

        const novoUsuario = new Usuario({
          nome: req.body.nome,
          email: req.body.email,
          senha: req.body.senha
        })

        bcrypt.genSalt(10, (erro, salt) => {
          bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {

            if (erro){
              req.flash("error_msg", "tente criar a conta novamente para que a senha não mostre para ninguem")
            }
            
            novoUsuario.senha = hash
            novoUsuario.save().then(() => {
              req.flash("error_msg", "usuario criado com sucesso")
            }).catch((err) => {
              req.flash("error_msg", "tente criar a conta novamente para que salve a conta")
              res.redirect("/usuarios/registro")
            })

          })
        })

      }
    }).catch((err) => {
      req.flash("error_msg", "houve um erro interno")
      res.redirect("/")
    })
  }

})

router.get("/login", (req, res) => {
  res.render("usuarios/login")
})

router.post("/login", (req, res, next) => {
  Passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/usuarios/login",
    failureFlash: true
  })(req, res, next)

})

router.get("/logout", (req, res) => {

  req.logout()
  req.flash("success_msg", "deslogado com sucesso")
  res.redirect("/")


})


module.exports = router;