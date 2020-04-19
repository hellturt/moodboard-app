import axios from 'axios';

const url = 'http://moodly.illusionistdev.com:5000'
// const url = 'http://localhost:5000'

const scrapeBehance = keyword => {
    return axios.get(`${url}/be/${keyword}`)
}

const scrapePinterest = keyword => {
    return axios.get(`${url}/pin/${keyword}`)
}

const scrapeDribbble = keyword => {
    return axios.get(`${url}/drib/${keyword}`)
}

const scrapeDribbbleColor = color => {
    return axios.get(`${url}/drib-color/${color}`)
}

const getCoolorsPallete = keyword => {
    return axios.get(`${url}/cool/${keyword}`)
}

export { scrapeBehance, scrapeDribbble, scrapeDribbbleColor, scrapePinterest, getCoolorsPallete }