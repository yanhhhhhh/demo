import { Outlet } from "react-router-dom";
import HeroNav from '@/components/nav';
import './App.css'

function App() {

  return (
    <>
      <HeroNav />
      <Outlet />
    </>
  )
}

export default App
