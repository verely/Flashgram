import axios from 'axios'
import { logger } from '../../services/logger.service.js'

const AI_COMMENT_API_URL = 'https://ai-comment-service.onrender.com/suggest-comment'

export const aiSuggestService = {
    suggestComment,
  }

async function suggestComment(text) {
    try {
        logger.info(`Requesting AI suggestions for text: "${text.substring(0, 50)}..."`)

        const { data } = await axios.post(AI_COMMENT_API_URL, { text })

        logger.info(`AI service responded with ${data.suggestions?.length || 0} suggestions`)
        return data.suggestions
    } catch (err) {
        logger.error('AI service error:', err.message)
        throw new Error('AI suggestion failed')
    }
}
