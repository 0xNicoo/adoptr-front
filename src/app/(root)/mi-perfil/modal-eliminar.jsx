import React from "react";
import { deletePostAction } from "./actions";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Divider } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
const PostModal = ({ isOpen, onOpenChange, postId }) => {

    const router = useRouter();

    const handleDelete = async () => {
        if (postId) {
            try {
                await deletePostAction(postId);
                onOpenChange(false); 
            } catch (error) {
                console.error('Failed to delete post', error);
            }
        }
    }; 

    return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col">Eliminar publicación</ModalHeader>
            <Divider />
            <ModalBody>
              <p>
                ¿Está seguro que desea eliminar esta publicación?
              </p>
            </ModalBody>
            <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                Cancelar
                </Button>
                <Button color="danger" onClick={handleDelete}>
                Eliminar
                </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default PostModal;