const express= require('express');
const { send } = require('process');
const {nuevoUsuario}= require('./consultas/consultas')
const app= express()
app.listen(3000,()=>{console.log('Servidor on')})

app.get('/', (request, response)=>{
    response.sendFile(`${__dirname}/index.html`)    
})

