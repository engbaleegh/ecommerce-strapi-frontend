const { default: axios } = require('axios');


const apiKey = process.env.NEXT_PUBLIC_REST_API_KEY;
const apiUrl = 'https://ingenious-kindness-ae8b02b104.strapiapp.com/api';

const axiosClient = axios.create({
  baseURL: apiUrl,
  headers: {
    Authorization: `Bearer ${apiKey}`,
  }});


  export default axiosClient;