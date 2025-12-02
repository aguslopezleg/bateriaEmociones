import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import BateriaEstado from './components/BateriaEstado';
import PanelEstadisticas from './components/PanelEstadisticas';
import ListaEstados from './components/ListaEstados';
import './App.css';

// En producción, usar la misma URL (mismo dominio)
// En desarrollo, usar localhost
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 
  (import.meta.env.PROD ? window.location.origin : 'http://localhost:3001');
const socket = io(SOCKET_URL);

function App() {
  const [nombre, setNombre] = useState('');
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);
  const [estadisticas, setEstadisticas] = useState({
    muyFeliz: 0,
    feliz: 0,
    neutral: 0,
    triste: 0,
    muyTriste: 0,
    cero: 0
  });
  const [estadosRecientes, setEstadosRecientes] = useState([]);
  const [haEnviado, setHaEnviado] = useState(false);

  useEffect(() => {
    socket.on('estado-actual', (data) => {
      setEstadisticas(data.estadisticas);
      setEstadosRecientes(data.estados || []);
    });

    socket.on('estado-actualizado', (nuevoEstado) => {
      setEstadosRecientes(prev => {
        const existe = prev.findIndex(e => e.id === nuevoEstado.id);
        if (existe !== -1) {
          const actualizado = [...prev];
          actualizado[existe] = nuevoEstado;
          return actualizado;
        }
        return [nuevoEstado, ...prev].slice(0, 10);
      });
    });

    socket.on('estadisticas-actualizadas', (nuevasEstadisticas) => {
      setEstadisticas(nuevasEstadisticas);
    });

    socket.on('votaciones-reiniciadas', () => {
      setEstadosRecientes([]);
      setEstadisticas({
        muyFeliz: 0,
        feliz: 0,
        neutral: 0,
        triste: 0,
        muyTriste: 0,
        cero: 0
      });
      setEstadoSeleccionado(null);
      setHaEnviado(false);
    });

    return () => {
      socket.off('estado-actual');
      socket.off('estado-actualizado');
      socket.off('estadisticas-actualizadas');
      socket.off('votaciones-reiniciadas');
    };
  }, []);

  const handleSeleccionarEstado = (nivel) => {
    // No permitir votar si no hay nombre
    if (!nombre || nombre.trim() === '') {
      return;
    }
    
    setEstadoSeleccionado(nivel);
    // Enviar automáticamente cuando se selecciona
    socket.emit('nuevo-estado', {
      nombre: nombre.trim(),
      nivel: nivel
    });
    setHaEnviado(true);
  };

  const nombreValido = nombre && nombre.trim() !== '';

  const handleReiniciarVotaciones = () => {
    if (window.confirm('¿Estás seguro de que quieres reiniciar todas las votaciones? Esta acción no se puede deshacer.')) {
      socket.emit('reiniciar-votaciones');
      setMostrarBotonReset(false);
    }
  };

  return (
    <div className="app">
      {/* Botón para reiniciar votaciones */}
      <button 
        className="btn-reset-oculto"
        onClick={handleReiniciarVotaciones}
        title="Reiniciar todas las votaciones (Ctrl+Shift+R)"
      >
        🔄
      </button>
      
      <div className="app-container">
        <header className="app-header">
          <h1>🔋 Batería de Estado de Ánimo</h1>
          <p>Selecciona cómo te sientes hoy</p>
        </header>

        <div className="app-content">
          <div className="main-panel">
            <div className="formulario">
              <div className="input-group">
                <label htmlFor="nombre">
                  Tu nombre <span className="requerido">*</span>:
                </label>
                <input
                  id="nombre"
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className={`input-nombre ${!nombreValido && nombre.length > 0 ? 'error' : ''}`}
                  required
                />
                {!nombreValido && (
                  <p className="mensaje-error">Por favor, ingresa tu nombre para votar</p>
                )}
              </div>

              <BateriaEstado
                estadoSeleccionado={estadoSeleccionado}
                onSeleccionar={handleSeleccionarEstado}
                estadosActuales={estadosRecientes}
                deshabilitado={!nombreValido}
              />

              {haEnviado && (
                <div className="mensaje-exito-inline">
                  <p>✓ Tu estado se ha actualizado</p>
                  <button
                    onClick={() => {
                      setHaEnviado(false);
                      setEstadoSeleccionado(null);
                    }}
                    className="btn-cambiar"
                  >
                    Cambiar
                  </button>
                </div>
              )}
            </div>

            <ListaEstados estados={estadosRecientes} />
          </div>

          <PanelEstadisticas estadisticas={estadisticas} />
        </div>
      </div>
    </div>
  );
}

export default App;

