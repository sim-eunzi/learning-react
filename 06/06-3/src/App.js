import React, { useState } from "react"
import colorData from './data/color-data.json'
import ColorList from './components/ColorList'

function App() {
  const [colors, setColors] = useState(colorData)

  return (
    <ColorList colors={colors.colors} onRemoveColor={id => {
      const newColors = colors.colors.filter(color => color.id !== id)
      setColors({ colors: newColors })
    }} />
  );
}

export default App;
