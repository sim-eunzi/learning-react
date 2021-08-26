import React, { useState } from 'react'
import { FaStar } from 'react-icons/fa'

const Star = ({ selected = false, onSelect = f => f }) => (
  <FaStar color={selected ? 'red' : 'grey'} onClick={onSelect}  />
)

const createArray = length => [...Array(length)]

export default function StarRating({ selectedStars = 0, totalStars = 5 }) {
  return (
    <div>
    {
      createArray(totalStars).map((n, i) => (
        <Star 
          key={i} 
          selected={selectedStars > i}  />
      ))
    }
    <p>
      {selectedStars} / {totalStars}
    </p>
    </div>
  )
}


