import './BateriaEstado.css';

const BateriaEstado = ({ estadoSeleccionado, onSeleccionar, estadosActuales = [], deshabilitado = false }) => {
  const niveles = [
    { id: 'muyFeliz', porcentaje: 100, label: 'Muy Feliz', emoji: '😄', color: '#00E676' },
    { id: 'feliz', porcentaje: 80, label: 'Feliz', emoji: '😊', color: '#00C853' },
    { id: 'neutral', porcentaje: 60, label: 'Neutral', emoji: '😐', color: '#FFD600' },
    { id: 'triste', porcentaje: 40, label: 'Triste', emoji: '😔', color: '#FF6F00' },
    { id: 'muyTriste', porcentaje: 20, label: 'Muy Triste', emoji: '😢', color: '#D32F2F' },
    { id: 'cero', porcentaje: 0, label: 'Sin Energía', emoji: '😴', color: '#BDBDBD' }
  ];

  // Obtener usuarios por nivel
  const obtenerUsuariosPorNivel = (nivelId) => {
    return estadosActuales.filter(estado => estado.nivel === nivelId);
  };

  // Colores para los stickers (variados como en el ejemplo)
  const coloresStickers = [
    '#2ecc71', // verde
    '#e74c3c', // rojo
    '#f39c12', // naranja
    '#3498db', // azul
    '#9b59b6', // morado
    '#1abc9c', // turquesa
    '#e67e22', // naranja oscuro
    '#34495e'  // gris oscuro
  ];

  // Obtener color para un sticker basado en el ID del usuario
  const obtenerColorSticker = (usuarioId) => {
    const hash = usuarioId.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    return coloresStickers[Math.abs(hash) % coloresStickers.length];
  };

  return (
    <div className="bateria-container">
      <h3 className="bateria-titulo">EL CHECK-IN DE LA BATERÍA</h3>
      <div className="bateria-visual">
        {/* Cuerpo de la batería con secciones */}
        <div className="bateria-cuerpo">
          {/* Terminal positivo de la batería */}
          <div className="bateria-terminal"></div>
          
          {niveles.map((nivel, index) => {
            const estaSeleccionado = estadoSeleccionado === nivel.id;
            const usuariosEnNivel = obtenerUsuariosPorNivel(nivel.id);
            const tieneUsuarios = usuariosEnNivel.length > 0;

            return (
              <div
                key={nivel.id}
                className={`bateria-seccion ${estaSeleccionado ? 'seleccionado' : ''} ${tieneUsuarios ? 'con-usuarios' : ''} ${deshabilitado ? 'deshabilitado' : ''}`}
                onClick={() => !deshabilitado && onSeleccionar(nivel.id)}
                style={{
                  '--color-nivel': nivel.color
                }}
              >
                {/* Porcentaje a la izquierda */}
                <div className="seccion-porcentaje-izq">{nivel.porcentaje}%</div>
                
                {/* Contenido de la sección */}
                <div className="seccion-contenido">
                  {/* Iniciales de usuarios en esta sección (stickers) */}
                  <div className="seccion-iniciales">
                    {usuariosEnNivel.map((usuario, idx) => (
                      <div
                        key={usuario.id}
                        className="sticker-inicial"
                        style={{ 
                          animationDelay: `${idx * 0.1}s`,
                          backgroundColor: obtenerColorSticker(usuario.id),
                          '--color-sticker': obtenerColorSticker(usuario.id)
                        }}
                        title={usuario.nombre}
                      >
                        {usuario.iniciales}
                      </div>
                    ))}
                  </div>
                  
                  {/* Indicador de selección */}
                  {estaSeleccionado && (
                    <div className="seccion-seleccion-indicador">
                      <div className="pulso"></div>
                    </div>
                  )}
                </div>
                
                {/* Porcentaje a la derecha */}
                <div className="seccion-porcentaje-der">{nivel.porcentaje}%</div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Leyenda */}
      <div className="bateria-leyenda">
        {deshabilitado ? (
          <p>⚠️ Ingresa tu nombre arriba para poder votar</p>
        ) : (
          <p>💡 Haz clic en cualquier sección para colocar tu sticker</p>
        )}
      </div>
    </div>
  );
};

export default BateriaEstado;

