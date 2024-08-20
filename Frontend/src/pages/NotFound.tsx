import { useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'


const REDIRECT_TIME = 5000

const NotFound = () => {
    useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        setTimeout(() => {
            navigate("/", { replace: true })
        }, REDIRECT_TIME)
    }, [])

    return (
        <main>
            <p>The page You are looking doesnt exists</p>
            <p>Let me help You.</p>
            <p>I ll redirect You to right place :D</p>
        </main>
    )
}

export default NotFound