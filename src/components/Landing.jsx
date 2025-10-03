import React, { useState } from 'react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

const Landing = ({ title, logoUrl, warningText, onStart }) => {
  const [showWarning, setShowWarning] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleEnter = () => {
    setShowWarning(true)
  }

  const handleStart = async () => {
    setLoading(true)
    try {
      let userId = localStorage.getItem('nadsUserId')
      if (!userId) {
        userId = uuidv4()
        localStorage.setItem('nadsUserId', userId)
      }

      // Try to fetch from backend first
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'https://your-backend.onrender.com'
      
      try {
        const response = await axios.get(`${backendUrl}/api/quiz?userId=${userId}`)
        onStart(response.data)
      } catch (error) {
        console.warn('Backend not available, using placeholder questions')
        // Fallback to 5 placeholder questions for testing
        const placeholderQuestions = [
          {
            id: 1,
            text: "What is Monad's classification in the blockchain landscape?",
            options: {
              A: "Layer 2 (L2) Optimistic Rollup",
              B: "Proof-of-Authority Sidechain", 
              C: "High-performance Layer 1 (L1) blockchain",
              D: "Decentralized Storage Network"
            },
            correct: "C",
            difficulty: "Easy"
          },
          {
            id: 2,
            text: "What is Monad's primary target throughput in TPS?",
            options: {
              A: "1,000 TPS",
              B: "5,000 TPS",
              C: "10,000 TPS", 
              D: "25,000 TPS"
            },
            correct: "C",
            difficulty: "Easy"
          },
          {
            id: 3,
            text: "What is Monad's targeted finality time in milliseconds?",
            options: {
              A: "150 ms",
              B: "800 ms", 
              C: "1,500 ms",
              D: "3,000 ms"
            },
            correct: "B",
            difficulty: "Easy"
          },
          {
            id: 4,
            text: "Who is the co-founder and CEO of Monad Labs?",
            options: {
              A: "Chris Dixon",
              B: "Keone Hon", 
              C: "Anatoly Yakovenko",
              D: "Sam Bankman-Fried"
            },
            correct: "B",
            difficulty: "Easy"
          },
          {
            id: 5,
            text: "What was the size of Monad Labs' Seed Round funding?",
            options: {
              A: "$5 million",
              B: "$19 million", 
              C: "$50 million",
              D: "$100 million"
            },
            correct: "B",
            difficulty: "Easy"
          }
        ]
        onStart(placeholderQuestions)
      }
    } catch (error) {
      console.error('Failed to start quiz:', error)
      alert('Failed to start quiz. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!showWarning) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <img 
          src={logoUrl} 
          alt="Monad Logo" 
          className="w-32 h-32 mb-8"
        />
        <h1 className="text-5xl font-bold text-gray-800 mb-8 text-center">
          {title}
        </h1>
        <button
          onClick={handleEnter}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Enter
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-6">
          ⚠️ {warningText}
        </h2>
        <p className="text-gray-600 mb-8">
          Prove your knowledge about Monad Blockchain. Only the bravest NADS will succeed.
        </p>
        <button
          onClick={handleStart}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg w-full transition-all duration-300 transform hover:scale-105"
        >
          {loading ? 'Loading...' : 'Start Quiz'}
        </button>
      </div>
    </div>
  )
}

export default Landing
