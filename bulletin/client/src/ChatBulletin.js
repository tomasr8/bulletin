import styles from "./ChatBulletin.module.scss"
import { useState } from "react"
import { ReactComponent as Logo } from "./logo.svg"
import TypingEffect from "./TypingEffect"

export default function Disclaimer() {
  const [messages, setMessages] = useState([])
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState("")

  const onClick = async e => {
    e.preventDefault()
    if (value) {
      setValue("")
      setQuestions([...questions, value])
      setLoading(true)
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: value })
      })
      const data = await response.json()
      setMessages([...messages, data.text])
      setLoading(false)
    }
  }

  let lastMessage = null
  if (loading) {
    lastMessage = "Loading..."
  } else {
    lastMessage = <TypingEffect text={messages.at(-1)} />
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.chat}>
        {questions.map((question, i) => (
          <div key={i}>
            <div className={styles.question}>
              <div>{question}</div>
            </div>
            <div className={styles.answer}>
              <Logo style={{ width: 40, minWidth: 40 }}></Logo>
              <div>
                {i === questions.length - 1 ? lastMessage : messages[i]}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <header className="card-header">
          <form onSubmit={onClick}>
            <input
              className="input"
              type="text"
              placeholder="Ask a question"
              value={value}
              onChange={e => setValue(e.target.value)}
            />
            <button className="button is-primary" type="submit">
              Send
              <span className="icon">
                <i className="fas fa-angle-down" aria-hidden="true"></i>
              </span>
            </button>
          </form>
        </header>
      </div>
      <div></div>
    </div>
  )
}
