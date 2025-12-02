import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import logo from '../assets/ayto_almonte.png';

/**
 * Página comodín que se muestra cuando se introduce una página que no se recoge en el AppRouter
 */
const NotFound = () => {
  const { darkMode } = useOutletContext(); // obtiene darkMode del layout

    useEffect(() => {
        document.title = "Página no encontrada 404 - IDEE Almonte";
    }, []);

  return (
    <div 
      className="row vh-80 d-flex align-items-center justify-content-center"
      style={{ 
        minHeight: "90vh", 
        transition: "background 0.3s ease" 
      }}
    >
      <div className="col">
        <img
          src={logo}
          alt="Logo Ayto"
          className="mx-auto d-block"
          style={{ width: "50%" }}
        />
      </div>
      <div className="col">
        <h2 className="text-center" style={{ color: darkMode ? "#ff6b6b" : "#dc3545" }}>{"Error 404"}</h2>
        <h3 className="text-center" style={{ color: darkMode ? "#ccc" : "#666" }}>{"La página no existe"}</h3>
      </div>
    </div>
  );
};

export default NotFound;
