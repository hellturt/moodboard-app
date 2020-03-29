import axios from 'axios';

const generateColorFromAPI = data => {
    return axios.post('http://colormind.io/api/', data)
}

export { generateColorFromAPI }