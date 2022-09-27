import React, {useRef, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {Form} from "react-bootstrap";
import {useDispatch} from "react-redux";
import {post, validate, validateEmail} from "./utils";

export default function NewTaskDialog() {
    const dispatch = useDispatch()
    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const email = useRef(null)
    const name = useRef(null)
    const desc = useRef(null)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const create = () => {
        const email_value = email.current.value
        const name_value = name.current.value
        const desc_value = desc.current.value

        post("/create_task",
            {
                task: {
                    email: email_value,
                    name: name_value,
                    description: desc_value,
                    completed: false
                }
            },
            (actualData) => {
                dispatch({
                    type: "CREATE_TASK", payload: {
                        id: actualData.id,
                        email: email_value,
                        name: name_value,
                        description: desc_value,
                        completed: false
                    }
                })
            },
            dispatch,
            "successfully created new task!",
            "Something went wrong!"
        )
        handleClose()

    }
    const handleSubmit = () => {
        const email_value = email.current.value
        const name_value = name.current.value
        const desc_value = desc.current.value
        if (validate([email_value, name_value, desc_value]) && validateEmail(email_value)) {
            create()
        }
        setValidated(true);
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Create task
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create new task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated}>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control required type="email" placeholder="name@example.com" ref={email}/>
                            <Form.Control.Feedback type="invalid">Enter email</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Name</Form.Label>
                            <Form.Control required ref={name}/>
                            <Form.Control.Feedback type="invalid">Enter name</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Description</Form.Label>
                            <Form.Control required ref={desc}/>
                            <Form.Control.Feedback type="invalid">Enter description</Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
