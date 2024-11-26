import express from "express";
import multer from "multer";
import { atualizarNovoPost, listarPosts, postarNovoPost, uploadImagem } from "../controllers/postsControllers.js";
import cors from "cors"

const corsOptions = {
    origin: "http://localhost:8000", // rota do front-end por onde chegarão as requisições
    optionsSuccsessStatus: 200
}


// configuração do multer para salvar as imagens, com os seus respectivos nomes definidos, em sistemas Windows. Em ambientes Linux ou Mac, esse código não é necessário (código pronto)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const upload = multer({ dest: "./uploads" , storage}) // Em ambientes Windows, a pasta precisa ser criada antes. Em sistemas Linux ou Mac, se a pastar "uploads" não existir, o multer cria

// rota para listar todos os posts
const routes = (app) => {

    // habilitando o uso de json
    app.use(express.json());

    app.use(cors(corsOptions))
    
    app.get("/posts", listarPosts);
    app.post("/posts", postarNovoPost);
    app.post("/upload", upload.single("imagem"), uploadImagem) // como o multer é um middleware, ele fica entre a rota e o controller
    app.put("/upload/:id", atualizarNovoPost)
}

export default routes;