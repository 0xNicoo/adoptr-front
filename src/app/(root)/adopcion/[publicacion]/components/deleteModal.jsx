import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Divider } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { deletePostAction } from "@/actions/post";

const DeleteModal = ({ isOpen, onOpenChange, handleAdopted }) => {

    const router = useRouter();

    const onAceptClick = async () => {
        handleAdopted()
    }; 

    return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col">Mascota adoptada</ModalHeader>
            <Divider />
            <ModalBody>
              <p>
                Usted cambiará el estado de la publicación a &quot;adoptada&quot;, ¿está seguro?
              </p>
            </ModalBody>
            <ModalFooter>
                <Button className="bg-gray-600 text-white hover:bg-gray-500 hover:text-black" variant="light" onPress={onClose}>
                    Cancelar
                </Button>
                <Button className="bg-primary-blue text-white" onClick={onAceptClick}>
                    Aceptar
                </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DeleteModal;