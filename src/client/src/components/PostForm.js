import { useState } from "react"
import { usePostsContext } from '../hooks/usePostsContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { useNavigate } from 'react-router-dom'
import imageIcon from '../assets/imageIcon.png'



const PostForm = () => {
    const { dispatch } = usePostsContext()
    const { user } = useAuthContext()

    const [title, setTitle] = useState('')
    const [image, setImage] = useState("")
    const [caption, setCaption] = useState('')
    const likes = 0
    const [error, setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])

    const navigate = useNavigate()

    const handleFileUpload = async (e) => {
        const file = e.target.files[0]
        const base64 = await convertToBase64(file)
        setImage(base64)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!user) {
            setError('You must be logged in')
            return
        }

        const post = {title, image, caption, likes}

        const response = await fetch('/api/posts', {
            method: 'POST',
            body: JSON.stringify(post),
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${user.token}`
            }
        })

        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
            setEmptyFields(json.emptyFields)

        }

        if (response.ok) {
            setTitle('')
            setImage('')
            setCaption('')
            setError(null)
            setEmptyFields([])
            // console.log('new post added', json)
            dispatch({type: 'CREATE_POST', payload: json})
            navigate('/')
        }
    }
    
    return ( 
        <form action="" className="create" onSubmit={handleSubmit}>
            <h3>Add a new post</h3>

            <label> Title:</label>
            <input 
                type="text" 
                onChange={(e) => setTitle(e.target.value)}
                value = {title}
                className={emptyFields.includes('title') ? 'error' : ''}
            />

            <label htmlFor="file-upload" className="custom-file-upload"> 
                <img className="uploaded-image" src={image|| imageIcon} alt="" />
            </label>
            <input className = "upload-image" 
                type="file" 
                label="image"
                name="image"
                id="file-upload"
                accept=".jpeg, .png, .jpeg"
                onChange={(e) => handleFileUpload(e)}
            />

            <label> Post caption:</label>
            <input 
                type="text" 
                onChange={(e) => setCaption(e.target.value)}
                value = {caption}
                className={emptyFields.includes('caption') ? 'error' : ''}
            />

            <button>Add Post</button>
            {error && <div className="error">{error}</div>}
        </form>
     );
}
 
export default PostForm;

function convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.readAsDataURL(file)
        
        fileReader.onload = () => {
            resolve(fileReader.result)
        }

        fileReader.onerror = (error) => {
            reject(error)
        }
    })
}