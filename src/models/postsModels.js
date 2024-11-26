import "dotenv/config";
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbConfig.js";

const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

const getTodosPosts = async () => {
    const db = conexao.db("instalike");
    const colecao = db.collection("posts");
    
    // Retorna todos os posts no formato de Array
    return colecao.find().toArray();
}

const criarPost = async (post) => {
    const db = conexao.db("instalike");
    const colecao = db.collection("posts");

    return colecao.insertOne(post);
}

const atualizarPost = async (id, novoPost) => {
    const objId = ObjectId.createFromHexString(id)
    const db = conexao.db("instalike");
    const colecao = db.collection("posts");

    return colecao.updateOne({_id: new ObjectId(objId)}, {$set: novoPost});
}

export { getTodosPosts, criarPost, atualizarPost };