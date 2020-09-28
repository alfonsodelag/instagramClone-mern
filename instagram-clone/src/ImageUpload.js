import React, { useState } from 'react'
import axios from './axios'
import { Button } from '@material-ui/core'
import firebase from 'firebase'
import { storage, db } from "./firebase";
import './ImageUpload.css'

function ImageUpload({ username }) {
    const [image, setImage] = useState(null)
    const [url, setUrl] = useState("")
    const [progress, setProgress] = useState(0)
    const [caption, setCaption] = useState('')

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Progress function...
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress)
            },
            (error) => {
                // Error function....
                console.log(error);
                alert(error.message)
            },
            () => {
                // Complete function
                // It's downloaded, now get a download link.
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then((url) => {
                        setUrl(url);

                        axios.post('http://localhost:8080/upload', {
                            caption: caption,
                            user: username,
                            image: url,
                        })
                            .then(response => console.log(response))
                            .catch(error => console.log(error))

                        // Post img inside db
                        db.collection("posts").add({
                            imageUrl: url,
                            caption: caption,
                            username: username,
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        });

                        setProgress(0)
                        setCaption("")
                        setImage(null)
                    })
            }
        )
    }

    return (
        <div className="imageupload">
            <progress className="imageUpload__progress" value={progress} max="100" />
            <input type="text" placeholder="Enter a caption" onChange={event => setCaption(event.target.value)} value={caption} />
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload
