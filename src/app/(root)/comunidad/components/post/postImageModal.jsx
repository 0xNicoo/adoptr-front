import React from 'react';
import { Modal, ModalContent, Image } from '@nextui-org/react';

const PostImageModal = ({ isOpen, onClose, imageUrl }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalContent>
        {(onClose) => (
          <>
              {imageUrl && (
                <Image
                  alt="Imagen ampliada del post"
                  src={imageUrl}
                  width={600}
                  height={600}
                  className="p-0"
                />
              )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default PostImageModal;