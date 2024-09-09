import Toast from 'react-bootstrap/Toast';
import { Inter } from "next/font/google";
import CloseButton from 'react-bootstrap/CloseButton';

const inter = Inter({ subsets: ["latin"] });

const CustomToast = ({ show, onClose, message }) => {
  return (
      <Toast 
        show={show} 
        onClose={onClose} 
        className={`${inter.className} bg-danger text-white`}
        delay={3000}
        autohide
      >
        <Toast.Body className="d-flex justify-content-between align-items-center">
          <span>{message}</span>
          <CloseButton variant="white" onClick={onClose} />
        </Toast.Body>
      </Toast>
    );
};

export default CustomToast;
