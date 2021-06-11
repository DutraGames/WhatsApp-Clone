import React, {useState, useEffect, useRef} from 'react'
import EmojiPicker from 'emoji-picker-react'
import './ChatWindow.css'
import MensageItem from './MensageItem'
import Api from '../api'

//icones
import SearchIcon from '@material-ui/icons/Search'
import AttachFileIcon from '@material-ui/icons/AttachFile'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import CloseIcon from '@material-ui/icons/Close'
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon'
import SendIcon from '@material-ui/icons/Send'
import MicIcon from '@material-ui/icons/Mic';
import { keys } from '@material-ui/core/styles/createBreakpoints'
import api from '../api'


export default ({user, data}) => {

    let recognition  = null
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (SpeechRecognition !== undefined){
        recognition = new SpeechRecognition()
    }


    const body = useRef()

    const [EmojiOpen, setEmojiOpen] =  useState(false)

    const [text, setText] = useState('')

    const [ouve, setOuve] = useState(false)

    const [list, setList] = useState([])

    const [users, setUsers] = useState([])

    useEffect(()=>{
        if(body.current.scrollHeight > body.current.offsetHeight){
            body.current.scrollTop = body.current.scrollHeight - body.current.offsetHeight
        }
    }, [list])

    const handleEmojiClick = (e, emojiObject) =>{
        setText(text + emojiObject.emoji)
    }

    const EmojiClickOpen = () =>{
        setEmojiOpen(true) 
    }

    const EmojiClickClose = () =>{
        setEmojiOpen(false) 
    }

    const handleSendClick = ()=>{
        if(text !== ''){
            api.sendMessage(data, user.id, 'text', text, users)
            setText('')
            setEmojiOpen(false)
        }
    }

    const inputkeyUp = (e) => {
        if(e.keyCode === 13){
            handleSendClick()
        }
    }

    const handleMicClick = ()=>{
         
        if(recognition !== null){
            recognition.onstart = () =>{
                setOuve(true)
            }

            recognition.onend = () =>{
                setOuve(false)
            }

            recognition.onresult = (e) =>{
                setText(e.results[0][0].transcript)
            }

            recognition.start()
        }
    }

    useEffect(()=>{
        setList([])
        let unsub = api.onChatContent(data.chatId, setList, setUsers)
        return unsub
    }, [data.chatId])


    return (
        <div className="ChatWindow">
            <div className="ChatWindow-header">
                <div className="ChatWindow-info">
                    <img className="ChatWindow-avatar" src={data.image} alt=""></img>
                    <div className="ChatWindow-name">{data.title}</div>
                </div>

                <div className="ChatWindow-buttons">

                    <div className="ChatWindow-btn">
                        <SearchIcon style={{color: '#919191'}} />
                    </div>

                    <div className="ChatWindow-btn">
                        <AttachFileIcon style={{color: '#919191'}} />
                    </div>

                    <div className="ChatWindow-btn">
                        <MoreVertIcon style={{color: '#919191'}} />
                    </div>
                </div>
            </div>

            <div ref={body} className="ChatWindow-body">
                {list.map((item, key) =>(
                    <MensageItem 
                    key={key}
                    data={item}
                    user={user}
                    />
                ))}
            </div>

            <div className="ChatWindow-emojiarea"
            style={{height: EmojiOpen ? '200px' : '0px'}}>
                <EmojiPicker 
                onEmojiClick={handleEmojiClick}
                disableSearchBar
                disableSkinTonePicker
                />
            </div>

            <div className="ChatWindow-footer">
                
                <div className="ChatWindow-pre">

                <div className="ChatWindow-btn"
                onClick={EmojiClickClose}
                style={{width: EmojiOpen?40:0}}
                >
                        <CloseIcon style={{color: '#919191'}} />
                    </div>

                    <div className="ChatWindow-btn"
                    onClick={EmojiClickOpen}>
                        <InsertEmoticonIcon style={{color: EmojiOpen?'#009688':'#919191'}} />
                    </div>

                </div>

                <div className="ChatWindow-inputarea">
                    <input className="ChatWindow-input" 
                    type="text" 
                    placeholder="Digite uma mensagem"
                    value={text}
                    onChange={e=>setText(e.target.value)}
                    onKeyUp={inputkeyUp}
                    
                    ></input>
                </div>

                <div className="ChatWindow-pos">

                    {text === '' &&
                    <div className="ChatWindow-btn"
                    onClick={handleMicClick}>
                        <MicIcon style={{color: ouve?'#126ECE':'#919191'}} />
                    </div>
                    }

                    {text !== '' &&
                    <div className="ChatWindow-btn"
                    onClick={handleSendClick}>
                        <SendIcon style={{color: '#919191'}} />
                    </div>
                    }

                </div>

            </div>
        </div>
    )
}