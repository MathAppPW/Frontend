import React, { useState, useEffect } from "react";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

function MainContainerExersiceSeries() {
  // Hard-coded example data (no "series" object, just questions)
  const mockData = {
    questions: [
      {
        id: 1,
        question: "Jaki jest wynik \\( |5-2|+|1-6| \\)?",
        answers: ["8", "2", "3", "-2"],
        correct_answer: 0,
        hint: "Dodaj wcześniej obliczone wartości.",
      },
      {
        id: 2,
        question: "Oblicz wartości \\( |5-2| \\) oraz \\( |1-6| \\).",
        answers: ["3 i 5", "8 i -5", "3 i -5", "2 i 5"],
        correct_answer: 0,
        hint: "Moduł zawsze daje wartość dodatnią.",
        // Optional base64 image – remove or replace if you like
        image:
          "data:image/png;base64,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",
      },
      {
        id: 3,
        question:
          "Co należy wykonać w pierwszej kolejności w równaniu \\( |5-2|+|1-6| \\)?",
        answers: [
          "Wymnożyć",
          "Obliczyć wartości bezwzględne",
          "Podzielić",
          "Spierwiastkować",
        ],
        correct_answer: 1,
        hint: "Najpierw oblicz wartości wewnątrz modułu.",
      },
    ],
  };

  // Lives from server
  const [lives, setLives] = useState(null); // unknown at first
  // Will store how long we've spent in the session
  const [startTime, setStartTime] = useState(null);

  // Questions queue
  const [questionsQueue, setQuestionsQueue] = useState([]);
  const [initialCount, setInitialCount] = useState(0);

  // Current question & index
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // For user selection & feedback
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [lastSubmittedAnswer, setLastSubmittedAnswer] = useState(null);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null);

  // For “hint” toggle
  const [hintVisible, setHintVisible] = useState(false);

  // After the user sees the feedback from "Submit," we show a "Next" button
  // rather than "Submit" again. This controls that logic.
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // End-state flags
  const [noLivesAtStart, setNoLivesAtStart] = useState(false);
  const [outOfLivesMidLesson, setOutOfLivesMidLesson] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);

  // Tracking correct/wrong for each question
  const [questionResults, setQuestionResults] = useState({});
  // e.g. { '1': 'wrong', '2': 'correct', ... }

  // Once the session ends, we only want to call /experience/add once
  const [xpAdded, setXpAdded] = useState(false);

  // Authorization token from localStorage
  const token = localStorage.getItem("accessToken");

  // On mount, 1) check lives with GET /Lives
  // 2) if we have > 0 lives, load questions
  // 3) set up session data
  useEffect(() => {
    const checkLives = async () => {
      try {
        const res = await fetch("http://localhost:3000/Lives", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.lives > 0) {
          setLives(data.lives);

          // Initialize the question queue from mock data
          const questions = mockData.questions.slice(); // copy array
          setQuestionsQueue(questions);
          setInitialCount(questions.length);

          if (questions.length > 0) {
            setCurrentQuestion(questions[0]);
            setCurrentQuestionIndex(0);
          }

          // mark start time
          setStartTime(Date.now());
        } else {
          setNoLivesAtStart(true);
        }
      } catch (err) {
        console.error("Error checking lives:", err);
        // handle error if needed
      }
    };

    checkLives();
  }, [token]);

  // If the session is done, we want to call /experience/add (once).
  // We'll do it in an unconditional useEffect (no if-check around the effect),
  // but we check sessionDone and xpAdded inside the effect:
  useEffect(() => {
    if (sessionDone && !xpAdded) {
      // call /experience/add
      const addXP = async () => {
        try {
          await fetch("http://localhost:3000/experience/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ amount: 10 }),
          });
        } catch (e) {
          console.error("Error adding XP:", e);
        }
      };
      addXP();
      setXpAdded(true);
    }
  }, [sessionDone, xpAdded, token]);

  // Compute progress bar: how many unique questions are fully done
  // => doneCount = (initialCount - questionsQueue.length)
  const doneCount = initialCount - questionsQueue.length;
  const progressPercentage =
    initialCount > 0 ? Math.round((doneCount / initialCount) * 100) : 0;

  // If user clicks the "X" => parse ?section=1 from URL and redirect to /system?section=...
  const handleClose = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get("section") || "1";
    window.location.href = `http://localhost:3000/system?section=${section}`;
  };

  // If no lives at start
  if (noLivesAtStart) {
    return (
      <>
        {/* Triangles (left/right) */}
        <div className="left-bar-main-menu-small bar-main-menu-small"></div>
        <div className="right-bar-main-menu-small bar-main-menu-small"></div>
        <div className="borrder-menu-small right-borrder-menu-top-small"></div>
        <div className="borrder-menu-small right-borrder-menu-bottom-small"></div>
        <div className="borrder-menu-small left-borrder-menu-top-small"></div>
        <div className="borrder-menu-small left-borrder-menu-bottom-small"></div>

        <div className="exercise-container-outer">
          <h1 className="app-title-main-exercise">SpaceMath</h1>
          <div className="exercise-frame">
            <div className="exercise-progress-bar-container">
              <span className="close-icon" onClick={handleClose}>
                X
              </span>
              <div className="exercise-progress-bar">
                <div
                  className="exercise-progress"
                  style={{ width: "0%" }}
                ></div>
              </div>
              <div className="life-left-container">
                <span className="heart-icon">❤️</span>
                <span className="life-left">0</span>
              </div>
            </div>
            <div className="exercise-content">
              <h2>Brak żyć!</h2>
              <p>
                Nie masz wystarczającej liczby żyć, aby rozpocząć tę lekcję.
              </p>
              <button className="auth-button" onClick={handleClose}>
                Wróć do menu
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // If we ran out of lives during the lesson
  if (outOfLivesMidLesson) {
    return (
      <>
        {/* Triangles */}
        <div className="left-bar-main-menu-small bar-main-menu-small"></div>
        <div className="right-bar-main-menu-small bar-main-menu-small"></div>
        <div className="borrder-menu-small right-borrder-menu-top-small"></div>
        <div className="borrder-menu-small right-borrder-menu-bottom-small"></div>
        <div className="borrder-menu-small left-borrder-menu-top-small"></div>
        <div className="borrder-menu-small left-borrder-menu-bottom-small"></div>

        <div className="exercise-container-outer">
          <h1 className="app-title-main-exercise">SpaceMath</h1>
          <div className="exercise-frame">
            <div className="exercise-progress-bar-container">
              <span className="close-icon" onClick={handleClose}>
                X
              </span>
              <div className="exercise-progress-bar">
                <div
                  className="exercise-progress"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="life-left-container">
                <span className="heart-icon">❤️</span>
                <span className="life-left">0</span>
              </div>
            </div>
            <div className="exercise-content">
              <h2>Skończyły Ci się życia!</h2>
              <p>
                Niestety musisz poczekać na regenerację żyć lub zdobyć je w inny
                sposób.
              </p>
              <button className="auth-button" onClick={handleClose}>
                Wróć do menu
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // If session is done
  if (sessionDone) {
    // finalize stats
    let wrongCount = 0;
    let correctCount = 0;
    Object.keys(questionResults).forEach((qid) => {
      if (questionResults[qid] === "wrong") wrongCount++;
      else correctCount++;
    });

    // time spent
    const totalSeconds = startTime
      ? Math.floor((Date.now() - startTime) / 1000)
      : 0;

    return (
      <>
        {/* Triangles */}
        <div className="left-bar-main-menu-small bar-main-menu-small"></div>
        <div className="right-bar-main-menu-small bar-main-menu-small"></div>
        <div className="borrder-menu-small right-borrder-menu-top-small"></div>
        <div className="borrder-menu-small right-borrder-menu-bottom-small"></div>
        <div className="borrder-menu-small left-borrder-menu-top-small"></div>
        <div className="borrder-menu-small left-borrder-menu-bottom-small"></div>

        <div className="exercise-container-outer">
          <h1 className="app-title-main-exercise">SpaceMath</h1>
          <div className="exercise-frame">
            <div className="exercise-progress-bar-container">
              <span className="close-icon" onClick={handleClose}>
                X
              </span>
              <div className="exercise-progress-bar">
                {/* full progress */}
                <div
                  className="exercise-progress"
                  style={{ width: "100%" }}
                ></div>
              </div>
              <div className="life-left-container">
                <span className="heart-icon">❤️</span>
                <span className="life-left">{lives}</span>
              </div>
            </div>
            <div className="exercise-content">
              <h2>Gratulacje! Ukończyłeś tę serię.</h2>
              <p>Czas: {totalSeconds} sekund</p>
              <p>
                Wynik: {correctCount} / {initialCount} pytania poprawnie (
                {wrongCount} niepoprawnie)
              </p>
              <p>Otrzymałeś 10 XP za ukończenie lekcji.</p>
              <button className="auth-button" onClick={handleClose}>
                Wróć do menu
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // If we haven’t loaded lives yet or are mid-loading
  if (lives === null) {
    return (
      <div
        style={{
          color: "white",
          fontFamily: "Orbitron, sans-serif",
          marginTop: "20vh",
        }}
      >
        Checking lives...
      </div>
    );
  }

  // Otherwise, we are mid-lesson

  // Event: user selects answer
  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
  };

  // Event: user clicks "Submit" or "Next"
  const handleButtonClick = () => {
    if (!hasSubmitted) {
      handleSubmit();
    } else {
      handleNext();
    }
  };

  // Handle the Submit logic: check correctness, do lives damage if needed
  const handleSubmit = async () => {
    if (currentQuestion == null || selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correct_answer;

    setLastSubmittedAnswer(selectedAnswer);
    setLastAnswerCorrect(isCorrect);
    setHasSubmitted(true); // so the button text becomes "Next"

    // Mark this question as correct or wrong in final stats
    setQuestionResults((prev) => {
      const newResults = { ...prev };
      // If not set, set it now
      if (!newResults[currentQuestion.id]) {
        newResults[currentQuestion.id] = isCorrect ? "correct" : "wrong";
      }
      return newResults;
    });

    if (!isCorrect) {
      // Wrong => call /Lives/damage
      try {
        const res = await fetch("http://localhost:3000/Lives/damage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setLives(data.lives);
        // If now 0 => out of lives
        if (data.lives === 0) {
          setOutOfLivesMidLesson(true);
        }
      } catch (err) {
        console.error("Error damaging lives:", err);
      }
    }
  };

  // Move on to the next question
  const handleNext = () => {
    if (!currentQuestion) return;

    setHasSubmitted(false); // reset for next question
    setLastSubmittedAnswer(null);
    setLastAnswerCorrect(null);
    setHintVisible(false);
    setSelectedAnswer(null);

    // If the user answered correctly => remove question from queue
    // If incorrect => re-append the question
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;

    setQuestionsQueue((prevQueue) => {
      const updated = [...prevQueue];

      // remove current question
      const removed = updated.splice(currentQuestionIndex, 1)[0];

      if (!isCorrect) {
        // re-append if user was wrong
        updated.push(removed);
      }

      // if updated is empty => done
      if (updated.length === 0) {
        setSessionDone(true);
        setCurrentQuestion(null);
        return [];
      }

      // otherwise, new current index
      let nextIndex = currentQuestionIndex;
      if (nextIndex >= updated.length) {
        nextIndex = 0;
      }

      setCurrentQuestion(updated[nextIndex]);
      setCurrentQuestionIndex(nextIndex);

      return updated;
    });
  };

  // UI: "Submit" or "Next" button text
  const buttonLabel = hasSubmitted ? "Next" : "Submit";

  return (
    <>
      {/* Triangles */}
      <div className="left-bar-main-menu-small bar-main-menu-small"></div>
      <div className="right-bar-main-menu-small bar-main-menu-small"></div>
      <div className="borrder-menu-small right-borrder-menu-top-small"></div>
      <div className="borrder-menu-small right-borrder-menu-bottom-small"></div>
      <div className="borrder-menu-small left-borrder-menu-top-small"></div>
      <div className="borrder-menu-small left-borrder-menu-bottom-small"></div>

      <div className="exercise-container-outer">
        <h1 className="app-title-main-exercise">SpaceMath</h1>

        <div className="exercise-frame">
          {/* Top bar: X close, progress bar, lives */}
          <div className="exercise-progress-bar-container">
            <span className="close-icon" onClick={handleClose}>
              X
            </span>
            <div className="exercise-progress-bar">
              <div
                className="exercise-progress"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="life-left-container">
              <span className="heart-icon">❤️</span>
              <span className="life-left">{lives}</span>
            </div>
          </div>

          <div className="exercise-content">
            {/* 1) Question text (KaTeX) */}
            <div className="exercise-box">
              <p className="exercise-question">
                <strong>Question:</strong>{" "}
                <Latex>{currentQuestion.question}</Latex>
              </p>
            </div>

            {/* 2) Optional image */}
            {currentQuestion.image && (
              <div className="exercise-box">
                <img
                  src={currentQuestion.image}
                  className="exercise-image"
                  alt="question illustration"
                />
              </div>
            )}

            {/* 3) Answers */}
            <div className="exercise-box answer-box">
              {currentQuestion.answers.map((ans, idx) => {
                let btnClass = "answer-button";
                if (idx === lastSubmittedAnswer) {
                  // highlight red/green if user just submitted
                  if (lastAnswerCorrect === true) btnClass += " correct";
                  if (lastAnswerCorrect === false) btnClass += " incorrect";
                }
                if (idx === selectedAnswer) {
                  btnClass += " selected";
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(idx)}
                    className={btnClass}
                  >
                    {ans}
                  </button>
                );
              })}
            </div>

            {/* 4) Hint */}
            <div className="exercise-box hint-box">
              <button
                className="button-hint"
                onClick={() => setHintVisible(!hintVisible)}
              >
                {hintVisible ? "Hide Hint" : "Show Hint"}
              </button>
              {hintVisible && (
                <p className="hint-text">{currentQuestion.hint}</p>
              )}
            </div>

            {/* 5) Submit or Next button */}
            <div className="submit-box">
              <button onClick={handleButtonClick} className="auth-button">
                {buttonLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MainContainerExersiceSeries;
