import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Divider } from "@nextui-org/react";
import { useRouter } from 'next/navigation';


const ReportModal = ({ isOpen, onOpenChange, handleReport, title }) => {

    const router = useRouter();

    const onAceptClick = async () => {
        handleReport()
    }; 

    return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col">Reportar publicación</ModalHeader>
            <Divider />
            <ModalBody>
              <p>
                Usted esta reportando la publicacion: {title}
              </p>
            </ModalBody>
            <ModalFooter>
                <Button className="bg-gray-600 text-white hover:bg-gray-500 hover:text-black" variant="light" onPress={onClose}>
                    Cancelar
                </Button>
                <Button className="bg-primary-blue text-white" onClick={onAceptClick}>
                    Reportar
                </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ReportModal;