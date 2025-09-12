import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../styles/user/UserComponents.css';

const HomeButtonComponent = ({ label, icon, onClick }) => (
    <button onClick={onClick} aria-label={label} className="client-button">
        <FontAwesomeIcon icon={icon} size="lg" className="icon" />
        <span className="label">{label}</span>
    </button>
);

export default HomeButtonComponent;


