import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import {Container, Row, Stack, ToastContainer} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react"
import Table from "./Table";
import AuthDialog from "./AuthDialog";
import NewTaskDialog from "./NewTaskDialog";
import {get} from "./utils";


export default function App() {
    const dispatch = useDispatch()
    const toasts = useSelector(state => state.toasts)
    const [userLoaded, setUserLoaded] = useState(false);
    useEffect(() => {
        if (!userLoaded) {
            setUserLoaded(true)
            get("/tasks",
                (actualData) => dispatch({type: "TASKS_LOADED", payload: actualData}),
                dispatch
            )

            get("/login",
                (actualData) => {
                    if (actualData.isAdmin) dispatch({type: "AUTH"})
                },
                dispatch
            )
        }

    }, [userLoaded, dispatch])
    return (
        <Container>
            <Row>
                <Stack gap={3} direction="horizontal" className={"mt-3"}>
                    <AuthDialog/>
                    <NewTaskDialog/>
                </Stack>

                <ToastContainer position={"top-end"}>
                    {toasts}
                </ToastContainer>
            </Row>
            <Row>
                <div className={"w-100 m-auto mt-3"}>
                    <Table/>
                </div>
            </Row>
        </Container>
    )


}
