import React, { useState, useEffect } from 'react'

function App() {
  const [val, set] = useState('')
  const [phrase, setPhrase] = useState('example phrase')

  const createPhrase = () => {
    setPhrase(val)
    set('')
  }

  useEffect(() => {
    console.log(`typing ${val} ... `)
  })

  useEffect(() => {
    console.log(`typing ${phrase} ... `)
  })

  return (
    <>
      <label>Favorite phrase</label>
      <input
        value={val}
        placeholder={phrase}
        onChange={e=> set(e.target.value)}
      />
      <button onClick={createPhrase}>Send</button>    
    </>
  )
}

export default App