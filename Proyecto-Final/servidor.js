const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;
const fsPromises = require('fs').promises;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//?Endpoint para el login
app.post('/login', async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;
    const usuariosPath = path.join(__dirname, 'json', 'usuarios.json');
    console.log('Ruta de usuarios.json:', usuariosPath);  // Agregamos este log
    const usuariosData = await fsPromises.readFile(usuariosPath, 'utf-8');
    const usuariosObj = JSON.parse(usuariosData);
    const usuarios = usuariosObj.usuarios;

    const usuarioRegistrado = usuarios.find(user => user.nombre === usuario && user.contrasena === contrasena);

    if (usuarioRegistrado) {
      res.cookie('nombreUsuario', usuarioRegistrado.nombre);
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al leer el archivo de usuarios' });
  }
});

//?Endpoint para ver los movimientos
app.get('/movimientos', async (req, res) => {
  try {
    const movimientosPath = path.join(__dirname, 'json', 'banco.json');
    const movimientosData = await fsPromises.readFile(movimientosPath, 'utf-8');
    const movimientos = JSON.parse(movimientosData);

    const nombreUsuario = req.cookies.nombreUsuario;

    const usuariosPath = path.join(__dirname, 'json', 'usuarios.json');
    const usuariosData = await fsPromises.readFile(usuariosPath, 'utf-8');
    const usuarios = JSON.parse(usuariosData);

    const reclamacionesPath = path.join(__dirname, 'json', 'reclamaciones.json');
    const reclamacionesData = await fsPromises.readFile(reclamacionesPath, 'utf-8');
    const reclamaciones = JSON.parse(reclamacionesData);

    const usuario = usuarios.usuarios.find(u => u.nombre === nombreUsuario);

    if (usuario && usuario.tipo === 'administrador') {
      res.json({ success: true, movimientos: movimientos.movimientos, reclamaciones: reclamaciones.reclamaciones });
    } else if(usuario && usuario.tipo === 'promotor'){
      const movimientosFiltrados = movimientos.movimientos.filter(movimiento => {
        return nombreUsuario === 'promotor' || movimiento.promotor === nombreUsuario;
      });
      res.json({ success: true, movimientos: movimientosFiltrados });
    }else if(usuario && usuario.tipo === 'banco'){
      const movimientosFiltrados = movimientos.movimientos.filter(movimiento => {
        return nombreUsuario === 'banco' || movimiento.banco === nombreUsuario;
      });
      res.json({ success: true, movimientos: movimientosFiltrados });
    }else{
      const movimientosFiltrados = movimientos.movimientos.filter(movimiento => {
        return nombreUsuario === 'cliente' || movimiento.nombre === nombreUsuario;
      });
      res.json({ success: true, movimientos: movimientosFiltrados });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al leer el archivo de movimientos' });
  }
});

//?Endpoint para ver las reclamaciones
app.get('/reclamaciones', async (req, res) => {
  try {
    const nombreUsuario = req.cookies.nombreUsuario;

    const usuariosPath = path.join(__dirname, 'json', 'usuarios.json');
    const usuariosData = await fsPromises.readFile(usuariosPath, 'utf-8');
    const usuarios = JSON.parse(usuariosData);

    const usuario = usuarios.usuarios.find(u => u.nombre === nombreUsuario);

    if (usuario && usuario.tipo === 'administrador') {
      const reclamacionesPath = path.join(__dirname, 'json', 'reclamaciones.json');
      const reclamacionesData = await fsPromises.readFile(reclamacionesPath, 'utf-8');
      const reclamaciones = JSON.parse(reclamacionesData);

      res.json({ success: true, reclamaciones: reclamaciones.reclamaciones });
    } else {
      res.status(403).json({ error: 'Acceso no autorizado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al leer el archivo de reclamaciones' });
  }
});

//?Endpoint para guardar las reclamaciones
//! No funciona
app.post('/guardar-reclamacion', async (req, res) => {
  try {
      const reclamacionesPath = patSin(__dirname, 'json', 'reclamaciones.json');

      let reclamacionesData;
      try {
          reclamacionesData = await fsPromises.readFile(reclamacionesPath, 'utf-8');
      } catch (readError) {
          await fsPromises.writeFile(reclamacionesPath, '{"reclamaciones": []}', 'utf-8');
          reclamacionesData = '{"reclamaciones": []}';
      }

      const reclamacionesObj = JSON.parse(reclamacionesData);

      const nuevaReclamacion = {
          nombre: req.body.nombre,
          reclamacion: req.body.reclamacion,
          descripcion: req.body.descripcion,
      };

      const reclamacionesArray = reclamacionesObj.reclamaciones || [];

      reclamacionesArray.unshift(nuevaReclamacion);

      reclamacionesObj.reclamaciones = reclamacionesArray;

      await fsPromises.writeFile(reclamacionesPath, JSON.stringify(reclamacionesObj, null, 2));

      res.json({ success: true });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al guardar la reclamación' });
  }
});


app.get('/public', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/movimientos-page', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'movimientos.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor Express en ejecución en http://localhost:${PORT}`);
});
