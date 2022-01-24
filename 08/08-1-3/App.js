import React, { useState, useEffect } from "react"

function GithubUser({ name }) {
  const [data, setData] = useState()

  useEffect(() => {
    if(!name) return 
      fetch(`https://api.github.com/users/${name}`)
        .then(response => response.json())
        .then(setData)
        .catch(console.error)
    }, [name])

  if(data) {
    return <pre>{JSON.stringify(data, null, 2)}</pre>
  }
}

export default function App() {
  return <GithubUser name="sim-eunzi" />
}