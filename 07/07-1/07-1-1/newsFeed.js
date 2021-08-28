import React, { useState, useEffect } from 'react'

export default function NewsFeed() {
  const [posts, setPosts] = useState([])
  const addPost = post => setPosts(allPosts => [post, ...allPosts])

  useEffect(() => {
    newsFeed.subscripbe(addPost) // 구독하기 
    welcomeChime.play()          // 벨 울리기 

    return () => {
      newsFeed.unsubscribe()     // 구독취소
      goodbyeChime.play()        // 취소벨 울리기  
    }
  })
}