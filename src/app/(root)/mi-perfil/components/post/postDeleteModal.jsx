import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Divider } from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import { deletePostAction } from "@/actions/post";

const PostDeleteModal = ({ isOpen, onOpenChange, handleDeletePost }) => {

    const router = useRouter();

    const onDeleteClick = async () => {
      handleDeletePost()
    }

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
                <Button color="danger" onClick={onDeleteClick}>
                Eliminar
                </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default PostDeleteModal;