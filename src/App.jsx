import React, { useState, useEffect } from 'react'
import Landing from './components/Landing'
import Quiz from './components/Quiz'
import EndScreen from './components/EndScreen'

// Customizable constants
const TITLE = "REAL NADS QUIZZES"
const WARNING_TEXT = "THIS IS ONLY FOR BRAVE NADS"
const LOGO_URL = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%233b82f6'/%3E%3Ctext x='50' y='65' font-family='Arial' font-size='40' font-weight='bold' fill='white' text-anchor='middle'%3EM%3C/text%3E%3C/svg%3E"

function App() {
  const [currentScreen, setCurrentScreen] = useState('landing')
  const [score, setScore] = useState(0)
  const [questions, setQuestions] = useState([])

  const startQuiz = (fetchedQuestions) => {
    setQuestions(fetchedQuestions)
    setCurrentScreen('quiz')
  }

  const endQuiz = (finalScore) => {
    setScore(finalScore)
    setCurrentScreen('end')
  }

  const restartQuiz = () => {
    setScore(0)
    setQuestions([])
    setCurrentScreen('landing')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentScreen === 'landing' && (
        <Landing 
          title={TITLE}
          logoUrl={LOGO_URL}
          warningText={WARNING_TEXT}
          onStart={startQuiz}
        />
      )}
      {currentScreen === 'quiz' && (
        <Quiz 
          questions={questions}
          onEnd={endQuiz}
        />
      )}
      {currentScreen === 'end' && (
        <EndScreen 
          score={score}
          onRestart={restartQuiz}
          totalQuestions={questions.length}
        />
      )}
    </div>
  )
}

export default App
