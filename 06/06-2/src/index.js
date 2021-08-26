// src/index.js 
import React from 'react'
import { render } from 'react-dom'
import StarRating from './components/StarRating'

render(<StarRating totalStars={5} style={{ backgroundColor: 'lightblue'}} />, document.getElementById('root'))