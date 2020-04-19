import axios from 'axios';

const generateColorFromAPI = data => {
    return axios.post('http://colormind.io/api/', data)
}

const scrapeBehance = keyword => {
    return axios.get(`http://localhost:5000/be/${keyword}`)
}

const scrapePinterest = keyword => {
    return axios.get(`http://localhost:5000/pin/${keyword}`)
}

const scrapeDribbble = keyword => {
    return axios.get(`http://localhost:5000/drib/${keyword}`)
}

const scrapeDribbbleColor = color => {
    return axios.get(`http://localhost:5000/drib-color/${color}`)
}

const getImagePexels = keyword => {
    return axios.get(`http://api.pexels.com/v1/search?query=${keyword}&per_page=16&page=1`, {
        headers: {
            'Authorization': '563492ad6f91700001000001fba8fb5f62f44857b8580e9c1e075612'
        }
    })
}

const getCoolorsPallete = keyword => {
    return axios.get(`http://localhost:5000/cool/${keyword}`)
}

export { generateColorFromAPI, scrapeBehance, scrapeDribbble, scrapeDribbbleColor, scrapePinterest, getCoolorsPallete, getImagePexels }