import { useState } from 'react'
import './App.css'

const initialCases = [
  { id: 'passport', title: 'Passport', detail: 'Travel document', group: 'Travel' },
  { id: 'sunglasses', title: 'Sunglasses', detail: 'Sunny-day essential', group: 'Essentials' },
  { id: 'camera', title: 'Camera', detail: 'Capture every stop', group: 'Travel' },
]

function App() {
  const [cases, setCases] = useState(initialCases)
  const [packed, setPacked] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [message, setMessage] = useState('Choose an item, then add it to your case.')

  const moveToCase = (id) => {
    const item = cases.find((caseItem) => caseItem.id === id)
    if (!item) return

    setCases((current) => current.filter((caseItem) => caseItem.id !== id))
    setPacked((current) => [...current, item])
    setActiveId(null)
    setMessage(`${item.title} added to your case.`)
  }

  const moveToShelf = (id) => {
    const item = packed.find((caseItem) => caseItem.id === id)
    if (!item) return

    setPacked((current) => current.filter((caseItem) => caseItem.id !== id))
    setCases((current) => [...current, item])
    setActiveId(null)
    setMessage(`${item.title} returned to the shelf.`)
  }

  const reset = () => {
    setCases(initialCases)
    setPacked([])
    setActiveId(null)
    setMessage('Your packing list has been reset.')
  }

  const handleDragStart = (event, id) => {
    event.dataTransfer.setData('text/plain', id)
    event.dataTransfer.effectAllowed = 'move'
    setActiveId(id)
  }

  const handleDrop = (event, destination) => {
    event.preventDefault()
    const id = event.dataTransfer.getData('text/plain')
    if (destination === 'case') moveToCase(id)
    else moveToShelf(id)
  }

  const renderItem = (item, inCase) => (
    <li key={item.id}>
      <button
        type="button"
        className={`item-card ${activeId === item.id ? 'is-selected' : ''}`}
        draggable
        aria-pressed={activeId === item.id}
        aria-describedby={`${item.id}-detail`}
        onClick={() => setActiveId((current) => (current === item.id ? null : item.id))}
        onDragStart={(event) => handleDragStart(event, item.id)}
      >
        <span className="item-mark" aria-hidden="true">{item.title.slice(0, 1)}</span>
        <span>
          <strong>{item.title}</strong>
          <span id={`${item.id}-detail`}>{item.detail}</span>
        </span>
        <span className="move-label">{inCase ? 'Packed' : 'Select'}</span>
      </button>
    </li>
  )

  return (
    <main>
      <a className="skip-link" href="#packing-board">Skip to packing board</a>
      <header className="site-header">
        <a className="brand" href="/" aria-label="Odyssei home">ODYSSEI<span aria-hidden="true">✦</span></a>
        <p>Pack light. Go far.</p>
      </header>

      <section className="intro" aria-labelledby="page-title">
        <p className="eyebrow">A small journey starts here</p>
        <h1 id="page-title">Pack for the<br />unexpected.</h1>
        <p className="lede">Pick up the things that matter. Leave room for the stories you haven’t found yet.</p>
      </section>

      <section id="packing-board" className="packing-board" aria-labelledby="board-title">
        <div className="board-heading">
          <div>
            <p className="eyebrow">01 / Packing list</p>
            <h2 id="board-title">Your carry-on</h2>
          </div>
          <button className="text-button" type="button" onClick={reset}>Reset list</button>
        </div>

        <p className="instructions" id="packing-instructions">
          Drag an item into the case, or select it and use the button below. You can also return packed items to the shelf.
        </p>
        <p className="status" role="status" aria-live="polite">{message}</p>

        <div className="board-grid">
          <section
            className="shelf panel"
            aria-labelledby="shelf-title"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleDrop(event, 'shelf')}
          >
            <div className="panel-heading">
              <h3 id="shelf-title">The shelf</h3>
              <span>{cases.length} items</span>
            </div>
            <ul className="item-list" aria-describedby="packing-instructions">
              {cases.map((item) => renderItem(item, false))}
            </ul>
            <button
              className="action-button"
              type="button"
              disabled={!activeId || !cases.some((item) => item.id === activeId)}
              onClick={() => moveToCase(activeId)}
            >
              Add selected to case <span aria-hidden="true">→</span>
            </button>
          </section>

          <section
            className="case panel"
            aria-labelledby="case-title"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleDrop(event, 'case')}
          >
            <div className="panel-heading">
              <h3 id="case-title">The case</h3>
              <span>{packed.length} packed</span>
            </div>
            <div className="case-lid" aria-hidden="true" />
            {packed.length ? (
              <ul className="packed-list" aria-describedby="packing-instructions">
                {packed.map((item) => renderItem(item, true))}
              </ul>
            ) : (
              <p className="empty-state">Your essentials will land here.</p>
            )}
            <button
              className="text-button return-button"
              type="button"
              disabled={!activeId || !packed.some((item) => item.id === activeId)}
              onClick={() => moveToShelf(activeId)}
            >
              Return selected item
            </button>
          </section>
        </div>
      </section>

      <footer>
        <p>Made for wandering, not rushing.</p>
        <p>© 2026 Odyssei</p>
      </footer>
    </main>
  )
}

export default App
