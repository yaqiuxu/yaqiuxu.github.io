/* global google */
import React, { useEffect, useRef } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const containerStyle = {
    width: '94%',
    height: '65%',
    margin: "auto"
};

const GoogleMapsModal = ({ isOpen, closeModal, center }) => {
    const mapRef = useRef(null);

    useEffect(() => {
    if (isOpen) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&callback=Function.prototype`;
        script.async = true;
        script.onload = () => initMap();
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }
    }, [isOpen]);

    const initMap = () => {
        const map = new google.maps.Map(mapRef.current, {
            center,
            zoom: 12,
        });
        new google.maps.Marker({
            position: center,
            map,
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            contentLabel="Google Maps Modal"
            style={{
                content: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    height: '500px',
                    width: '50%',
                    minWidth: "300px",
                    maxWidth: "400px",
                    padding: 0
                },
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    zIndex: 1000,
                },
            }}
        >
            <h3 style={{ padding: "20px 0 12px 20px"}}>Event Venue</h3>
            <hr/>
            <div ref={mapRef} style={containerStyle}></div>
            <button className="btn btn-dark"
                onClick={closeModal} style={{ position: 'absolute', bottom: '5%', left: '5%' }}>
                Close
            </button>
        </Modal>
    );
};

export default GoogleMapsModal;