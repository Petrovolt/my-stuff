import { useState } from 'react'
import Game from './Game'

function Play() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [results, setResults] = useState(null)
  const [questionsData, setQuestionsData] = useState(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [finalScore, setFinalScore] = useState(null)

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0])
      setError('')
      setSuccess('')
      setResults(null)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.currentTarget.classList.add('dragover')
  }

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('dragover')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.currentTarget.classList.remove('dragover')
    
    if (e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0])
      setError('')
      setSuccess('')
      setResults(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setLoading(true)
    setError('')
    setSuccess('')
    setResults(null)

    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process file')
      }

      setQuestionsData(data.questions)
      setResults({
        totalSections: data.questions.total_sections,
        totalQuestions: data.total_questions
      })
      setSuccess('Questions generated successfully!')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!questionsData) return

    const jsonStr = JSON.stringify(questionsData, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'questions.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleStartGame = () => {
    if (questionsData) {
      setGameStarted(true)
    }
  }

  const handleGameEnd = (score) => {
    setFinalScore(score)
    setGameStarted(false)
  }

  const handlePlayAgain = () => {
    setGameStarted(true)
    setFinalScore(null)
  }

  const handleBackToUpload = () => {
    setGameStarted(false)
    setFinalScore(null)
    setQuestionsData(null)
    setResults(null)
    setSuccess('')
  }

  // If game is started, show the game component
  if (gameStarted && questionsData) {
    return <Game questionsData={questionsData} onGameEnd={handleGameEnd} />
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-50 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f1419] via-[#0a0a0a] to-[#0a0a0a]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(244,199,108,0.1)_0%,_transparent_70%)]"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6 pt-24">
        <div className="w-full max-w-3xl">
          {/* Header */}
          <div className="text-center mb-12 fade-up">
            <h1 className="display-font text-5xl md:text-6xl lg:text-7xl mb-4">
              <span className="text-slate-50">UPLOAD</span>
              <span className="gold-accent"> YOUR NOTES</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl body-font max-w-2xl mx-auto">
              Transform your study materials into an engaging quiz game
            </p>
            <div className="w-24 h-1 bg-[#F4C76C] mx-auto mt-6"></div>
          </div>

          {/* Main Card */}
          <div className="holographic-overlay terminal-frame p-8 md:p-10 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F4C76C] to-transparent opacity-60"></div>

            {/* File Upload Area */}
            <div
              className="terminal-frame border-2 border-dashed border-[#F4C76C]/30 p-12 text-center cursor-pointer transition-all hover:border-[#F4C76C]/60 hover:bg-[#F4C76C]/5 relative group"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('fileInput').click()}
            >
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">📄</div>
              <div className="text-[#F4C76C] text-xl md:text-2xl font-mono mb-3 font-bold">
                {file ? `SELECTED: ${file.name}` : 'CLICK TO UPLOAD OR DRAG AND DROP'}
              </div>
              <div className="text-slate-400 text-sm font-mono tracking-wider">
                PDF OR WORD DOCUMENTS (DOC, DOCX)
              </div>
              <input
                type="file"
                id="fileInput"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              {file && (
                <div className="mt-4 pt-4 border-t border-[#F4C76C]/20">
                  <div className="flex items-center justify-center gap-2 text-[#00ff88] font-mono text-sm">
                    <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></div>
                    FILE READY
                  </div>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full mt-6 glow-button bg-[#F4C76C] text-[#0a0a0a] py-4 text-lg font-bold cursor-pointer transition-all font-mono tracking-wider uppercase border border-[#F4C76C] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none hover:transform hover:-translate-y-0.5"
            >
              {loading ? 'GENERATING...' : 'GENERATE QUESTIONS'}
            </button>

            {/* Loading State */}
            {loading && (
              <div className="text-center mt-8">
                <div className="inline-block w-12 h-12 border-4 border-[#F4C76C]/20 border-t-[#F4C76C] rounded-full animate-spin mb-4"></div>
                <p className="text-slate-300 font-mono text-sm tracking-wider">PROCESSING DOCUMENT...</p>
                <p className="text-slate-500 font-mono text-xs mt-2">THIS MAY TAKE 1-2 MINUTES</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="terminal-frame border-2 border-red-500/50 bg-red-500/10 p-4 mt-6">
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-mono text-lg">✗</span>
                  <p className="text-red-400 font-mono text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="terminal-frame border-2 border-[#00ff88]/50 bg-[#00ff88]/10 p-4 mt-6">
                <div className="flex items-start gap-3">
                  <span className="text-[#00ff88] font-mono text-lg">✓</span>
                  <p className="text-[#00ff88] font-mono text-sm">{success}</p>
                </div>
              </div>
            )}

            {/* Results */}
            {results && !finalScore && (
              <div className="mt-8 pt-8 border-t border-[#F4C76C]/20">
                <div className="text-center mb-6">
                  <h2 className="display-font text-3xl md:text-4xl text-[#F4C76C] mb-2">QUESTIONS GENERATED!</h2>
                  <div className="w-16 h-0.5 bg-[#F4C76C] mx-auto"></div>
                </div>
                <div className="terminal-frame bg-[#F4C76C]/5 border border-[#F4C76C]/30 p-6 mb-6">
                  <div className="text-center">
                    <p className="text-slate-300 font-mono text-sm mb-2">SUCCESS</p>
                    <p className="text-slate-50 text-lg body-font">
                      Generated <span className="text-[#F4C76C] font-bold">{results.totalSections}</span> section(s) with{' '}
                      <span className="text-[#F4C76C] font-bold">{results.totalQuestions}</span> total questions.
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={handleStartGame}
                    className="w-full glow-button bg-[#F4C76C] text-[#0a0a0a] py-4 text-lg font-bold cursor-pointer transition-all hover:shadow-lg hover:transform hover:-translate-y-0.5 font-mono tracking-wider uppercase border border-[#F4C76C]"
                  >
                    ▶ START GAME
                  </button>
                  <button
                    onClick={handleDownload}
                    className="w-full terminal-frame border-2 border-[#F4C76C]/50 text-[#F4C76C] hover:bg-[#F4C76C]/10 py-4 text-base font-bold cursor-pointer transition-all font-mono tracking-wider uppercase"
                  >
                    DOWNLOAD JSON
                  </button>
                </div>
              </div>
            )}

            {/* Final Score */}
            {finalScore && (
              <div className="mt-8 pt-8 border-t border-[#F4C76C]/20">
                <div className="text-center mb-6">
                  <h2 className="display-font text-3xl md:text-4xl text-[#F4C76C] mb-2">GAME COMPLETE!</h2>
                  <div className="w-16 h-0.5 bg-[#F4C76C] mx-auto"></div>
                </div>
                <div className="terminal-frame bg-[#F4C76C]/5 border border-[#F4C76C]/30 p-8 mb-6">
                  <div className="text-center">
                    <p className="display-font text-5xl md:text-6xl text-[#F4C76C] mb-4">
                      {finalScore.correct} / {finalScore.total}
                    </p>
                    <p className="text-slate-300 font-mono text-lg tracking-wider">
                      {finalScore.total > 0 ? Math.round((finalScore.correct / finalScore.total) * 100) : 0}% ACCURACY
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={handlePlayAgain}
                    className="w-full glow-button bg-[#F4C76C] text-[#0a0a0a] py-4 text-lg font-bold cursor-pointer transition-all hover:shadow-lg hover:transform hover:-translate-y-0.5 font-mono tracking-wider uppercase border border-[#F4C76C]"
                  >
                    ▶ PLAY AGAIN
                  </button>
                  <button
                    onClick={handleBackToUpload}
                    className="w-full terminal-frame border-2 border-slate-500/50 text-slate-400 hover:text-slate-300 hover:border-slate-400/50 py-4 text-base font-bold cursor-pointer transition-all font-mono tracking-wider uppercase"
                  >
                    UPLOAD NEW NOTES
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center">
            <p className="text-slate-500 font-mono text-xs tracking-wider">
              SUPPORTED FORMATS: PDF, DOC, DOCX • MAX SIZE: 16MB
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Play

