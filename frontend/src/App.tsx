import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Main } from "./pages/Main"
import { Layout } from "./components/layout"

import './styles/global.scss'
import { SignUpPage } from "./pages/SignUpPage"
import { LoginPage } from "./pages/LoginPage"
import { ProfilePage } from "./pages/ProfilePage"
import { EditProfilePage } from "./pages/EditProfilePage"
import { AddSkillRequest } from "./pages/AddSkillRequest"
import ChatPage from "./pages/ChatPage"

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignUpPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="user/:otherProfileId" element={<ProfilePage />} />
          <Route path="/addInfo" element={<EditProfilePage />} />
          <Route path="/editProfile" element={<EditProfilePage />} />
          <Route path="/skillCreate" element={<AddSkillRequest />} />
          <Route path="/skilledit/:skillId" element={<AddSkillRequest />} />
          <Route path="/chats" element={<ChatPage />} />
          <Route path="/chats/:chatId" element={<ChatPage />} />
          <Route path="/search" element={<Main />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
