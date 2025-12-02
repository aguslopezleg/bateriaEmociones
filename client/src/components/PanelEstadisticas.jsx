import { useEffect, useState } from 'react';
import './PanelEstadisticas.css';

const PanelEstadisticas = ({ estadisticas }) => {
  const [animaciones, setAnimaciones] = useState({});

  const total = Object.values(estadisticas).reduce((sum, val) => sum + val, 0);

  const niveles = [
    { id: 'muyFeliz', label: 'Muy Feliz', emoji: '😄', color: '#00E676' },
    { id: 'feliz', label: 'Feliz', emoji: '😊', color: '#00C853' },
    { id: 'neutral', label: 'Neutral', emoji: '😐', color: '#FFD600' },
    { id: 'triste', label: 'Triste', emoji: '😔', color: '#FF6F00' },
    { id: 'muyTriste', label: 'Muy Triste', emoji: '😢', color: '#D32F2F' },
    { id: 'cero', label: 'Sin Energía', emoji: '😴', color: '#BDBDBD' }
  ];

  useEffect(() => {
    niveles.forEach(nivel => {
      if (estadisticas[nivel.id] > 0) {
        setAnimaciones(prev => ({
          ...prev,
          [nivel.id]: true
        }));
        setTimeout(() => {
          setAnimaciones(prev => ({
            ...prev,
            [nivel.id]: false
          }));
        }, 500);
      }
    });
  }, [estadisticas]);

  const calcularPorcentaje = (valor) => {
    if (total === 0) return 0;
    return Math.round((valor / total) * 100);
  };

  return (
    <div className="panel-estadisticas">
      <h2 className="panel-titulo">📊 Estadísticas</h2>
      
      <div className="estadistica-total">
        <div className="total-numero">{total}</div>
        <div className="total-label">Total de respuestas</div>
      </div>

      <div className="estadisticas-lista">
        {niveles.map(nivel => {
          const valor = estadisticas[nivel.id] || 0;
          const porcentaje = calcularPorcentaje(valor);
          const animando = animaciones[nivel.id];

          return (
            <div
              key={nivel.id}
              className={`estadistica-item ${animando ? 'animando' : ''}`}
            >
              <div className="estadistica-header">
                <span className="estadistica-emoji">{nivel.emoji}</span>
                <span className="estadistica-label">{nivel.label}</span>
                <span className="estadistica-valor">{valor}</span>
              </div>
              
              <div className="estadistica-barra-container">
                <div
                  className="estadistica-barra"
                  style={{
                    width: `${porcentaje}%`,
                    backgroundColor: nivel.color,
                    transition: 'width 0.5s ease'
                  }}
                />
              </div>
              
              <div className="estadistica-porcentaje">
                {porcentaje}%
              </div>
            </div>
          );
        })}
      </div>

      {total === 0 && (
        <div className="sin-datos">
          <p>No hay datos aún</p>
          <p className="sin-datos-sub">Las estadísticas aparecerán aquí</p>
        </div>
      )}
    </div>
  );
};

export default PanelEstadisticas;

