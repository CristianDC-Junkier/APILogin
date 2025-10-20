import React from 'react';

/**
 * Componente que muestra un Spinner para mostrar cuando la página está cargando algo
 */

const SpinnerComponent = () => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh',
            }}
        >
            <div
                style={{
                    width: 40,
                    height: 40,
                    border: '4px solid #ccc',
                    borderTop: '4px solid #1d72b8',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                }}
            />
            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
        </div>
    );
};

export default SpinnerComponent;
