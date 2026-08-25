//Importa a biblioteca express
import express, {Request,Response} from "express";

//Cria a aplicação express
const app = express();

//Cria a rota GET principal
app.get("/",(req, res)=>{
    res.send("Bem-Vindo Pessoal!")
});

//Inicia o servidor na porta 8080
app.listen(8080, () =>{
    console.log("Servidor iniciado na porta 8080: http://localhost:8080")
});