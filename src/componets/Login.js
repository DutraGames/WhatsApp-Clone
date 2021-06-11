import React from 'react'
import './Login.css'

import api from '../api'

export default ({onRecive}) => {
    const LoginGoogle = async () =>{
        let result = await api.gbPopup()
        if (result){
            onRecive(result.user)
        }else{
            alert("Erro!")
        }
    }


    return(
        <div className="Login">
            <button onClick={LoginGoogle}>Google</button>
        </div>)
}