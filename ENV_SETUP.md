# Configuración de Variables de Entorno

## Para el Cliente (Frontend)

Crea un archivo `.env` en la carpeta `client/` con:

```env
VITE_SOCKET_URL=http://localhost:3001
```

Para producción, usa la URL de tu servidor Railway:
```env
VITE_SOCKET_URL=https://tu-app.railway.app
```

## Para el Servidor (Railway)

Configura estas variables de entorno en Railway:

1. **NODE_ENV**: `production`
2. **ALLOWED_ORIGINS**: URLs de tu frontend separadas por comas
   - Ejemplo: `https://tu-app.vercel.app,https://otro-dominio.com`
3. **PORT**: Railway lo asigna automáticamente (no necesitas configurarlo)

## Ejemplo de configuración en Railway

1. Ve a tu proyecto en Railway
2. Click en "Variables"
3. Agrega:
   - `NODE_ENV` = `production`
   - `ALLOWED_ORIGINS` = `https://tu-frontend.vercel.app` (o tu dominio)

