'use client'

import React, { useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Divider, Select, SelectItem } from "@nextui-org/react";


const ReportModal = ({ isOpen, onOpenChange, handleReport, title }) => {

    const [selectedReason, setSelectedReason] = useState(null);

    const handleSelectChange = (value) => {
        setSelectedReason(value.target.value);
      };

    const onAceptClick = async () => {
        handleReport(selectedReason)
    }; 

    useEffect(() => {
        setSelectedReason(null)
    }, [isOpen])

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
            {(onClose) => (
            <>
                <ModalHeader className="flex flex-col">Reportar publicación</ModalHeader>
                <Divider />
                <ModalBody>
                <p>
                    Usted esta reportando la publicacion: <b>{title}</b>
                </p>
                <Select
                    label="Motivo del reporte"
                    placeholder="Seleccione un motivo"
                    aria-label="Motivo de reporte"
                    onChange={handleSelectChange}
                >
                    <SelectItem key="1">Spam</SelectItem>
                    <SelectItem key="2">Contenido inapropiado</SelectItem>
                    <SelectItem key="3">Fraude</SelectItem>
                    <SelectItem key="4">Otro</SelectItem>
                </Select>
                </ModalBody>
                <ModalFooter>
                    <Button className="bg-gray-600 text-white hover:bg-gray-500 hover:text-black" variant="light" onPress={onClose}>
                        Cancelar
                    </Button>
                    <Button
                    className={`text-white ${
                        selectedReason ? 'bg-primary-blue hover:bg-primary-light' : 'bg-slate-800 cursor-not-allowed'
                    }`}
                    onClick={onAceptClick}
                    disabled={!selectedReason}
                >
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