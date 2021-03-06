import React, { useState, useEffect } from 'react';
import Pusher from 'pusher-js'
import Post from './Post'
import './App.css';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles'
import { auth, db } from './firebase'
import { Button, Input } from '@material-ui/core';
import FlipMove from 'react-flip-move'
import ImageUpload from './ImageUpload'
import InstagramEmbed from 'react-instagram-embed';
import axios from './axios';

function getModalStyle() {
  const top = 50;
  const left = 40;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}% - ${left}%)`
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles()
  const [modalStyle] = React.useState(getModalStyle)

  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false)
  const [openSignIn, setOpenSignIn] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log("authUser: ", authUser)
        setUser(authUser)
      } else {
        // user has logged out
        setUser(null)
      }
    })
    return () => {
      // perform some cleanup actions
      unsubscribe();
    }
  }, [user, username]);

  const fetchPosts = async () =>

    await axios.get('https://alfonso-insta-backend.herokuapp.com/sync').then((response) => {
      setPosts(response.data)
    })

  useEffect(() => {
    const pusher = new Pusher('bc4934205742729be45a', {
      cluster: 'eu'
    });

    const channel = pusher.subscribe('posts');
    channel.bind('inserted', function (data) {
      //console.log('data received: ', data)
      fetchPosts();
    });
  }, [])


  useEffect(() => {
    fetchPosts();
  }, []);


  posts.forEach(post => {
    //console.log(".forEach posts >>>", post);
  })

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {

        auth
          .signInWithEmailAndPassword(email, password)
          .catch((error) => alert(error.message))

        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message))

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))

    // Closing the modal once you sign in
    setOpenSignIn(false)
  }

  return (
    <div className="app">

      {/* FIRST MODAL */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              type="username"
              placeholder="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      {/* SECOND MODAL */}
      <Modal
        // ! ?? open && and onClose?
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>

        </div>

      </Modal>

      <div className="app__header">
        <img
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />

        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
            <div className="app__loginContainer">
              <Button onClick={() => setOpenSignIn(true)}>Login</Button>
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
            </div>
          )}
      </div>

      <div className="app__posts">
        <div className="app__postsLeft">
          <FlipMove>
            {posts.map((post) => (
              <Post
                user={user}
                key={post._id}
                postId={post._id}
                username={post.user}
                caption={post.caption}
                imageUrl={post.image}
              />
            ))}
          </FlipMove>
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            url='https://www.instagr.am/p/Zw9o4'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            onFailure={() => { }}
          />
        </div>
      </div>

      {user ? (
        <ImageUpload username={user.displayName} />
      ) : (
          <h3 className="app__sorrymessage">Sorry you need to login to upload images</h3>
        )}
    </div >
  );
}

export default App;
