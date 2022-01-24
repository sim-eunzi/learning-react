import React, { useState, memo } from "react"

// const Cat = ({name}) => {
//   console.log(`rendering ${name}`)
//   return <p>{name}</p>
// }

// const PureCat = memo(Cat)

const PureCat = memo(({ name, meow = f => f}) => {
  console.log(`rendering ${name}`)
  return <p onClick={() => meow(name)}>{name}</p>
})

export default PureCat