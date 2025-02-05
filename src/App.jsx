import { useState } from 'react'
import './App.css'
import StudentTable from './components/StudentTable'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>

     <StudentTable />
     
    </>
  )
}

export default App
