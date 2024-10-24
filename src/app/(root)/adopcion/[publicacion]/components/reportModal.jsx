'use client'

import React, { useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Divider, Select, SelectItem } from "@nextui-org/react";
import { reportReasonsAction } from "@/actions/report";


const ReportModal = ({ isOpen, onOpenChange, handleReport, title }) => {

    const [selectedReason, setSelectedReason] = useState(null)
    const [reportReasons, setReportReasons] = useState([])

    const handleSelectChange = (value) => {
        setSelectedReason(value.target.value);
      };

    const onAceptClick = async () => {
        handleReport(selectedReason)
    }; 

    useEffect(() => {
        setSelectedReason(null)
        const fetchReportReasons = async () => {
            const data = await reportReasonsAction();
            setReportReasons(data)
        }
        fetchReportReasons()
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
                        {reportReasons.map((reason) => (
                            <SelectItem key={reason.id} value={reason.id}>
                                {reason.reason}
                            </SelectItem>
                        ))}
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