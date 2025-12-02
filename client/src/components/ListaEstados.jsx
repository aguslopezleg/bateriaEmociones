import { useEffect, useState } from 'react';
import './ListaEstados.css';

const ListaEstados = ({ estados }) => {
  const [estadosAnimados, setEstadosAnimados] = useState(new Set());

  useEffect(() => {
    if (estados.length > 0) {
      const ultimoId = estados[0].id;
      setEstadosAnimados(prev => new Set([...prev, ultimoId]));
      
      setTimeout(() => {
        setEstadosAnimados(prev => {
          const nuevo = new Set(prev);
          nuevo.delete(ultimoId);
          return nuevo;
        });
      }, 2000);
    }
  }, [estados]);

  const getEmojiPorNivel = (nivel) => {
    const emojis = {
      muyTriste: '😢',
      triste: '😔',
      neutral: '😐',
      feliz: '😊',
      muyFeliz: '😄'
    };
    return emojis[nivel] || '😐';
  };

  const getColorPorNivel = (nivel) => {
    const colores = {
      muyTriste: '#e74c3c',
      triste: '#f39c12',
      neutral: '#f1c40f',
      feliz: '#2ecc71',
      muyFeliz: '#27ae60'
    };
    return colores[nivel] || '#999';
  };

  const formatearTiempo = (timestamp) => {
    const ahora = new Date();
    const fecha = new Date(timestamp);
    const diffMs = ahora - fecha;
    const diffSeg = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSeg / 60);

    if (diffSeg < 10) return 'ahora';
    if (diffSeg < 60) return `hace ${diffSeg}s`;
    if (diffMin < 60) return `hace ${diffMin}m`;
    return fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="lista-estados">
      <h3 className="lista-titulo">⚡ Estados Recientes</h3>
      
      {estados.length === 0 ? (
        <div className="lista-vacia">
          <p>No hay estados aún</p>
          <p className="lista-vacia-sub">Los estados aparecerán aquí en tiempo real</p>
        </div>
      ) : (
        <div className="estados-grid">
          {estados.map((estado, index) => {
            const esNuevo = estadosAnimados.has(estado.id);
            
            return (
              <div
                key={estado.id}
                className={`estado-item ${esNuevo ? 'nuevo' : ''}`}
                style={{
                  '--color-estado': getColorPorNivel(estado.nivel),
                  animationDelay: `${index * 0.05}s`
                }}
              >
                <div className="estado-iniciales" style={{ backgroundColor: getColorPorNivel(estado.nivel) }}>
                  {estado.iniciales}
                </div>
                <div className="estado-info">
                  <div className="estado-nombre">{estado.nombre}</div>
                  <div className="estado-emoji">{getEmojiPorNivel(estado.nivel)}</div>
                </div>
                <div className="estado-tiempo">{formatearTiempo(estado.timestamp)}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ListaEstados;

