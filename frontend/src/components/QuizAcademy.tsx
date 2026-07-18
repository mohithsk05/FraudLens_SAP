import React, { useState, useEffect } from 'react';

interface Question {
  id: number;
  scenario: string;
  options: string[];
  correct: number;
  explanation: string;
}

export default function QuizAcademy() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [xp, setXp] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const API_BASE = "http://127.0.0.1:8000/api";

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${API_BASE}/quiz`);
      const data = await response.json();
      setQuestions(data);
    } catch (err) {
      console.error(err);
      // fallback local quizzes
      const localQuizzes: Question[] = [
        {
          "id": 1,
          "scenario": "You receive an SMS: 'Dear customer, your BESCOM connection will be cut off at 9:30 PM due to unpaid bills. Call Electricity Officer on 9876543210.' What should you do?",
          "options": [
            "Call the number immediately and pay whatever outstanding they ask.",
            "Ignore it or call BESCOM's official toll-free helpline from their official website to verify.",
            "Forward the SMS to all your WhatsApp groups."
          ],
          "correct": 1,
          "explanation": "Official utilities never send personal mobile numbers for payment or threaten cutoffs within hours. Verify on official portals only."
        },
        {
          "id": 2,
          "scenario": "A WhatsApp user claims to be a customs officer. They show a photo of a package in your name and threaten legal action unless you transfer ₹50,000 for customs clearance via UPI. What is this?",
          "options": [
            "A legitimate customs warning. I must pay to clear my name.",
            "A 'Digital Arrest' impersonation scam. Customs/Police never verify or arrest people over WhatsApp and never ask for funds via UPI.",
            "A package shipping delay. I should ask for a discount."
          ],
          "correct": 1,
          "explanation": "No Indian law enforcement agency or department conducts 'Digital Arrests' or requests money over video/chat. Call 1930 immediately."
        }
      ];
      setQuestions(localQuizzes);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSelectOption = (idx: number) => {
    if (answered) return;
    setSelectedOpt(idx);
    setAnswered(true);
    
    const isCorrect = idx === questions[currentIdx].correct;
    if (isCorrect) {
      setXp(prev => prev + 10);
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setAnswered(false);
    
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setAnswered(false);
    setQuizFinished(false);
    setXp(0);
  };

  const getBadgeName = (score: number) => {
    if (score >= 40) return "👑 Cyber Guardian (Tier 3)";
    if (score >= 20) return "🛡️ Cyber Aware (Tier 2)";
    return "🌱 Cyber Novice (Tier 1)";
  };

  return (
    <div className="panel fade-in">
      <div className="panel-header">
        <h2 className="panel-title">🎓 Gamified Digital Literacy Academy</h2>
        <span className="subtitle-tag" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)' }}>
          Self-Protection Training
        </span>
      </div>

      <div className="quiz-wrapper">
        <div className="quiz-score-header">
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Current Achievement Title</h3>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-accent)', marginTop: '0.2rem' }}>
              {getBadgeName(xp)}
            </h4>
          </div>
          <div className="score-badge">
            🏆 {xp} XP
          </div>
        </div>

        {!quizFinished && questions.length > 0 ? (
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Scenario {currentIdx + 1} of {questions.length}
            </div>
            <div className="quiz-question">
              {questions[currentIdx].scenario}
            </div>

            <div className="quiz-options">
              {questions[currentIdx].options.map((opt, idx) => {
                let optClass = '';
                if (answered) {
                  if (idx === questions[currentIdx].correct) optClass = 'correct';
                  else if (idx === selectedOpt) optClass = 'incorrect';
                }
                
                return (
                  <button 
                    key={idx}
                    className={`quiz-option ${optClass}`}
                    onClick={() => handleSelectOption(idx)}
                    disabled={answered}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {answered && (
              <div className="fade-in">
                <div className="quiz-feedback-box">
                  <strong>
                    {selectedOpt === questions[currentIdx].correct ? "🎉 Correct!" : "❌ Incorrect."}
                  </strong>
                  <p style={{ marginTop: '0.25rem' }}>
                    {questions[currentIdx].explanation}
                  </p>
                </div>
                
                <button className="btn-primary" onClick={handleNext}>
                  {currentIdx + 1 === questions.length ? "Finish Assessment" : "Next Scenario"}
                </button>
              </div>
            )}
          </div>
        ) : quizFinished ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏆</div>
            <h2>Training Phase Completed!</h2>
            <p style={{ margin: '0.5rem 0 1.5rem 0', color: 'var(--text-secondary)' }}>
              You scored a total of <strong>{xp} XP</strong> and unlocked the <strong>{getBadgeName(xp)}</strong> rating!
            </p>
            <div style={{ display: 'flex', justifySelf: 'center', gap: '1rem' }}>
              <button className="btn-primary" onClick={handleRestart}>
                Re-assess Scenarios
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            Loading cyber literacy modules...
          </div>
        )}
      </div>
    </div>
  );
}
