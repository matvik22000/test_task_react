import React, {useRef, useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {Form} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {post} from "./utils";

export default function AuthDialog() {
    const dispatch = useDispatch()
    const [show, setShow] = useState(false);
    const username = useRef(null)
    const pwd = useRef(null)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const isAdmin = useSelector(state => state.isAdmin)
    const login = () => {
        setShow(false)
        post(
            "/login",
            {
                username: username.current.value,
                pwd: pwd.current.value
            },
            (data) => {
                if (data.isAdmin) dispatch({type: "AUTH"})
                else throw Error()
            },
            dispatch,
            "Successfully logged in",
            "Wrong username or password!"
        )
    }
    const logout = () => {
        post("/logout", {}, () => dispatch({type: "DEAUTH"}), dispatch, "logged out!")
    }

    return (
        <>
            <Button variant="primary" onClick={!isAdmin ? handleShow : logout}>
                {!isAdmin ? "log in" : "log out"}
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Enter username and password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="email" placeholder="admin" ref={username}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder={"123"} ref={pwd}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={login}>
                        Login
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
