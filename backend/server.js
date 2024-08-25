const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'libreria'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL connectado exitosamente');
});

// Middleware
app.use(cors());
app.use(bodyParser.json());


// Metodo GET por ID-USUARIO
app.post('/getUsuario', (req, res) => {
    const { usuario, contraseña } = req.body;

    let sql = 'SELECT * FROM usuario WHERE usuario = ? AND contraseña = ?';
    db.query(sql, [usuario, contraseña], (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        if (results.length > 0) {
            res.status(200).json(true);
        } else {
            res.status(401).json(false); 
        }
    });
});

//Metodo POST-USUARIO
app.post('/postUsuario', (req, res) => {
    const { name, lastname, user, email, password } = req.body;
    let sql = 'INSERT INTO usuario (usuario, contraseña, nombre, apellido, email) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [user, password, name, lastname, email], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ msg: 'Error saving user' });
        }
        res.json({ id: result.insertId, user, name, lastname, email });
    });
});

//Metodo PUT-USUARIO
app.put('/putUsuario', (req, res) => {
    const { contraseña, usuario } = req.body;
    try {
        let sql = 'UPDATE usuario SET contraseña = ? WHERE usuario = ?';
        db.query(sql, [contraseña, usuario], (err, results) => {
            if (err) {
                console.error('Error al ejecutar la consulta:', err);
                return res.status(500).json({ error: 'Error en el servidor' });
            }

            if (results.affectedRows > 0) {
                res.status(200).json(true);
            } else {
                res.status(404).json(false); 
            }
        });
        
    } catch (error) {
        console.error('Error al encriptar la contraseña:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

//////////////////////////////////////////////////////////////////////////////////

//Metodo POST-lIBROS
app.post('/postLibro', (req, res) => {
    const { title, author, gender, date, price} = req.body;
    let sql = 'INSERT INTO libros (titulo, autor, genero, fecha_de_publicacion, precio) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [title, author, gender, date, price], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ msg: 'Error saving user' });
        }
        res.json({ id: result.insertId, title, author, gender, date, price });
    });
});

//Metodo PUT-LIBROS
app.put('/putLibro', (req, res) => {
    const {aTitulo, aAutor, aGenero, aFecha, aPrecio} = req.body;
    try {
        let sql = 'UPDATE libros SET titulo =?, autor =?, genero =?, fecha_de_publicacion =?, precio =?  WHERE titulo =?';
        db.query(sql, [aTitulo, aAutor, aGenero, aFecha, aPrecio, aTitulo], (err, results) => {
            if (err) {
                console.error('Error al ejecutar la consulta:', err);
                return res.status(500).json({ error: 'Error en el servidor' });
            }

            if (results.affectedRows > 0) {
                res.status(200).json(true);  
            } else {
                res.status(404).json(false); 
            }
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

//Metodo DELETE-LIBROS
app.post('/deleteLibro', (req, res) => {
    const { aTitulo } = req.body;

    let sql = 'SELECT * FROM libros WHERE titulo = ?';
    db.query(sql, [aTitulo], (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        if (results.length === 0) {
            res.status(401).json(false); 
        }
        else {
            const libro = results [0];
            const idlibro = libro.id;

            try {
                let sql = 'DELETE FROM libros WHERE id = ?';
                db.query(sql, [ idlibro ], (err, results) => {
                    if (err) {
                        console.error('Error al ejecutar la consulta:', err);
                        return res.status(500).json({ error: 'Error en el servidor' });
                    }
                    
                    if (results.affectedRows > 0) {
                        res.status(200).json(true);
                    } else {
                        res.status(404).json(false);
                    }
                });

            } catch (error) {
                console.error('Error al encriptar la contraseña:', error);
                res.status(500).json({ error: 'Error en el servidor' });
            }
        }
           
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



