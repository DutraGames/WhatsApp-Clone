import React, {useState, useEffect} from 'react'
import './NewChat.css'
import Api from '../api'

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { List } from '@material-ui/core';
import api from '../api';

export default({user, chatlist, show, setShow}) =>{


    const CloseChat = () => {
        setShow(false)
    }

    const [list, setList] = useState([])

    useEffect(() =>{
        const getList = async () =>{
            if (user !== null) {
                let results = await api.getContactUsers(user.id)
                setList(results)
            }
        }
        getList()
    }, [user])

    const addNewChat = async(user2) =>{
        await api.addNewChat(user, user2)

        handleClose()
    }

    const handleClose = () =>{
        setShow(false)
    }



    return (
        <div className="NewChat" style={{left: show?0:-415}}>
            <div className="NewChat-head">
                <div onClick={CloseChat} className="NewChat-back">
                    <ArrowBackIcon style={{color: '#FFF'}} />
                </div>

                <div className="NewChat-title">Nova conversa</div>
            </div>

            <div className="NewChat-list">
                 {list.map((item, key) =>(
                     <div onClick={()=> addNewChat(item)} className="NewChat-item" key={key}> 
                        <img className="NewChat-avatar" src={item.avatar} alt=""></img>
                        <div className="NewChat-name">{item.name}</div>
                     </div>
                 ))}   
            </div>
        </div>
    )
}