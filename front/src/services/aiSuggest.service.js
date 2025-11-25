import Axios from 'axios'

const BASE_URL = import.meta.env.VITE_DEV_ENV === 'true'
  ? '//localhost:3000/api/ai/'
  : '/api/ai/'

var axios = Axios.create({
    withCredentials: true
})

export const aiSuggestService = {
    getCommentSuggestions
}

async function getCommentSuggestions(text) {
    try {
        const { data } = await axios.post(`${BASE_URL}/comment-suggest`, {text})
        return data
    } catch (err) {
        console.error('Failed to get AI suggestions:', err.message)
        throw new Error('AI service temporarily unavailable. Please try again later.')
    }
}
