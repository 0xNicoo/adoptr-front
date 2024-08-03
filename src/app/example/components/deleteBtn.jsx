'use client'

import { deleteExample } from "../actions"

const DeleteBtn =  ({id}) => {

    const onDelete = (id) => {
        deleteExample(id)
    }

    return(
        <button
            onClick={() => onDelete(id)}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition" 
        >
            Borrar
        </button>
    )
}

export default DeleteBtn