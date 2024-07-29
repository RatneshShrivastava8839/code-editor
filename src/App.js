import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import EditorPage from './pages/EditorPage'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Toaster
          position="top-right"
          toastOptions={{
            success:{
              theme:{
                primary:'#00ffc3',
              },
            },
          }}
          ></Toaster>
      </div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/editor/:roomID' element={<EditorPage/>}></Route>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
