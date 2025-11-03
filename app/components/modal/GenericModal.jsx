'use client';

import { Dialog } from '@headlessui/react';
import './styles.css';

export default function GenericModal({ isOpen, onClose, title, children }) {
    return (
        <Dialog open={isOpen} onClose={onClose} className="modal-overlay">
            <div className="modal-container">
                <Dialog.Panel className="modal-panel">
                    <button
                        className="modal-close-button"
                        onClick={onClose}
                    >
                        ×
                    </button>
                    {title && (
                        <Dialog.Title className="modal-title">
                            {title}
                        </Dialog.Title>
                    )}
                    <div className="mt-4">
                        {children}
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
