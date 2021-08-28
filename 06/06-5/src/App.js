import React, { useState } from "react"
import colorData from './data/color-data.json'
import ColorList from './components/ColorList'
import AddColorForm from "./components/AddColorForm"

export default function App() {
  const [colors, setColors] = useState(colorData);

  const removeColor = id => {
    const newColors = colors.filter(color => color.id !== id);
    setColors(newColors);
  };

  const rateColor = (id, rating) => {
    const newColors = colors.map(color =>
      color.id === id ? { ...color, rating } : color
    );
    setColors(newColors);
  };

  return (
    <>
      <AddColorForm
          onNewColor={(title, color) => alert(`TODO: Create ${title} - ${color}`)}
      />
      <ColorList
        colors={colors}
        onRemoveColor={removeColor}
        onRateColor={rateColor}
      />
    </>
  );
}