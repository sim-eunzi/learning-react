import React, {useEffect, useState} from 'react'

function Checkbox {
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    alert(`checked : ${checked.toString()}`)
  })

  return (
    <>
      <input type="checkbox" value={checked} onChange={() => setChecked = !checked.toString()} />
      { checked ? 'checked' : 'not Checked' }
    </>
  )
}