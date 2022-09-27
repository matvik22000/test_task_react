export function validate(fields) {
    return fields.map((field) => field.trim().length > 0).reduce((a, b) => a + b, 0) === fields.length
}

export function validateEmail(email) {
    return (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email))
}

const url = "/api"


export function post(address, body, callback, dispatch = null, successMsg = null, failMsg = null, failCallback = null) {
    if (failMsg == null) failMsg = "something went wrong"
    fetch(url + address, {
        body: JSON.stringify(body),
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "Application/json"
        },
    })
        .then((response) => response.json())
        .then((actualData) => {
            callback(actualData)
            if (successMsg != null)
                dispatch({
                    type: "CREATE_TOAST",
                    payload: {text: successMsg, header: "Success", type: "success"}
                })
        })
        .catch(() => {
                if (failCallback != null) failCallback()
                dispatch({
                    type: "CREATE_TOAST",
                    payload: {text: failMsg, header: "Error", type: "danger"}
                })
            }
        );
}

export function get(address, callback, dispatch = null, successMsg = null, failMsg = null) {
    if (failMsg == null) failMsg = "something went wrong"
    fetch(url + address, {
        credentials: "include",
        headers: {
            "Content-Type": "Application/json"
        },
    })
        .then((response) => response.json())
        .then((actualData) => {
            if (successMsg != null)
                dispatch({
                    type: "CREATE_TOAST",
                    payload: {text: successMsg, header: "Success", type: "success"}
                })
            callback(actualData)
        })
        .catch(() =>
            dispatch({
                type: "CREATE_TOAST",
                payload: {text: failMsg, header: "Error", type: "danger"}
            })
        );
}