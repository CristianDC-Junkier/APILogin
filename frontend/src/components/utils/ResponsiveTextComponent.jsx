import { useState, useEffect } from 'react';

const ResponsiveTextComponent = ({ fullText, shortText, breakpoint = 700 }) => {
    const [isSmall, setIsSmall] = useState(() => {
        if (typeof window !== "undefined") return window.innerWidth < breakpoint;
        return false; // fallback SSR
    });

    useEffect(() => {
        const handleResize = () => {
            setIsSmall(window.innerWidth < breakpoint);
        };

        handleResize(); // fuerza cálculo inicial
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);

    return isSmall ? shortText : fullText; // Devuelve solo texto, se puede usar en <th>
};

export default ResponsiveTextComponent;
