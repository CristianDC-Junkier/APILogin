import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'reactstrap';

import '../../styles/user/UserComponents.css';

const LogoutButton = ({ onClick, loading }) => {
    return (
        <Button
            onClick={onClick}
            disabled={loading}
            className="logout-button btn btn-danger"
            style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
        >
            <div className="logout-content">
                <FontAwesomeIcon icon={faSignOutAlt} color="white" />
                <span className="logout-text">Cerrar sesión</span>
            </div>
        </Button>
    );
};

export default LogoutButton;
