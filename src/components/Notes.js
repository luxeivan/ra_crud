import { nanoid } from 'nanoid'
import React, { useState, useEffect } from 'react'

export default function Notes() {
    const [notes, setNotes] = useState([])
    const [newText, setNewText] = useState('')

    const handlerChangeText = (event) => {
        setNewText(event.target.value)
    }
    const update = () => {
        fetch('http://localhost:7777/notes')
            .then(res => res.json())
            .then(result => {
                setNotes(result)
            })
    }
    useEffect(() => {
        update()
    }, []);

    const handlerAdd = event => {
        fetch('http://localhost:7777/notes', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({
                "id": nanoid(),
                "content": newText
            })
        })
            .then(res => {
                if (res.ok) {
                    update()
                    setNewText('')
                }
            })

    }
    const handlerDel = event => {
        console.log(event.target.dataset.id)
        fetch(`http://localhost:7777/notes/${event.target.dataset.id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },

        })
            .then(res => {
                if (res.ok) {
                    update()
                }
            })
    }
    return (
        <div className='notes'>
            <div className='notes__title'>
                <h2>Notes</h2>
                <button onClick={update}>Обновить</button>
            </div>
            <ul className='notes__list'>
                {notes.map(item => <li className='notes__item' key={item.id}>{item.content} <button data-id={item.id} className='notes__del' onClick={handlerDel}>X</button></li>)}
            </ul>
            <textarea name="note" id="" cols="30" rows="10" value={newText} onChange={handlerChangeText}></textarea><button onClick={handlerAdd} className='notes__add'>Добавить</button>
        </div>
    )
}
