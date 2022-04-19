const {Pool}= require('pg');
const pool= new Pool({
    user:"postgres",
    password:"leoney31",
    database:"bancosolar",
    host: "localhost",
    port: 5432
})

const nuevoUsuario=async(datos)=>{
    const datosUsuarios= Object.values(datos)
    const parametros={
        text:'INSERT INTO usuarios(nombre, balance) VALUES($1, $2) RETURNING*',     
        datosUsuarios        
    }

    try {
        const {rows}=await pool.query(parametros)
        return rows
    } catch (error) {
        console.log(error.message)
    }
}

module.exports={nuevoUsuario}