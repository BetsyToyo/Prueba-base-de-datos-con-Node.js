const {Pool}= require('pg');
const pool= new Pool({
    user:"postgres",
    password:"leoney31",
    database:"bancosolar",
    host: "localhost",
    port: 5432
})

const nuevoUsuario= async(datos)=>{
    const {nombre, balance}= datos
    const parametros={
        text:'INSERT INTO usuarios(nombre, balance) VALUES($1, $2) RETURNING*',     
        values: [nombre, balance]       
    }

    try {
        const { rows }=await pool.query(parametros)
        return rows
    } catch (error) {
        return { status: 'ERROR', mensaje: error.message }
    }
}

const listaUsuarios= async()=>{
    const consultaSql= 'SELECT * FROM usuarios'
    try {
        const { rows }=await pool.query(consultaSql)
        return rows
    } catch (error) {
       return { status: 'ERROR', mensaje: error.message }
    }
}

const editarUsuario= async(datos)=>{
    const {name, balance, id}= datos
    const parametros= {
        text:'UPDATE usuarios SET nombre= $1, balance= $2 WHERE id= $3 RETURNING*',
        values:[name, balance, id]
    }
    try {
        const { rows }= await pool.query(parametros)
        return rows
    } catch (error) {
        return { status: 'ERROR', mensaje: error.message }
    }
}

const eliminarUsuario= async (id)=>{    
    const sql= `DELETE FROM usuarios WHERE id=${id}`
    try {
        const { rows }= await pool.query(sql)
        return rows
    } catch (error) {
        return { status: 'ERROR', mensaje: error.message }
    }
}

const transferencia= async(datos)=>{
    const {emisor, receptor, monto, fecha}= datos    
   
    try {
        await pool.query('BEGIN');

        const idEmisor=await pool.query('SELECT id FROM usuarios WHERE nombre= $1',[emisor])
        const idReceptor=await pool.query('SELECT id FROM usuarios WHERE nombre= $1',[receptor])
        const paramTransfer={
            text: 'INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES($1, $2, $3, $4) RETURNING*',
            values:[idEmisor.rows[0].id, idReceptor.rows[0].id, monto, fecha],            
        }
       
        const paramUsuEnvia={
            text:'UPDATE usuarios SET balance = balance - $1 WHERE id=$2 RETURNING*',
            values: [monto, idEmisor.rows[0].id]
        }
        const paramUsuRecibe={
            text:'UPDATE usuarios SET balance= balance + $1 WHERE id=$2 RETURNING*',
            values: [monto, idReceptor.rows[0].id]
        }

        const transferencia= await pool.query(paramTransfer)
        const usuEnvia= await pool.query(paramUsuEnvia)
        const usuRecibe= await pool.query(paramUsuRecibe)

        await pool.query("COMMIT");
        return{status: 'OK', transferencia: transferencia.rows[0], envia: usuEnvia.rows[0], recibe: usuRecibe.rows[0]}
        
    } catch (error) {
        await pool.query("ROLLBACK");        
        return { status: 'ERROR', mensaje: error.message }
    }
}

const listarTransf= async()=>{
    const parametros= {
        text:`SELECT t.fecha, u.nombre, u2.nombre, monto
                FROM transferencias t 
                inner join usuarios u  on u.id = t.emisor
                inner join usuarios u2  on u2.id= t.receptor `,
        values:[],
        rowMode: 'array'
    }

    try {
        const { rows }= await pool.query(parametros)        
        return rows
    } catch (error) {
        return { status: 'ERROR', mensaje: error.message }
    }
}

module.exports={nuevoUsuario, listaUsuarios, editarUsuario, eliminarUsuario, transferencia, listarTransf}