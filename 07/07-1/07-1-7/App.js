import PureCat from './Cat'

function App() {
  const [cats, setCats] = useState(["Biscuit","Jungile", "Qutlaw"])

  return (
    <>
      {
        cats.map((name, i) => (
          <PureCat key = {i} name={name} />
        ))
      }

      <button onClick={() => setCats([...cats, prompt("Name a cat")])}>
        Add a Cat
      </button>
    </>
  )
}

