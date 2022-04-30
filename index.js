const { request } = require('express');
const { response } = require('express');
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
    
    const respuesta= await nuevoUsuario(parametros)    
    response.status(respuesta.mensaje? 500 : 201).json(respuesta.mensaje? respuesta.mensaje : respuesta )    
})

app.get('/usuarios', async (request, response)=>{
     
    const respuesta= await listaUsuarios()        
    response.status(respuesta.mensaje? 500 : 200).json(respuesta.mensaje? respuesta.mensaje : respuesta )
    
})

app.put('/usuario', async (request, response)=>{
    const {name, balance}= request.body
    const id= request.query.id
    const parametros={
        name, balance, id
    }
    const respuesta= await editarUsuario(parametros)
    response.status(respuesta.mensaje? 500 : 200).json(respuesta.mensaje? respuesta.mensaje : respuesta )   
})

app.delete('/usuario', async(request, response)=>{
    const id= request.query.id    
    const respuesta= await eliminarUsuario(id)
    response.status(respuesta.mensaje? 500 : 200).json(respuesta.mensaje? respuesta.mensaje : respuesta )     
})

app.use('/transferencia', (request, response, next)=>{
    const {emisor, receptor, monto}=request.body
    if (emisor === receptor) {
        response.status(500).json({mensaje: "El usuario emisor no puede ser el mismo receptor"})
        return false
    }
    next()
})

app.post('/transferencia',async (request, response)=>{
    const {emisor, receptor, monto}=request.body
    const fecha=  moment()
    const parametros={
        emisor, receptor, monto, fecha
    }
 
    const respuesta= await transferencia(parametros)
    console.log(respuesta)
    response.status(respuesta.mensaje? 500 : 201).json(respuesta.mensaje? respuesta.mensaje : respuesta )       
})

app.get('/transferencias', async (request, response)=>{    
    const respuesta= await listarTransf()
    response.status(respuesta.mensaje? 500 : 200).json(respuesta.mensaje? respuesta.mensaje : respuesta )      
})