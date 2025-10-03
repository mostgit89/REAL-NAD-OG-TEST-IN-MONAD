import React, { useState, useEffect, useCallback } from 'react'

const Quiz = ({ questions, onEnd }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [streak, setStreak] = useState(0)
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState(false)
  const [hiddenOptions, setHiddenOptions] = useState([])

  const getTimeForQuestion = (questionNumber) => {
    if (questionNumber <= 5) return 5
    if (questionNumber <= 10) return 6
    if (questionNumber <= 15) return 7
    if (questionNumber <= 20) return 8
    if (questionNumber <= 25) return 9
    return 10
  }

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length

  useEffect(() => {
    if (currentQuestion) {
      const time = getTimeForQuestion(currentQuestionIndex + 1)
      setTimeLeft(time)
      setSelectedAnswer(null)
      setShowFeedback(false)
      setHiddenOptions([])
      setFiftyFiftyUsed(false)
    }
  }, [currentQuestionIndex, currentQuestion])

  useEffect(() => {
    if (timeLeft > 0 && !showFeedback) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showFeedback && currentQuestion) {
      handleAnswerSelect(null)
    }
  }, [timeLeft, showFeedback, currentQuestion])

  const handleAnswerSelect = useCallback((answer) => {
    if (showFeedback || !currentQuestion) return

    setSelectedAnswer(answer)
    setShowFeedback(true)

    const isCorrect = answer === currentQuestion.correct

    if (isCorrect) {
      setScore(prev => prev + 1)
      setStreak(prev => prev + 1)
    } else {
      setStreak(0)
    }

    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
      } else {
        onEnd(score + (isCorrect ? 1 : 0))
      }
    }, 2000)
  }, [currentQuestion, showFeedback, currentQuestionIndex, totalQuestions, score, onEnd])

  const useFiftyFifty = () => {
    if (fiftyFiftyUsed || streak < 3 || !currentQuestion) return

    const wrongOptions = ['A', 'B', 'C', 'D'].filter(
      option => option !== currentQuestion.correct
    )
    
    const shuffled = [...wrongOptions].sort(() => Math.random() - 0.5)
    const optionsToHide = shuffled.slice(0, 2)
    
    setHiddenOptions(optionsToHide)
    setFiftyFiftyUsed(true)
    setStreak(0)
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h2>
        </div>
      </div>
    )
  }

  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100
  const timerPercentage = (timeLeft / getTimeForQuestion(currentQuestionIndex + 1)) * 100

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Question {currentQuestionIndex + 1}/{totalQuestions}
            </h2>
            <p className="text-sm text-gray-600 capitalize">
              Difficulty: {currentQuestion.difficulty}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-blue-600">
              Score: {score}
            </p>
            <p className="text-sm text-gray-600">
              Streak: {streak}
            </p>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full progress-bar"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-1000 linear"
            style={{ width: `${timerPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          {currentQuestion.text}
        </h3>

        <div className="grid gap-4">
          {['A', 'B', 'C', 'D'].map(option => {
            if (hiddenOptions.includes(option)) return null

            const isSelected = selectedAnswer === option
            const isCorrect = currentQuestion.correct === option
            let buttonClass = "bg-gray-100 hover:bg-gray-200 border-2 border-gray-300"

            if (showFeedback) {
              if (isCorrect) {
                buttonClass = "bg-green-500 text-white border-green-500 glow-correct"
              } else if (isSelected) {
                buttonClass = "bg-red-500 text-white border-red-500 glow-wrong"
              }
            } else if (isSelected) {
              buttonClass = "bg-blue-100 border-blue-500"
            }

            return (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                disabled={showFeedback}
                className={`p-4 rounded-xl text-left font-medium transition-all duration-300 ${buttonClass}`}
              >
                <span className="font-bold mr-3">{option}.</span>
                {currentQuestion.options[option]}
              </button>
            )
          })}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={useFiftyFifty}
          disabled={fiftyFiftyUsed || streak < 3}
          className={`px-6 py-3 rounded-lg font-bold transition-all ${
            fiftyFiftyUsed || streak < 3
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 text-white hover:scale-105'
          }`}
        >
          50-50 Lifeline {streak >= 3 && !fiftyFiftyUsed && '🔥'}
        </button>
        {streak < 3 && !fiftyFiftyUsed && (
          <p className="text-sm text-gray-600 mt-2">
            Get 3 consecutive correct answers to unlock
          </p>
        )}
      </div>
    </div>
  )
}

export default Quiz
