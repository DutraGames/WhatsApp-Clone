import React, {useState, useEffect} from 'react'
import './App.css'
import ChatListaItem from './componets/ChatListaItem'
import Intro from './componets/Intro'
import ChatWindow from './componets/ChatWindow'
import NewChat from './componets/NewChat'
import Login from './componets/Login'
import Api from './api'

//icones Gerais
import DonutLargeIcon from '@material-ui/icons/DonutLarge'
import ChatIcon from '@material-ui/icons/Chat'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import SearchIcon from '@material-ui/icons/Search'
import api from './api'




export default () => {
  
  //Variáveis
  const [chatlist, setChatList] = useState([])

  const [chatActive, setChatActive] = useState([{}])

  const [ShowChat, setShowChat] = useState(false)
 
  const [user, setUser] = useState(null)

  useEffect(()=>{
    if(user !== null){
      let unsub = api.onChatList(user.id, setChatList)
      return unsub
    }
  }, [user])  

  const LoginData = async (u) =>{
    let newUser = {
      id: u.uid,
      name: u.displayName,
      avatar: u.photoURL
    }

    await api.addUser(newUser)
    setUser(newUser)
  }

  if (user === null){
    return (<Login  onRecive={LoginData} />)
  }

  const OpenChat = () =>{
    setShowChat(true)
  }

  


  return (
      <div className="Windows">
        <div className="Contato">

          <NewChat 
            chatlist={chatlist}
            user={user}
            show={ShowChat}
            setShow={setShowChat}
          />

          <header>
            <img className="header-avatar" src={user.avatar} alt=""></img>
            <div className="header-buttons">
            <div className="header-btn">
                <DonutLargeIcon style={{color: '#919191'}} />
              </div>

              <div onClick={OpenChat} className="header-btn">
                <ChatIcon style={{color: '#919191'}} />
              </div>

              <div className="header-btn">
                <MoreVertIcon style={{color: '#919191'}} />
              </div>
            </div>
          </header>

          <div className="search">
            <div className="search-input">
              <SearchIcon fontSize="small" style={{color: '#919191'}} />
              <input type="search" placeholder="Procurar ou começar uma nova conversa..."></input>
            </div>
          </div>

          <div className="Lista">
            {chatlist.map((item, key) => (
              <ChatListaItem 
              key={key}
              data={item}
              active={chatActive.chatId === chatlist[key].chatId} 
              onClick={() => setChatActive(chatlist[key])}              
              />
            ))}
          </div>
        </div>

        <div className="Content">

          {chatActive.chatId !== undefined &&
            <ChatWindow 
              user={user}
              data={chatActive}
          />}

        {chatActive.chatId === undefined &&
          <Intro />}
        </div>
      </div>
  )
}

