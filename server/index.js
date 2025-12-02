const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const server = http.createServer(app);

// CORS configurado para producción
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000'];

const io = socketIo(server, {
  cors: {
    origin: (origin, callback) => {
      // Permitir conexiones sin origen (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'production') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Ruta del archivo de persistencia
const DATA_FILE = path.join(__dirname, 'datos.json');

// Almacenar estados de ánimo en memoria
let estadosAnimo = [];
let estadisticas = {
  muyFeliz: 0,
  feliz: 0,
  neutral: 0,
  triste: 0,
  muyTriste: 0
};

// Función para cargar datos desde el archivo JSON
async function cargarDatos() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const datos = JSON.parse(data);
    estadosAnimo = datos.estadosAnimo || [];
    actualizarEstadisticas();
    console.log('✅ Datos cargados desde', DATA_FILE);
    console.log(`📊 ${estadosAnimo.length} estados cargados`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // El archivo no existe, crear uno vacío
      await guardarDatos();
      console.log('📝 Archivo de datos creado');
    } else {
      console.error('❌ Error al cargar datos:', error.message);
    }
  }
}

// Función para guardar datos en el archivo JSON
async function guardarDatos() {
  try {
    const datos = {
      estadosAnimo: estadosAnimo,
      ultimaActualizacion: new Date().toISOString()
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(datos, null, 2), 'utf8');
    console.log('💾 Datos guardados');
  } catch (error) {
    console.error('❌ Error al guardar datos:', error.message);
  }
}

// Función para obtener iniciales
function obtenerIniciales(nombre) {
  if (!nombre || nombre.trim() === '') return 'AN';
  const partes = nombre.trim().split(' ');
  if (partes.length >= 2) {
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  }
  return nombre.substring(0, 2).toUpperCase();
}

// Función para generar un ID único basado en nombre
function generarIdUsuario(nombre) {
  // Si no hay nombre, usar timestamp + random
  if (!nombre || nombre.trim() === '') {
    return 'anon_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  // Si hay nombre, crear un hash simple
  const hash = nombre.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  return 'user_' + Math.abs(hash).toString(36);
}

// Función para actualizar estadísticas
function actualizarEstadisticas() {
  estadisticas = {
    muyFeliz: 0,
    feliz: 0,
    neutral: 0,
    triste: 0,
    muyTriste: 0
  };
  
  estadosAnimo.forEach(estado => {
    estadisticas[estado.nivel]++;
  });
}

// Cargar datos al iniciar el servidor
cargarDatos();

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Enviar estado actual al nuevo cliente
  socket.emit('estado-actual', {
    estados: estadosAnimo,
    estadisticas: estadisticas
  });

  // Recibir nuevo estado de ánimo
  socket.on('nuevo-estado', async (data) => {
    const { nombre, nivel } = data;
    const iniciales = obtenerIniciales(nombre);
    const idUsuario = generarIdUsuario(nombre);
    
    const nuevoEstado = {
      id: idUsuario, // Usar ID basado en nombre para persistencia
      nombre: nombre || 'Anónimo',
      iniciales: iniciales,
      nivel: nivel,
      timestamp: new Date().toISOString()
    };

    // Actualizar o agregar estado
    const indiceExistente = estadosAnimo.findIndex(e => e.id === idUsuario);
    if (indiceExistente !== -1) {
      estadosAnimo[indiceExistente] = nuevoEstado;
    } else {
      estadosAnimo.push(nuevoEstado);
    }

    actualizarEstadisticas();
    
    // Guardar en archivo
    await guardarDatos();

    // Emitir a todos los clientes
    io.emit('estado-actualizado', nuevoEstado);
    io.emit('estadisticas-actualizadas', estadisticas);
  });

  // Desconexión - NO eliminamos el estado para que persista
  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
    // Los estados se mantienen en el archivo JSON
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📁 Datos guardados en: ${DATA_FILE}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Orígenes permitidos: ${allowedOrigins.join(', ')}`);
});
