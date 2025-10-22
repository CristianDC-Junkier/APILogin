import { useState, useEffect } from 'react';

/**
 * Componente que muestra un texto diferente según el tamaño de la ventana.
 * 
 * @component
 * @param {Object} props
 * @param {string} props.fullText - Texto completo que se muestra en pantallas grandes.
 * @param {string} props.shortText - Texto abreviado que se muestra en pantallas pequeñas.
 * @param {number} [props.breakpoint=500] - Ancho de ventana (en píxeles) que define cuándo usar shortText.
 * @returns {string} - El texto correspondiente según el tamaño de la ventana.
 */
const ResponsiveTextComponent = ({ fullText, shortText, breakpoint = 500 }) => {
    const [isSmall, setIsSmall] = useState(() => {
        if (typeof window !== "undefined") return window.innerWidth < breakpoint;
        return false; 
    });

    useEffect(() => {
        const handleResize = () => {
            setIsSmall(window.innerWidth < breakpoint);
        };

        handleResize(); 
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);

    return isSmall ? shortText : fullText; 
};

export default ResponsiveTextComponent;
