import {useDispatch, useSelector} from "react-redux";
import {FormCheck} from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import PaginatorFactory from "react-bootstrap-table2-paginator";
import cellEditFactory from "react-bootstrap-table2-editor";
import {post, validate} from "./utils";

export default function Table() {
    const dispatch = useDispatch()
    const tasks = useSelector(state => state.tasks)
    const isAdmin = useSelector(state => state.isAdmin)
    const updateTask = (id, newTask, redacted) => {
        post("/update_task",
            {
                id: id,
                task: newTask,
                redacted: redacted
            },
            () => dispatch({type: "UPDATE_TASK", payload: {task: newTask, redacted: redacted}}),
            dispatch,
            "task successfully updated!",
            "Something went wrong, task was not updated.",
            () => window.location.reload()
        )
    }
    const save = (oldValue, newValue, row, column) => {
        if (oldValue === newValue) {
            return
        }
        const newTask = {...row}
        newTask[column.dataField] = newValue
        updateTask(row.id, newTask, true)

    }
    const checkBoxFormatter = (data, row, components, disabled) => {
        return (
            <FormCheck
                type="checkbox"
                checked={data}
                disabled={disabled}
                onChange={
                    () => {
                        const newTask = {...row, completed: !row.completed}
                        updateTask(row.id, newTask, false)
                    }}
            />
        );
    }
    const validateCell = (value) => {
        if (!validate([value])) {
            return {
                valid: false,
                message: 'Incorrect data'
            }
        }
        return true;
    }

    const columns = [
        {
            text: "Email",
            dataField: "email",
            sort: true,
            editable: false,
            classes: "email-cell",
        },
        {
            text: "Name",
            dataField: "name",
            sort: true,
            editable: false,
            classes: "name-cell",
        },
        {
            text: "Description",
            dataField: "description",
            sort: true,
            editable: isAdmin,
            classes: "desc-cell",
            validator: validateCell
        },
        {
            text: "Completed",
            dataField: "completed",
            formatter: checkBoxFormatter,
            formatExtraData: !isAdmin,
            sort: true,
            editable: false,
            classes: "comp-cell"
        },
        {
            text: "Redacted",
            dataField: "redacted",
            formatter: checkBoxFormatter,
            formatExtraData: true,
            editable: false,
            classes: "red-cell"
        }
    ]

    const sizePerPageRenderer = ({
                                     options,
                                     currSizePerPage,
                                     onSizePerPageChange
                                 }) => (
        <div className="btn-group m-3" role="group">
            {
                options.map(option => (
                    <button
                        key={option.text}
                        type="button"
                        onClick={() => onSizePerPageChange(option.page)}
                        className={`btn ${currSizePerPage === `${option.page}` ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        {option.text}
                    </button>
                ))
            }
        </div>
    );

    return tasks ? (
        <BootstrapTable keyField='id' data={Object.values(tasks)} columns={columns} hover={isAdmin}
                        pagination={PaginatorFactory({
                            sizePerPageList: [3, 10, 15],
                            sizePerPageRenderer
                        })}
                        cellEdit={cellEditFactory({
                            mode: "dbclick",
                            afterSaveCell: save,
                            blurToSave: true
                        })}
        />
    ) : (<div/>)
}