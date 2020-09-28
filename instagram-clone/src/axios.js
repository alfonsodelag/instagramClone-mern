import axios from 'axios';

const instance = axios.create({
    baseUrl: 'https://alfonso-insta-backend.herokuapp.com/'
})

export default instance;