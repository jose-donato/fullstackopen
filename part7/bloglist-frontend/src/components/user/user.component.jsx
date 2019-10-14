import React, {useEffect, useState} from 'react'
import usersService from '../../services/users'
const User = ({userId}) => {
    const [user, setUser] = useState(null)
    useEffect(() => {
        const fetchData = async () => {
            const response = await usersService.getOne(userId)
            setUser(response)
        }
        fetchData()
    }, [])

    return (
        user ? <div>
                    <h1>{user.name}</h1>
                    <h2>added blogs</h2>
                    <ul>
                        {user.blogs.map(b => 
                            <li key={b.id}>{b.title}</li>
                            )}
                    </ul>
                </div>    
                : 
                <h1>loading</h1>
    )
}

export default User