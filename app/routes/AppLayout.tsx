import { Outlet } from 'react-router'
import Footer from '~/components/Footer'
import Navbar from '~/components/Navbar'

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default AppLayout
