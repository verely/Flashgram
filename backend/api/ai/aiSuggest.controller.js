import { aiSuggestService } from './aiSuggest.service.js'

export async function getSuggestedComment(req, res) {
  try {
    const { text } = req.body
    const suggestion = await aiSuggestService.suggestComment(text)
    res.json(suggestion)
  } catch (err) {
    res.status(500).json({ error: 'Failed to get AI suggestion' })
  }
}