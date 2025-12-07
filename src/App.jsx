import { useState, useEffect, useRef } from 'react'

// Custom Game Mockup Component
function GameMockup() {
  return (
    <div className="holographic-overlay terminal-frame p-6 md:p-8 relative overflow-hidden" style={{ maxWidth: '420px' }}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F4C76C] to-transparent opacity-60"></div>
      
      {/* Terminal-style header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#F4C76C]/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></div>
          <span className="text-xs tracking-wider text-[#F4C76C] font-mono">LEVEL 7 / 20</span>
        </div>
        <div className="px-3 py-1 bg-[#F4C76C]/10 border border-[#F4C76C]/30 rounded">
          <span className="text-[10px] uppercase tracking-widest text-[#F4C76C] font-mono">BOSS INCOMING</span>
        </div>
      </div>
      
      {/* Question */}
      <div className="mb-6">
        <p className="text-slate-200 leading-relaxed mb-6 text-sm md:text-base">
          Which of the following best describes the primary mechanism of action for neurotransmitters in synaptic transmission?
        </p>
        
        {/* Answer options with terminal aesthetic */}
        <div className="space-y-3">
          {[
            { label: 'A', text: 'Direct DNA modification', correct: false },
            { label: 'B', text: 'Binding to postsynaptic receptors', correct: true },
            { label: 'C', text: 'Cellular respiration enhancement', correct: false },
            { label: 'D', text: 'Protein synthesis acceleration', correct: false }
          ].map((option, idx) => (
            <button
              key={idx}
              className="w-full text-left group relative overflow-hidden terminal-frame p-3 md:p-4 transition-all hover:border-[#F4C76C]/40"
            >
              <div className="flex items-start gap-3">
                <span className="text-[#F4C76C] font-mono text-sm font-bold min-w-[24px]">{option.label})</span>
                <span className="text-slate-300 text-sm md:text-base group-hover:text-slate-50 transition-colors">{option.text}</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#F4C76C]/0 via-[#F4C76C]/5 to-[#F4C76C]/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Terminal-style footer */}
      <div className="mt-6 pt-4 border-t border-[#F4C76C]/10 flex items-center gap-2">
        <span className="text-[10px] text-slate-500 font-mono">[SELECT]</span>
        <span className="text-[10px] text-slate-500 font-mono">→</span>
        <span className="text-[10px] text-[#F4C76C] font-mono">ENTER</span>
      </div>
    </div>
  )
}

function App() {
  const [isScrolled, setIsScrolled] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll-triggered animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-up-visible')
        }
      })
    }, observerOptions)

    const elements = document.querySelectorAll('.fade-up')
    elements.forEach(el => observer.observe(el))

    return () => {
      elements.forEach(el => observer.unobserve(el))
    }
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-50 relative overflow-x-hidden">
      {/* Custom Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#F4C76C]/10' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="NoteQuest.png" className="h-10 w-auto" />
              <div className="display-font text-3xl tracking-tight">
                <span className="text-slate-50">NOTE</span>
                <span className="gold-accent">QUEST</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-10">
              <button
                onClick={() => scrollToSection('hero')}
                className="text-slate-400 hover:text-[#F4C76C] transition-colors text-sm tracking-wider uppercase font-mono focus:outline-none focus:text-[#F4C76C]"
              >
                HOME
              </button>
              <a
                href="#play"
                className="text-slate-400 hover:text-[#F4C76C] transition-colors text-sm tracking-wider uppercase font-mono focus:outline-none focus:text-[#F4C76C]"
              >
                PLAY
              </a>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="glow-button bg-[#F4C76C] text-[#0a0a0a] px-6 py-2.5 text-sm font-bold tracking-wider uppercase font-mono border border-[#F4C76C] focus:outline-none"
              >
                TRY GAME
              </button>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="glow-button bg-[#F4C76C] text-[#0a0a0a] px-4 py-2 text-xs font-bold tracking-wider uppercase font-mono border border-[#F4C76C]"
              >
                TRY
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Cinematic Hero Section */}
      <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-32">
        {/* Background gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1419] via-[#0a0a0a] to-[#0a0a0a]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(244,199,108,0.1)_0%,_transparent_60%)]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 w-full">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left: Headline - Asymmetric layout */}
            <div className="lg:col-span-7 space-y-8 content-layer">
              <div className="fade-up">
                <div className="inline-block mb-4 px-4 py-1.5 bg-[#F4C76C]/10 border border-[#F4C76C]/30 rounded-sm">
                  <span className="text-xs tracking-[0.2em] uppercase text-[#F4C76C] font-mono">BOSS MODE ACTIVATED</span>
                </div>
              </div>
              
              <h1 className="display-font text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.9] fade-up fade-up-delay-1">
                <span className="block text-slate-50">TURN YOUR</span>
                <span className="block gold-accent">CLASS NOTES</span>
                <span className="block text-slate-50">INTO A</span>
                <span className="block gold-accent">BOSS-LEVEL</span>
                <span className="block text-slate-50">STUDY GAME</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-xl fade-up fade-up-delay-2 body-font">
                Upload your notes, let AI generate questions, and level up by beating quiz bosses instead of rereading pages.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 fade-up fade-up-delay-3">
                <a
                  href="/play"
                  className="glow-button bg-[#F4C76C] text-[#0a0a0a] px-8 py-4 text-base font-bold tracking-wider uppercase font-mono border border-[#F4C76C] inline-block text-center focus:outline-none"
                >
                  START PLAYING
                </a>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="terminal-frame border-2 border-[#F4C76C]/50 text-[#F4C76C] hover:bg-[#F4C76C]/10 px-8 py-4 text-base font-bold tracking-wider uppercase font-mono transition-all focus:outline-none focus:border-[#F4C76C]"
                >
                  WATCH DEMO
                </button>
              </div>
            </div>

            {/* Right: Game Mockup - Overlapping, offset */}
            <div className="lg:col-span-5 lg:translate-y-12 fade-up fade-up-delay-2">
              <div className="relative">
                <div className="absolute -inset-4 bg-[#F4C76C]/5 blur-2xl"></div>
                <GameMockup />
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 fade-up fade-up-delay-3">
          <div className="w-px h-12 bg-gradient-to-b from-[#F4C76C] to-transparent"></div>
        </div>
      </section>

      {/* Problem & Solution - Asymmetric Editorial Layout */}
      <section className="relative py-32 md:py-40 overflow-hidden">
        <div className="absolute inset-0 diagonal-cut bg-[#0f1419]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-20 fade-up">
            <h2 className="display-font text-4xl md:text-5xl lg:text-6xl text-slate-50 mb-4 max-w-3xl">
              THE PROBLEM: STUDYING IS PASSIVE AND BROKEN.
            </h2>
            <div className="w-24 h-1 bg-[#F4C76C] mt-6"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
            {/* Problem - Left, offset up */}
            <div className="terminal-frame p-10 md:p-12 relative md:-mt-8 fade-up">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#F4C76C]"></div>
              <h3 className="display-font text-3xl md:text-4xl text-[#F4C76C] mb-6">THE PROBLEM</h3>
              <ul className="space-y-4 text-slate-300 body-font text-lg leading-relaxed">
                <li className="flex items-start gap-3">
                  <span className="text-[#F4C76C] mt-1 font-mono">▶</span>
                  <span>Students waste hours turning notes into flashcards.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#F4C76C] mt-1 font-mono">▶</span>
                  <span>Most study apps are passive or boring.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#F4C76C] mt-1 font-mono">▶</span>
                  <span>Converting notes into actual quiz questions is slow and painful.</span>
                </li>
              </ul>
            </div>

            {/* Solution - Right, offset down */}
            <div className="terminal-frame p-10 md:p-12 relative md:mt-8 fade-up fade-up-delay-1">
              <div className="absolute top-0 right-0 w-1 h-full bg-[#F4C76C]"></div>
              <h3 className="display-font text-3xl md:text-4xl text-[#F4C76C] mb-6">OUR SOLUTION</h3>
              <p className="text-slate-300 body-font text-lg leading-relaxed">
                NoteQuest automatically converts your notes into a progression-based quiz game with levels, boss battles, and adaptive questions so you actually learn instead of just rereading.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Angled Timeline */}
      <section id="how-it-works" className="relative py-32 md:py-40 overflow-hidden">
        <div className="absolute inset-0 diagonal-cut-reverse bg-[#0a0a0a]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-20 text-center fade-up">
            <h2 className="display-font text-4xl md:text-5xl lg:text-6xl text-slate-50 mb-4">
              HOW NOTEQUEST WORKS
            </h2>
            <div className="w-24 h-1 bg-[#F4C76C] mx-auto mt-6"></div>
          </div>
          
          {/* Angled horizontal timeline */}
          <div className="relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#F4C76C]/30 to-transparent transform -translate-y-1/2"></div>
            
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {[
                { num: '01', icon: '📄', title: 'UPLOAD YOUR NOTES', desc: 'Paste or upload your notes from any class.' },
                { num: '02', icon: '🤖', title: 'AI BUILDS YOUR QUEST', desc: 'Our AI extracts key concepts and generates multiple-choice questions from your notes.' },
                { num: '03', icon: '👑', title: 'PLAY AND LEVEL UP', desc: 'Beat questions, level up, and face boss battles every 10 levels.' }
              ].map((step, idx) => (
                <div key={idx} className="relative fade-up" style={{ transitionDelay: `${idx * 0.15}s` }}>
                  {/* Step number badge */}
                  <div className="absolute -top-6 left-0 w-12 h-12 bg-[#F4C76C] text-[#0a0a0a] display-font text-2xl flex items-center justify-center border-2 border-[#0a0a0a]">
                    {step.num}
                  </div>
                  
                  <div className="terminal-frame p-8 md:p-10 pt-16 relative">
                    <div className="text-5xl mb-4">{step.icon}</div>
                    <h3 className="display-font text-xl md:text-2xl text-[#F4C76C] mb-4 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-slate-300 body-font leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features - Loose Asymmetric Layout */}
      <section className="relative py-32 md:py-40 overflow-hidden">
        <div className="absolute inset-0 diagonal-cut bg-[#0f1419]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-20 fade-up">
            <h2 className="display-font text-4xl md:text-5xl lg:text-6xl text-slate-50 mb-4 max-w-4xl">
              WHY NOTEQUEST ACTUALLY HELPS YOU STUDY
            </h2>
            <div className="w-24 h-1 bg-[#F4C76C] mt-6"></div>
          </div>
          
          {/* Asymmetric grid */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {[
              { icon: '📝', title: 'NOTE-AWARE QUESTIONS', desc: 'Questions are generated directly from your own notes, not generic textbook content.' },
              { icon: '⚔️', title: 'BOSS LEVELS', desc: 'Every 10 questions, face a boss question that covers the next big chunk of your notes.' },
              { icon: '🧠', title: 'BUILT-IN ACTIVE RECALL', desc: 'You answer questions instead of rereading, which massively boosts retention.' },
              { icon: '⚡', title: 'FAST SETUP', desc: 'Paste notes → click once → your game is ready in seconds.' }
            ].map((feature, idx) => (
              <div 
                key={idx} 
                className={`terminal-frame p-8 md:p-10 relative fade-up ${idx % 2 === 0 ? 'fade-up-delay-1' : ''}`}
                style={{ 
                  marginTop: idx === 1 ? '2rem' : idx === 3 ? '-2rem' : '0',
                  marginLeft: idx === 2 ? '1rem' : '0'
                }}
              >
                <div className="absolute top-0 left-0 w-12 h-12 bg-[#F4C76C]/10 border-r border-b border-[#F4C76C]/30 flex items-center justify-center">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <div className="pt-12">
                  <h3 className="display-font text-xl md:text-2xl text-[#F4C76C] mb-4 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-slate-300 body-font leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For - Lore Panel Style */}
      <section className="relative py-32 md:py-40 overflow-hidden">
        <div className="absolute inset-0 diagonal-cut-reverse bg-[#0a0a0a]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
          <div className="mb-20 text-center fade-up">
            <h2 className="display-font text-4xl md:text-5xl lg:text-6xl text-slate-50 mb-4">
              BUILT FOR REAL STUDENTS AND TEACHERS
            </h2>
            <div className="w-24 h-1 bg-[#F4C76C] mx-auto mt-6"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 max-w-5xl mx-auto">
            {[
              { title: 'STUDENTS', desc: 'High school and college students juggling heavy note-based classes, AP/IB courses, or exams.' },
              { title: 'TEACHERS', desc: 'Teachers who want to turn review days into a live quiz game powered by their class notes.' }
            ].map((audience, idx) => (
              <div key={idx} className="terminal-frame p-10 md:p-12 relative fade-up" style={{ transitionDelay: `${idx * 0.1}s` }}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#F4C76C] to-transparent"></div>
                <div className="absolute top-0 right-0 w-1 h-full bg-[#F4C76C]/20"></div>
                <h3 className="display-font text-3xl md:text-4xl text-[#F4C76C] mb-6">
                  {audience.title}
                </h3>
                <p className="text-slate-300 body-font text-lg leading-relaxed">
                  {audience.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Cinematic Block */}
      <section className="relative py-32 md:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f1419] via-[#0a0a0a] to-[#0f1419]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(244,199,108,0.1)_0%,_transparent_70%)]"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-8 text-center">
          <div className="terminal-frame border-2 border-[#F4C76C]/50 p-12 md:p-16 relative overflow-hidden fade-up">
            <div className="absolute inset-0 bg-gradient-to-br from-[#F4C76C]/5 via-transparent to-transparent"></div>
            <div className="relative z-10">
              <h2 className="display-font text-4xl md:text-5xl lg:text-6xl text-slate-50 mb-6 leading-tight">
                READY TO TURN YOUR NOTES INTO A QUEST?
              </h2>
              <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto body-font leading-relaxed">
                Paste your notes and generate your first boss battle in seconds.
              </p>
              <a
                href="/play"
                className="glow-button bg-[#F4C76C] text-[#0a0a0a] px-12 py-5 text-lg font-bold tracking-wider uppercase font-mono border-2 border-[#F4C76C] inline-block focus:outline-none"
              >
                GENERATE MY GAME
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - With Personality */}
      <footer className="relative py-16 border-t border-[#F4C76C]/10 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="display-font text-2xl">
              <span className="text-slate-400">NOTE</span>
              <span className="text-[#F4C76C]">QUEST</span>
            </div>
            <div className="text-slate-500 text-sm font-mono tracking-wider uppercase">
              BUILT AT CRABHACKS 2025
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-[#F4C76C]/5 text-center">
            <div className="w-24 h-0.5 bg-[#F4C76C] mx-auto"></div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
