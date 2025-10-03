import React, { useState, useEffect } from 'react'
import Confetti from 'react-confetti'

const EndScreen = ({ score, totalQuestions, onRestart }) => {
  const [showConfetti, setShowConfetti] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    if (score === totalQuestions) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 8000)
    }

    return () => window.removeEventListener('resize', updateDimensions)
  }, [score, totalQuestions])

  const perfectScore = score === totalQuestions

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative">
      {showConfetti && (
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          recycle={false}
        />
      )}
      
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        {perfectScore ? (
          <>
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-green-600 mb-4">
              YOU PROVED THAT YOU ARE A REAL NAD
            </h2>
            <p className="text-gray-600 mb-6">
              Perfect score! You have demonstrated exceptional knowledge of Monad Blockchain.
            </p>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Quiz Complete!
            </h2>
            <div className="text-5xl font-bold text-blue-600 mb-4">
              {score}/{totalQuestions}
            </div>
            <p className="text-gray-600 mb-6">
              {score >= totalQuestions * 0.8 
                ? "Excellent! You're well on your way to becoming a real NAD."
                : score >= totalQuestions * 0.6
                ? "Good effort! Keep learning about Monad."
                : "Keep studying! The path to becoming a real NAD requires dedication."
              }
            </p>
          </>
        )}

        <button
          onClick={onRestart}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg w-full transition-all duration-300 transform hover:scale-105"
        >
          Restart Quiz
        </button>
      </div>
    </div>
  )
}

export default EndScreen
