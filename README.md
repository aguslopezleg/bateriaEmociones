# 🔋 Batería de Estado de Ánimo

Una aplicación web en tiempo real donde los usuarios pueden seleccionar su estado de ánimo y ver las estadísticas actualizadas instantáneamente.

## 🚀 Características

- ⚡ Actualización en tiempo real con Socket.io
- 🎨 Interfaz moderna y atractiva
- 📊 Estadísticas en tiempo real
- 👤 Muestra iniciales de usuarios
- 🔋 Batería visual para seleccionar estado de ánimo

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn

## 🛠️ Instalación

1. Instala todas las dependencias:
```bash
npm run install-all
```

O manualmente:
```bash
npm install
cd server && npm install
cd ../client && npm install
```

## 🎯 Uso

1. Inicia el servidor y el cliente simultáneamente:
```bash
npm run dev
```

O por separado:
```bash
# Terminal 1 - Servidor
npm run server

# Terminal 2 - Cliente
npm run client
```

2. Abre tu navegador en `http://localhost:5173`

3. Ingresa tu nombre (opcional) y selecciona tu estado de ánimo

4. ¡Ve cómo se actualiza en tiempo real!

## 📁 Estructura del Proyecto

```
Bateria/
├── server/          # Backend con Express y Socket.io
│   └── index.js
├── client/          # Frontend con React y Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── BateriaEstado.jsx
│   │   │   ├── PanelEstadisticas.jsx
│   │   │   └── ListaEstados.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── package.json
```

## 🎨 Estados de Ánimo Disponibles

- 😢 Muy Triste
- 😔 Triste
- 😐 Neutral
- 😊 Feliz
- 😄 Muy Feliz

## 🔧 Tecnologías Utilizadas

- **Frontend**: React, Vite, Socket.io-client
- **Backend**: Node.js, Express, Socket.io
- **Estilos**: CSS3 con animaciones

## 📝 Notas

- Los datos se almacenan en un archivo JSON (`server/datos.json`) y persisten entre reinicios
- El servidor corre en el puerto 3001 (desarrollo) o el asignado por Railway (producción)
- El cliente corre en el puerto 5173

## 🚀 Despliegue en Railway

### Configuración del Backend en Railway

1. **Conecta tu repositorio** a Railway
2. **Configura el Root Directory**: Si subiste todo el proyecto, deja vacío. Si solo subiste `server/`, pon `server`
3. **Start Command**: `cd server && npm start` (o `npm start` si el root es `server/`)
4. **Variables de Entorno**:
   - `NODE_ENV` = `production`
   - `ALLOWED_ORIGINS` = `https://tu-frontend.vercel.app` (URLs separadas por comas)
   - `PORT` se asigna automáticamente (no configurar)

### Configuración del Frontend

1. Crea un archivo `.env` en la carpeta `client/`:
```env
VITE_SOCKET_URL=https://tu-app.railway.app
```

2. O configura la variable en Vercel (si usas Vercel):
   - Variable: `VITE_SOCKET_URL`
   - Valor: La URL de tu servidor Railway

### Ver archivo ENV_SETUP.md para más detalles

