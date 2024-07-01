//carregando modulos
const bodyParser = require("body-parser");
const express = require("express");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const admin = require("./routes/admin");
const app = express();
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
require("./models/postagem");
const postagem = mongoose.model("postagens");
require("./models/Post");
const Post = mongoose.model("posts");
const usuarios = require("./routes/usuario");
const Passport = require("passport");
require("./config/auth")(Passport);
//configurações
//sessão
app.use(
  session({
    secret: "PedroEstaAprendendoNodeJs",
    resave: true,
    saveUninitialized: true,
  }));
app.use(Passport.initialize());
app.use(Passport.session())
app.use(flash());
//midleware
app.use(async (req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error")
  res.locals.user = req.user || null;
  next();
});
//body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//handlebars
app.engine(
  "handlebars",
  handlebars.engine({
    defaultLayout: "main",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set("view engine", "handlebars");
//mongoose
mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost/blogappjs")
  .then(() => {
    console.log("MongoDBServer iniciado com sucesso");
  })
  .catch((err) => {
    console.log("erro ao tentar iniciar o MongoDBServer " + err);
  });
//public
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  console.log("midlerware!");
  next();
});

//rotas

app.get("/Postagem/:slug", (req, res) => {
  postagem
    .findOne({ slug: req.params.slug })
    .then((postagem) => {
      if (postagem) {
        res.render("postagem/index", { postagem: postagem });
      } else {
        req.flash("error_msg", "houve um erro");
        res.redirect("/");
      }
    })
    .catch((err) => {
      req.flash("error_msg", "houve um erro");
      res.redirect("/");
    });
});

app.get("/categorias", (req, res) => {
  Post.find()
    .then((posts) => {
      res.render("categorias/index", { categorias: Post });
    })
    .catch((err) => {
      req.flash("error_msg", "houve um erro");
      res.redirect("/");
    });
});

app.get("/categorias/:slug", (req, res) => {
  Post.findOne({ slug: req.params.slug })
    .then((post) => {
      if (post) {
        postagem
          .find({ categoria: post._id })
          .then((postagens) => {
            res.render("categorias/postagens", {
              postagens: postagem,
              categoria: Post,
            });
          })
          .catch((err) => {
            req.flash("error_msg", "houve um erro");
            res.redirect("/");
          });
      } else {
        req.flash("error_msg", "houve um erro");
        res.redirect("/");
      }
    })
    .catch((err) => {
      req.flash("error_msg", "houve um erro");
      res.redirect("/");
    });
});

app.get("/", (req, res) => {
  postagem
    .find()
    .populate("Post")
    .sort({ data: "desc" })
    .then((postagens) => {
      res.render("index");
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro");
      res.redirect("/404");
    });
});

app.use("/", admin);

app.get("/brazil", (req, res) => {
  postagem
    .find()
    .populate("Post")
    .sort({ data: "desc" })
    .then((postagens) => {
      res.render("indexBrazil", { postagens: postagens });
    })
    .catch((err) => {});
});

app.use("/brazil", admin);

app.get("/404", (req, res) => {
  res.send("Erro 404!");
});

app.use("/usuarios", usuarios);

//outros
const PortListen = process.env.PortListen || 8089;
app.listen(PortListen, () => {
  console.log("AppServer rodando");
});
