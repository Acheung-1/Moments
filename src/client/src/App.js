import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'

// pages & components
import Home from './pages/Home'
import MyProfile from './pages/MyProfile'
import SinglePost from './pages/SinglePost'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import NoMatch from './pages/NoMatch'


function App() {
  const { user } = useAuthContext()

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route 
              exact path ="/"
              element = {user ? <Home /> : <Navigate to="/login" />}
              />
            <Route 
              path="/login" 
              element = {!user ? <Login/> : <Navigate to="/" />}
            />
            <Route 
              path="/signup" 
              element = {!user ? <SignUp/> : <Navigate to="/" />}
            />
            <Route 
              path ="/MyProfile"
              // element = { <MyProfile/> }
              element = {user ? <MyProfile /> : <Navigate to="/login" />}
              />
            <Route 
              path="/post/:id" 
              element = {user ? <SinglePost/> : <Navigate to="/login" />}
              />
            {/* <Route
              path="*"
              element = {user ? <NoMatch/> : <Navigate to="/login" />}
            /> */}
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </div>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
