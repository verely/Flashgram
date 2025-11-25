import express from 'express'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { getSuggestedComment } from './aiSuggest.controller.js'

export const aiSuggestRouter = express.Router()

aiSuggestRouter.post('/comment-suggest', requireAuth, getSuggestedComment)
