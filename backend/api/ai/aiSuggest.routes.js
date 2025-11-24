import express from 'express'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { getSuggestedComment } from './aiSuggest.controller.js'

export const router = express.Router()

router.post('/comment-suggest', requireAuth, getSuggestedComment)
