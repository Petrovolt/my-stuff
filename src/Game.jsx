import { useState, useEffect, useRef, useCallback } from 'react'

function Game({ questionsData, onGameEnd }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [timeLeft, setTimeLeft] = useState(10)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef(null)
  const countdownRef = useRef(null)

  // Get all questions flattened
  const getAllQuestions = () => {
    if (!questionsData || !questionsData.sections) return []
    const allQuestions = []
    questionsData.sections.forEach((section, sectionIdx) => {
      section.questions.forEach((question, qIdx) => {
        allQuestions.push({
          ...question,
          sectionIndex: sectionIdx,
          questionIndex: qIdx,
          sectionNumber: section.section_number
        })
      })
    })
    return allQuestions
  }

  const allQuestions = getAllQuestions()
  const currentQuestion = allQuestions[currentQuestionIndex]

  const handleAnswerSelect = useCallback((answer) => {
    setSelectedAnswer((prev) => {
      if (prev !== null) return prev // Already answered
      return answer
    })
    
    setShowExplanation(true)
    setIsPaused(true)

    const isCorrect = answer === currentQuestion?.correct_answer
    setScore((prevScore) => ({
      correct: prevScore.correct + (isCorrect ? 1 : 0),
      total: prevScore.total + 1
    }))
  }, [currentQuestion])

  const nextQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => {
      if (prev < allQuestions.length - 1) {
        return prev + 1
      } else {
        // Game complete
        setScore((finalScore) => {
          if (onGameEnd) {
            onGameEnd(finalScore)
          }
          return finalScore
        })
        return prev
      }
    })
    setSelectedAnswer(null)
    setShowExplanation(false)
    setIsPaused(false)
    setTimeLeft(10)
  }, [allQuestions.length, onGameEnd])

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(10)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setIsPaused(false)
  }, [currentQuestionIndex])

  // Countdown timer (only when not paused and not showing explanation)
  useEffect(() => {
    if (!currentQuestion || isPaused || showExplanation) return

    countdownRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up - auto-select wrong answer
          setSelectedAnswer((prevAnswer) => {
            if (prevAnswer === null) {
              handleAnswerSelect('')
            }
            return prevAnswer
          })
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current)
      }
    }
  }, [currentQuestion, currentQuestionIndex, isPaused, showExplanation, handleAnswerSelect])

  // Auto-advance after showing explanation (5 seconds)
  useEffect(() => {
    if (showExplanation) {
      timerRef.current = setTimeout(() => {
        nextQuestion()
      }, 5000)

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current)
        }
      }
    }
  }, [showExplanation, nextQuestion])

  const handleSkip = () => {
    nextQuestion()
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <h2 className="display-font text-4xl text-[#F4C76C] mb-4">Game Complete!</h2>
          <p className="text-slate-300 text-xl mb-6">
            Final Score: {score.correct} / {score.total}
          </p>
          <p className="text-slate-400">
            Accuracy: {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
          </p>
        </div>
      </div>
    )
  }

  const isCorrect = selectedAnswer === currentQuestion.correct_answer
  const isBossFight = (currentQuestionIndex + 1) % 10 === 0

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f1419] via-[#0a0a0a] to-[#0a0a0a]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(244,199,108,0.1)_0%,_transparent_70%)]"></div>

      {/* Game UI */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-3 h-3 rounded-full bg-[#00ff88] animate-pulse"></div>
              <span className="text-[#F4C76C] font-mono text-sm tracking-wider">
                QUESTION {currentQuestionIndex + 1} / {allQuestions.length}
              </span>
              {isBossFight && (
                <div className="px-4 py-1 bg-[#F4C76C]/10 border border-[#F4C76C]/30 rounded">
                  <span className="text-[10px] uppercase tracking-widest text-[#F4C76C] font-mono">
                    BOSS FIGHT
                  </span>
                </div>
              )}
            </div>
            <div className="text-slate-400 font-mono text-sm">
              Section {currentQuestion.sectionNumber} • Score: {score.correct}/{score.total}
            </div>
          </div>

          {/* Question Popup */}
          <div className="holographic-overlay terminal-frame p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F4C76C] to-transparent opacity-60"></div>

            {/* Timer */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></div>
                <span className="text-xs tracking-wider text-[#F4C76C] font-mono">
                  {!isPaused ? `${timeLeft}s` : 'PAUSED'}
                </span>
              </div>
              {!showExplanation && (
                <button
                  onClick={handleSkip}
                  className="text-xs text-slate-400 hover:text-[#F4C76C] font-mono transition-colors"
                >
                  SKIP →
                </button>
              )}
            </div>

            {/* Question */}
            <div className="mb-8">
              <p className="text-slate-200 leading-relaxed mb-6 text-lg md:text-xl">
                {currentQuestion.question}
              </p>

              {/* Answer Options */}
              <div className="space-y-3">
                {['A', 'B', 'C', 'D'].map((key) => {
                  const option = currentQuestion.options[key]
                  if (!option) return null

                  const isSelected = selectedAnswer === key
                  const isCorrectOption = key === currentQuestion.correct_answer
                  let buttonClass = "w-full text-left group relative overflow-hidden terminal-frame p-4 transition-all"

                  if (showExplanation) {
                    if (isCorrectOption) {
                      buttonClass += " border-2 border-[#00ff88] bg-[#00ff88]/10"
                    } else if (isSelected && !isCorrectOption) {
                      buttonClass += " border-2 border-red-500 bg-red-500/10"
                    } else {
                      buttonClass += " opacity-50"
                    }
                  } else {
                    buttonClass += " hover:border-[#F4C76C]/40 cursor-pointer"
                  }

                  return (
                    <button
                      key={key}
                      onClick={() => !showExplanation && handleAnswerSelect(key)}
                      disabled={showExplanation}
                      className={buttonClass}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-[#F4C76C] font-mono text-base font-bold min-w-[32px]">
                          {key})
                        </span>
                        <span className={`text-slate-300 text-base md:text-lg ${
                          !showExplanation ? 'group-hover:text-slate-50 transition-colors' : ''
                        }`}>
                          {option}
                        </span>
                      </div>
                      {showExplanation && isCorrectOption && (
                        <div className="absolute top-2 right-2 text-[#00ff88] font-mono text-xs">
                          ✓ CORRECT
                        </div>
                      )}
                      {showExplanation && isSelected && !isCorrectOption && (
                        <div className="absolute top-2 right-2 text-red-500 font-mono text-xs">
                          ✗ WRONG
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="mt-6 pt-6 border-t border-[#F4C76C]/20">
                <div className="flex items-start gap-3">
                  <span className="text-[#F4C76C] font-mono text-sm mt-1">▶</span>
                  <div>
                    <p className="text-[#00ff88] font-mono text-xs mb-2 uppercase tracking-wider">
                      {isCorrect ? 'CORRECT!' : 'INCORRECT'}
                    </p>
                    <p className="text-slate-300 leading-relaxed text-base">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-slate-400 font-mono text-xs">
                    Next question in 5s...
                  </p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-[#F4C76C]/10 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">[SELECT ANSWER]</span>
              <span className="text-[10px] text-slate-500 font-mono">
                Progress: {Math.round(((currentQuestionIndex + 1) / allQuestions.length) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Game

