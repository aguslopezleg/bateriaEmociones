import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import BateriaEstado from './components/BateriaEstado';
import PanelEstadisticas from './components/PanelEstadisticas';
import ListaEstados from './components/ListaEstados';
import './App.css';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
const socket = io(SOCKET_URL);

function App() {
  const [nombre, setNombre] = useState('');
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);
  const [estadisticas, setEstadisticas] = useState({
    muyFeliz: 0,
    feliz: 0,
    neutral: 0,
    triste: 0,
    muyTriste: 0
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

    return () => {
      socket.off('estado-actual');
      socket.off('estado-actualizado');
      socket.off('estadisticas-actualizadas');
    };
  }, []);

  const handleSeleccionarEstado = (nivel) => {
    setEstadoSeleccionado(nivel);
    // Enviar automáticamente cuando se selecciona
    socket.emit('nuevo-estado', {
      nombre: nombre || 'Anónimo',
      nivel: nivel
    });
    setHaEnviado(true);
  };

  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <h1>🔋 Batería de Estado de Ánimo</h1>
          <p>Selecciona cómo te sientes hoy</p>
        </header>

        <div className="app-content">
          <div className="main-panel">
            <div className="formulario">
              <div className="input-group">
                <label htmlFor="nombre">Tu nombre (opcional):</label>
                <input
                  id="nombre"
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="input-nombre"
                />
              </div>

              <BateriaEstado
                estadoSeleccionado={estadoSeleccionado}
                onSeleccionar={handleSeleccionarEstado}
                estadosActuales={estadosRecientes}
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

