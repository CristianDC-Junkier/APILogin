import { useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';
import { FaArrowLeft } from 'react-icons/fa';

const BackButton = ({ back = '/' }) => {
    const navigate = useNavigate(); 

    const handleBack = () => {
        navigate(back); 
    };

    return (
        <Button
            onClick={handleBack}
            style={{
                backgroundColor: 'transparent',
                border: 'none',
                boxShadow: 'none',
                fontSize: '1.5rem',
                color: 'inherit',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#999')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'inherit')}
        >
            <FaArrowLeft size={32} />
        </Button>
    );
};

export default BackButton;
