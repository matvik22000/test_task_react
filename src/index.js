import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {createStore} from "redux";
import {Provider} from "react-redux";
import EventToast from "./EventToast";


const defaultState = {
    isAdmin: false,
    tasks: {},
    toasts: []

}
const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case "AUTH":
            return {...state, isAdmin: true}
        case "DEAUTH":
            return {...state, isAdmin: false}
        case "TASKS_LOADED":
            const tasks = {}
            action.payload.forEach((el) => tasks[el.id] = el)
            return {...state, tasks: tasks}
        case "UPDATE_TASK": {
            const new_tasks = {...state.tasks}
            new_tasks[action.payload.task.id] = action.payload.task

            if (action.payload.redacted) new_tasks[action.payload.task.id].redacted = true

            return {...state, tasks: new_tasks}
        }
        case "CREATE_TASK":
            const newTasks = {...state.tasks}
            newTasks[action.payload.id] = action.payload
            return {...state, tasks: newTasks}
        case "CREATE_TOAST":
            const toasts = [...state.toasts]
            toasts.push((<EventToast type={action.payload.type} header={action.payload.header} text={action.payload.text}/>))
            return {...state, toasts: toasts}
        default:
            return state
    }

}
const store = createStore(reducer)

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store={store}>
        <App/>
    </Provider>
);
