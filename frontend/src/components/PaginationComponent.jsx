import React from 'react';
import { Button } from 'reactstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

/**
 * Componente encargado de crear y gestionar los botones para desplazarse por las distintas páginas de una tabla
 * @param {Int} currentPage - Página actual donde se encuentra el usuario
 * @param {Int} totalPages - Cantidad total de páginas
 * @param {Function} onPageChange - Función para gestionar el paso de una página a otra de la tabla
 * @returns
 */

//Función encargada de calcular los números de las páginas a mostrar
const getPaginationNumbers = (page, totalPages) => {
    const pages = [];

    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        if (page <= 2) {
            pages.push(1, 2, 3, 'next', totalPages);
        } else if (page >= totalPages - 1) {
            pages.push(1, 'prev', totalPages - 2, totalPages - 1, totalPages);
        } else {
            pages.push(1, 'prev', page - 1, page, page + 1, 'next', totalPages);
        }
    }

    return pages;
};

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = getPaginationNumbers(currentPage, totalPages);

    //Función para gestionar el botón de página anterior
    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    //Función para gestionar el botón de página siguiente
    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    return (
        <div className="pagination-controls d-flex justify-content-center mb-3 mt-1 flex-wrap gap-2">
            {pageNumbers.map((item, index) => {
                if (item === 'prev') {
                    {/* Botón Ir a página anterior */ }
                    return (
                        <Button key={index} color="danger" style={{ padding: "0.35rem 0.5rem", }} onClick={handlePrev}>
                            <FaChevronLeft size={14} />
                        </Button>
                    );
                }
                if (item === 'next') {
                    {/* Botón Ir a página siguiente */ }
                    return (
                        <Button key={index} color="danger" style={{ padding: "0.35rem 0.5rem" }} onClick={handleNext}>
                            <FaChevronRight size={14} />
                        </Button>
                    );
                }
                {/* Botones para las páginas */}
                return (
                    <Button
                        key={index}
                        color={item === currentPage ? 'primary' : 'secondary'}
                        className="pagination-btn"
                        onClick={() => onPageChange(item)}
                    >
                        {item}
                    </Button>
                );
            })}
        </div>
    );
};

export default PaginationComponent;
