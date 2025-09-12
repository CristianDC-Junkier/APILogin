import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import BackButton from '../components/utils/BackButtonComponent';
import LogoutButton from '../components/user/LogoutComponent'

import '../styles/ExternalWeb.css'

const URL = import.meta.env.VITE_URL;

const ExternalWeb = () => {
    const [loadingLogout, setLoadingLogout] = useState(false);

    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleLogout = async () => {
        setLoadingLogout(true);
        try {
            await logout();
            navigate('/');
        } finally {
            setLoadingLogout(false);
        }
    };

    return (
        <div className="iframe">
            <div>
                <iframe
                    title="Web View"
                    src={URL}
                    style={{ width: '100%', height: '750px' }}
                />
            </div>
            <div>
                {console.log(user) }
                {!(user.usertype === 'USER') && <BackButton back="/home" />}
                {user.usertype === 'USER' && <LogoutButton onClick={handleLogout} loading={loadingLogout} />}
            </div>
        </div>
    );
};

export default ExternalWeb;