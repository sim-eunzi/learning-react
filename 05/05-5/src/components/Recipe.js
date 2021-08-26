// ./src/components/Recipe.js
import React from 'react'
import IngredientList from './IngredientList'
import Instructions from './Instructions'

export default function Recipe({ name, ingredients, steps }) {
  return (
    <section id={name.toLowerCase().replace(/ /g, "-")}>
      <h1>{name}</h1>
      <IngredientList list={ingredients} />
      <Instructions title="조리 절차" step={steps} />
    </section>  
  )
}