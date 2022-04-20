const express= require('express');
const moment= require('moment')
const {nuevoUsuario, listaUsuarios, editarUsuario, eliminarUsuario, transferencia, listarTransf}= require('./consultas/consultas');
const app= express();
app.use(express.json());
app.listen(3000,()=>{console.log('Servidor on')});

app.get('/', (request, response)=>{
    response.sendFile(`${__dirname}/index.html`)    
});

app.post('/usuario',async(request, response)=>{
    const {nombre, balance}= request.body
    const parametros={
        nombre, balance
    }
    try {
       const respuesta= nuevoUsuario(parametros)
       response.json(respuesta).status(201)
    } catch (error) {
        console.log(error.message)
        response.status(500)
    }
})

app.get('/usuarios', async (request, response)=>{
    try {
       const respuesta= await listaUsuarios()        
       response.json(respuesta).status(200)
    } catch (error) {
        console.log(error.message)
        response.status(500)
    }
})

app.put('/usuario', async (request, response)=>{
    const {name, balance}= request.body
    const id= request.query.id
    const parametros={
        name, balance, id
    }
    try {
        const respuesta= editarUsuario(parametros)
        response.json(respuesta).status(201)
    } catch (error) {
        console.log(error.message)
        response.status(500)
    }
})

app.delete('/usuario', async(request, response)=>{
    const id= request.query.id
    try {
        const respuesta= await eliminarUsuario(id)
        response.json(respuesta).status(200)
    } catch (error) {
        console.log(error.message)
        response.status(500)
    }
})

app.post('/transferencia',async (request, response)=>{
    const {emisor, receptor, monto}=request.body
    const fecha=  moment()
    const parametros={
        emisor, receptor, monto, fecha
    }
    try {
        const respuesta= transferencia(parametros)
        response.json(respuesta).status(201)
    } catch (error) {
        console.log(error.message)
        response.status(500)
    }
})

app.get('/transferencias', async (request, response)=>{
    try {
        const respuesta= await listarTransf()
        response.json(respuesta).status(200)
    } catch (error) {
        console.log(error.message)
        response.status(500)
    }
})