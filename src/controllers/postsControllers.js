import fs from "fs";
import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModels.js";
import gerarDescricaoComGemini from "../services/geminiService.js";

const listarPosts = async (req, res) => {

    const posts = await getTodosPosts();
    res.status(200).json(posts);
}

const postarNovoPost = async (req, res) => {
    const novoPost = req.body;

    try {
        const postCriado = await criarPost(novoPost);
        res.status(201).json(postCriado);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
}

const uploadImagem = async (req, res) => {
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: "",
    };

    try {
        const postCriado = await criarPost(novoPost);
        const imagemAtualizada = `uploads/${postCriado.insertedId}.jpg`;
        fs.renameSync(req.file.path, imagemAtualizada);

        res.status(201).json(postCriado);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
}

const atualizarNovoPost = async (req, res) => {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.jpg`

    // criando o objeto que irá atualizar o post


    try {
        const imgBuffer = fs.readFileSync(`uploads/${id}.jpg`)
        const descricao = await gerarDescricaoComGemini(imgBuffer)

        const post = {
            imgUrl : urlImagem,
            descricao: descricao,
            alt: req.body.alt
        }

        const postAtualizado = await atualizarPost(id, post);
        
        res.status(202).json(postAtualizado);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
}

export { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost };