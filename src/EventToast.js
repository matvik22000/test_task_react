import React, {useState} from 'react';
import Toast from 'react-bootstrap/Toast';

export default function EventToast(props) {
    const [show, setShow] = useState(true);


    return (
        <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide bg={props.type} className={"m-3"}>
            <Toast.Header>
                <strong className="me-auto">{props.header}</strong>
            </Toast.Header>
            <Toast.Body className={"text-light"}>{props.text}</Toast.Body>
        </Toast>
    );
}