import { useContext, useState } from 'react'
import { ShopContext } from '../../context/ShopContext'

const AdminLogin = () => {

  const { isAdmin, setIsAdmin } = useContext(ShopContext)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    setIsAdmin(true)
  }

  return !isAdmin && (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-40 flex items-center text-sm text-[80%]">
      <form onSubmit={onSubmitHandler} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
        <h3 className='bold-28 mx-auto mb-3'>
          <span className='capitalize text-secondary'>Admin</span> Login
        </h3>

        <div className='w-full'>
          <p className='medium-14'>Email</p>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder='Type here...'
            className='border border-gray-200 rounded w-full p-2 mt-1 outline-tertiary'
            required
          />
        </div>

        <div className='w-full'>
          <p className='medium-14'>Password</p>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder='Type here...'
            className='border border-gray-200 rounded w-full p-2 mt-1 outline-tertiary'
            required
          />
        </div>

        <button type='submit' className='btn-secondary w-full rounded !py-2.5'>
          Login
        </button>
      </form>
    </div>
  )
}

export default AdminLogin