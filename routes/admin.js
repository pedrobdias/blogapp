const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Post");
const post = mongoose.model("posts");
require('../models/postagem')
const postagem = mongoose.model("postagens")
const { eAdmin } = require("../helpers/eAdmin")

eAdmin

router.get("/admin", eAdmin, function (req, res) {
  res.render("admin/index");
});

router.get("/posts", eAdmin, function (req, res) {
  post
    .find()
    .then((posts) => {
      res.render("admin/posts", { posts: posts });
    })
    .catch((err) => {
      req.flash("error_msg", "erro vou te mostra qual erro: " + err);
      res.redirect("/admin");
    });
});

router.get("/posts/add", eAdmin, function (req, res) {
  res.render("admin/addposts");
});

router.post("/posts/add", eAdmin, function (req, res) {
  var erros = [];

  if (
    !req.body.nome ||
    typeof req.body.nome == undefined ||
    req.body.nome == null
  ) {
    erros.push({ texto: "nome invalido" });
  }

  if (
    !req.body.slug ||
    typeof req.body.slug == undefined ||
    req.body.slug == null
  ) {
    erros.push({ texto: "slug invalido" });
  }

  if (erros.length > 0) {
    res.render("views/admin/addposts", { erros: erros });
  }

  const novoPost = {
    nome: req.body.nome,
    slug: req.body.slug,
  };

  new post(novoPost)
    .save()
    .then(() => {
      console.log("salvo com sucesso");
      req.flash("success_msg", "Post criado com sucesso!");
      res.redirect("/posts");
    })
    .catch((err) => {
      req.flash("error_msg", "Erro ao criar post: " + err);
      res.redirect("/posts");
    });
});

router.get("/post/edit/:id", eAdmin, (req, res) => {
  post
    .findOne({ _id: req.params.id })
    .then((post) => {
      res.render("admin/editpost", { post: post });
    })
    .catch((err) => {
      req.flash("error_msg", "Este post não existe:" + err);
      res.redirect("/posts");
    });
});

router.post("/post/edit", eAdmin, (req, res) => {
  post
    .findOne({ _id: req.body.id })
    .then((post) => {
      console.log(post);
      post.nome = req.body.nome;
      post.slug = req.body.slug;

      post.save().then(() => {
        req.flash("success_msg", "sucesso");
        res.redirect("/posts");
      });
    })
    .catch((err) => {
      req.flash("error_msg", "houve um erro: " + err);
      res.redirect("/posts");
    });
});

router.post("/post/deletar", eAdmin, (req, res) => {
  post.findByIdAndDelete({ _id: req.body.id })
    .then(() => {
      req.flash("success_msg", "Deletado");
      res.redirect("/posts");
    })
    .catch((err) => {
      req.flash("error_msg", "houve um erro " + err);
      res.redirect("/posts");
    });
});

router.get("/postagens", eAdmin, (req, res) => {

  postagem.find().populate("categoria").sort({data:"desc"}).then((postagens) => {
    res.render("admin/postagens", {postagens: postagens})
  }).catch((err) => {
    req.flash("error_msg", "houve um erro: " + err)
  })
});

router.get("/postagens/add", eAdmin, (req, res) => {
  res.render("admin/addpostagem");
});

router.post("/postagens/nova", eAdmin, (req, res) => {

    var erros = []

    if(req.body.post == "0"){
      erros.push({errormsg: "coloque uma categoria, não vejo nenhuma categoria no momento"})
    }

    if(erros.length > 0){
      res.render("views/admin/addpostagem", { erros: erros });
    }else{
      const novaPostagem = {
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        conteudo: req.body.conteudo,
        categoria: req.body.categoria,
        slug: req.body.slug
      }

      new postagem(novaPostagem).save().then(() => {
        req.flash("success_msg", "criado")
        res.redirect("/postagens")
      }).catch((err) => {
        req.flash("error_msg", "tente novamente")
        res.redirect("/postagens")
      })

    }
      

});

router.get("/postagens/edit/:id", eAdmin, (req, res) => {

  postagem.findOne({_id: req.params.id}).then((postagem) => {

      post.find().then((post) => {
        res.render("admin/editpostagens", {categoria: categoria, postagem: postagem})
      }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect("/admin/postagens")
      })

  }).catch((err) => {
    req.flash("error_msg", "Houve um erro. Olhe o erro que pode ter sido você ou um erro comun: " + err)
    res.redirect("/admin/postagens")
  })


  res.render("admin/editpostagens")
})

router.post("/postagem/edit", eAdmin, (req, res) => {

  postagem.findOne({_id: req.body.id}).then((post) => {

    postagem.titulo = req.body.titulo
    postagem.slug = req.body.slug
    postagem.descricao = req.body.descricao
    postagem.conteudo = req.body.conteudo
    postagem.categoria = req.body.categoria

    postagem.save(ofdfdfdfa).then(() => {
      req.flash("success_msg", "editada")
      res.redirect("/admin")
    }).catch((errormenssagem) => {
      req.flash("error_msg", "houve um erro: This error is common this error was because salvation gave an error so the error was sent")
    })

  })

})

router.get("/erros/pag", eAdmin, (req, res) => {
  res.render("admin/errospag");
})

router.get("/postagem/tutorial", eAdmin, (req, res) => {
  res.render("admin/tutoriais")
})

module.exports = router;