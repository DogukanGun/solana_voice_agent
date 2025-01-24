"use client"
import React from "react";
import { createContext } from "react";
import Modal from "../components/Modal";

interface ModalContextValue {
    closeModal: () => void;
    setModalContent: (content:React.ReactNode) => void;
    openModal: () => void;
    isOpen: boolean;
}

export const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {

    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [modalContent, setModalContent] = React.useState<React.ReactNode>(null);

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    return (
        <ModalContext.Provider value={{ openModal, closeModal, isOpen, setModalContent}}>
            {children}
            <Modal isOpen={isOpen} onClose={closeModal}>
                {modalContent}
            </Modal>
        </ModalContext.Provider>
    );
}