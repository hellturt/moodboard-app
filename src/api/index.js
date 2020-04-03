import axios from 'axios';

const generateColorFromAPI = data => {
    return axios.post('http://colormind.io/api/', data)
}

const scrapePinterest = keyword => {
    return axios.get(`http://localhost:5000/${keyword}`)
}

const getImagePexels = keyword => {
    return axios.get(`http://api.pexels.com/v1/search?query=${keyword}&per_page=16&page=1`, {
        headers: {
            'Authorization': '563492ad6f91700001000001fba8fb5f62f44857b8580e9c1e075612'
        }
    })
}

export { generateColorFromAPI, scrapePinterest, getImagePexels }