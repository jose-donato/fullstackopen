import {useState} from 'react'
import axios from 'axios'

export const useField = (type) => {
    const [value, setValue] = useState('')

    const onChange = (event) => {
        setValue(event.target.value)
    }

    const reset = () => {
        setValue('')
    }

    return {
        type,
        value,
        onChange,
        reset
    }
}

export const useResource = (baseUrl) => {
    const [value, setValue] = useState([])

    let token = null

    const setToken = newToken => {
        token = `bearer ${newToken}`
    }

    const getAll = async () => {
        const response = await axios.get(baseUrl)
        return response.data
    }

    const create = async (newObject, newToken) => {
        token = `bearer ${newToken}`
        const config = {
            headers: { Authorization: token },
        }
        const response = await axios.post(baseUrl, newObject, config)
        return response.data
    }

    const update = async (id, newObject) => {
        const response = await axios.put(`${baseUrl}/${id}`, newObject)
        return response.data
    }

    const remove = async (id, data) => {
        const headers = {
            Authorization: token
        }
        await axios.delete(`${baseUrl}/${id}`, { headers, data })
    }

    return [value, { getAll, create, update, remove, setToken, setValue }]
}