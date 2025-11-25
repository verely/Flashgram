import { useState } from 'react'
import EmojiPicker from 'emoji-picker-react'

import emoji from '../assets/img/PostPreview/emoji.svg'
import { aiSuggestService } from '../services/aiSuggest.service.js'

export function CommentArea({post, onAddCommentToPost, showIcon = false, iconSrc = '', isEmojiLarge=false,
    inputRef}) {

    const [postComment, setPostComment] = useState("")
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [showAISuggestions, setShowAISuggestions] = useState(false)
    const [aiSuggestions, setAiSuggestions] = useState([])
    const [isLoadingAI, setIsLoadingAI] = useState(false)
    const [aiError, setAiError] = useState(null)
    const commentsCount = post.comments?.length || 0
    const commentsSubtitle = commentsCount>1 ? "comments" : "comment"

    const addComment = () => {
        if (postComment.trim()) {
            console.log(postComment)
            onAddCommentToPost(post._id, postComment)
            setPostComment("")
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            addComment()
        }
    };

    const onEmojiClick = (event, emojiObject) => {
        setPostComment(prevComment => prevComment + event.emoji)
    }

    const handleGetAISuggestions = async () => {
        setIsLoadingAI(true)
        setAiError(null)
        setShowEmojiPicker(false)

        try {
            const postText = post.desc

            const suggestions = await aiSuggestService.getCommentSuggestions(postText, {
                provider: 'openai',
                numSuggestions: 3
            })

            setAiSuggestions(suggestions)
            setShowAISuggestions(true)
        } catch (err) {
            console.error('Failed to get AI suggestions:', err)
            setAiError(err.message || 'AI suggestions temporarily unavailable')

            // Auto-hide error after 3 seconds
            setTimeout(() => setAiError(null), 3000)
        } finally {
            setIsLoadingAI(false)
        }
    }

    const handleSelectSuggestion = (suggestion) => {
        setPostComment(suggestion)
        setShowAISuggestions(false)
        inputRef?.current?.focus()
    }

    return (
        <>
            {/* {commentsCount>0 && <div className="comment-count"> View {post.comments.length} {commentsSubtitle}</div>} */}

            <div className="comment-area">
                {showIcon && <img src={iconSrc} alt="Owner Icon" className="comment-owner-icon" />}
                <textarea
                    ref={inputRef}
                    value={postComment}
                    onChange={(e) => setPostComment(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Add a comment..."
                />

                {postComment.trim() && (
                    <div className="submit-comment" onClick={addComment}>
                        Post
                    </div>
                )}

                <div className={`ai-suggest-btn ${isLoadingAI ? 'loading' : ''}`}
                     onClick={handleGetAISuggestions} title='Get AI suggestions'>
                    {isLoadingAI ? (
                    <span className="ai-spinner">⏳</span>
                ) : (
                    <span className="ai-icon">✨</span>
                )}
                </div>

                <div className={`emoji ${isEmojiLarge? 'large' : ''}`} onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                    <img src={emoji} alt="Emoji" onClick={() => setShowEmojiPicker(!showEmojiPicker)}/>
                </div>
                {showEmojiPicker && (
                    <div className="emoji-picker">
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                    </div>
                )}

                {showAISuggestions && aiSuggestions.length > 0 && (
                    <div className="ai-suggestions-dropdown">
                        <div className="ai-suggestions-header">
                            <span>💡 AI Suggestions</span>
                            <button
                                className="close-btn"
                                onClick={() => setShowAISuggestions(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="ai-suggestions-list">
                            {aiSuggestions.map((suggestion, idx) => (
                                <div
                                    key={idx}
                                    className="ai-suggestion-item"
                                    onClick={() => handleSelectSuggestion(suggestion)}
                                >
                                    {suggestion}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {aiError && (
                    <div className="ai-error-toast">
                        {aiError}
                    </div>
                )}

            </div>
        </>
    )
}
