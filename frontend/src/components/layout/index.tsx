import { Link, Outlet, useLocation } from 'react-router-dom'
// import * as routes from '../../lib/routes'
import css from './index.module.scss'
import { useEffect, useState } from 'react';
import { tokenExistCheck } from '../../services/tokenExistCheck';
import ChatPanel from '../Chat/ChatPanel';
// import { useSocket } from '../../services/useSocket';

export const Layout = () => {
  // const socket = useSocket();
  const [loggedIn, setLoggedIn] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const location = useLocation();
  const [headerOpen, setHeaderOpen] = useState(false);
  const isChatPage = location.pathname.startsWith('/chats');


  useEffect(() => {
    setLoggedIn(tokenExistCheck());
  }, [location.pathname]);
  
  return (
    <div className={css.layout}>
      <header className={css.headerContainer}>
        <nav className={`${css.header} ${headerOpen ? css.open : ''}`}>
          <Link className={css.headerLink} to="/">
            <span className={css.logo}>SkillSwap</span>
          </Link>
          <Link className={css.headerLink} to='/'>
            Home
          </Link>
          {!loggedIn ?(
            <>
            <Link className={css.headerLink} to='/register'>
            Sign Up
          </Link>
          <Link className={css.headerLink} to='/login'>
            Sign In
          </Link>
          <div className={`${css.burger} ${headerOpen ? css.active : ''}`} onClick={() => setHeaderOpen(!headerOpen)}>
            <span className={css.burgerLine}></span>
            <span className={css.burgerLine}></span>
            <span className={css.burgerLine}></span>
          </div>
            </>
          ) : (
          <>
            <Link className={css.headerLink} to='/profile'>
              Profile
            </Link>
            <Link className={css.headerLink} to='/skillCreate'>
              Create Skill Request
            </Link>
            
            <Link className={css.headerLink} to='/search'>
              Search
            </Link>
            <div className={`${css.burger} ${headerOpen ? css.active : ''}`} onClick={() => setHeaderOpen(!headerOpen)}>
            <span className={css.burgerLine}></span>
            <span className={css.burgerLine}></span>
            <span className={css.burgerLine}></span>
          </div>
          </>)}
        </nav>
      </header>
      <main>

        <Outlet />
      </main>
      {loggedIn && !isChatPage && (
        <>
          <button className={css.fabChat} onClick={() => setShowChat(true)} aria-label="Open chat">
            💬
          </button>
          <ChatPanel open={showChat} onClose={() => setShowChat(false)} fullWidth={false}/>
        </>
      )}
    </div>
  )
}
