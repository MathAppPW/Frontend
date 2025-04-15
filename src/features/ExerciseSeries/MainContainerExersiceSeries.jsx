import React, { useState, useEffect } from "react";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";
import "../../styles/exercise-series.css"; // Adjust the path as needed

function MainContainerExersiceSeries() {
  // Hard-coded example data
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
        image: "",
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
  // Time tracking
  const [startTime, setStartTime] = useState(null);

  // Questions
  const [questionsQueue, setQuestionsQueue] = useState([]);
  const [initialCount, setInitialCount] = useState(0);

  // Current question
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // For user selection
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [lastSubmittedAnswer, setLastSubmittedAnswer] = useState(null);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null);

  // For hint toggle
  const [hintVisible, setHintVisible] = useState(false);

  // After "Submit," show "Next"
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // End-state flags
  const [noLivesAtStart, setNoLivesAtStart] = useState(false);
  const [outOfLivesMidLesson, setOutOfLivesMidLesson] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);

  // Tracking correct/wrong
  const [questionResults, setQuestionResults] = useState({});
  // Once session ends, only add XP once
  const [xpAdded, setXpAdded] = useState(false);

  // Authorization token
  const token = localStorage.getItem("accessToken");

  // On mount, check lives => if > 0, load questions
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

          const questions = mockData.questions.slice();
          setQuestionsQueue(questions);
          setInitialCount(questions.length);

          if (questions.length > 0) {
            setCurrentQuestion(questions[0]);
          }
          setStartTime(Date.now());
        } else {
          setNoLivesAtStart(true);
        }
      } catch (err) {
        console.error("Error checking lives:", err);
      }
    };

    checkLives();
  }, [token]);

  // If session is done, add XP once
  useEffect(() => {
    if (sessionDone && !xpAdded) {
      const addXP = async () => {
        try {
          await fetch("http://localhost:3000/experience/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ amount: 1000 }),
          });
        } catch (e) {
          console.error("Error adding XP:", e);
        }
      };
      addXP();
      setXpAdded(true);
    }
  }, [sessionDone, xpAdded, token]);

  // For progress bar
  const doneCount = initialCount - questionsQueue.length;
  const progressPercentage =
    initialCount > 0 ? Math.round((doneCount / initialCount) * 100) : 0;

  // Close => go back
  const handleClose = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get("section") || "1";
    window.location.href = `http://localhost:3000/system?section=${section}`;
  };

  // 1) If no lives at start
  if (noLivesAtStart) {
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
          {/* center-all-content + no-close-icon => bigger text, hidden X */}
          <div className="exercise-frame center-all-content no-close-icon">
            <h2>Brak żyć!</h2>
            <p>Nie masz wystarczającej liczby żyć, aby rozpocząć tę lekcję.</p>
            <button className="auth-button" onClick={handleClose}>
              Wróć do menu
            </button>
          </div>
        </div>
      </>
    );
  }

  // 2) If out of lives mid-lesson
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
          <div className="exercise-frame center-all-content no-close-icon">
            <h2>Skończyły Ci się życia!</h2>
            <p>Niestety musisz poczekać na regenerację żyć.</p>
            <button className="auth-button" onClick={handleClose}>
              Wróć do menu
            </button>
          </div>
        </div>
      </>
    );
  }

  // 3) If session is done
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
          <div className="exercise-frame center-all-content no-close-icon">
            <h2>Gratulacje! Ukończyłeś tę serię.</h2>
            <p>Czas: {totalSeconds} sekund</p>
            <p>
              Wynik: {correctCount} / {initialCount} ( {wrongCount} źle )
            </p>
            <p>Otrzymałeś 10 XP za ukończenie lekcji.</p>
            <button className="auth-button" onClick={handleClose}>
              Wróć do menu
            </button>
          </div>
        </div>
      </>
    );
  }

  // 4) If we haven't loaded lives yet or are mid-loading
  if (lives === null) {
    return (
      <div
        style={{
          color: "white",
          fontFamily: "Orbitron, sans-serif",
          marginTop: "20vh",
          textAlign: "center",
        }}
      >
        Checking lives...
      </div>
    );
  }

  // 5) Otherwise, we are mid-lesson
  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
  };

  const handleButtonClick = () => {
    if (!hasSubmitted) {
      handleSubmit();
    } else {
      handleNext();
    }
  };

  const handleSubmit = async () => {
    if (!currentQuestion || selectedAnswer === null) return;
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;

    setLastSubmittedAnswer(selectedAnswer);
    setLastAnswerCorrect(isCorrect);
    setHasSubmitted(true);

    setQuestionResults((prev) => {
      const newResults = { ...prev };
      if (!newResults[currentQuestion.id]) {
        newResults[currentQuestion.id] = isCorrect ? "correct" : "wrong";
      }
      return newResults;
    });

    if (!isCorrect) {
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
        if (data.lives === 0) {
          setOutOfLivesMidLesson(true);
        }
      } catch (err) {
        console.error("Error damaging lives:", err);
      }
    }
  };

  const handleNext = () => {
    if (!currentQuestion) return;
    setHasSubmitted(false);
    setLastSubmittedAnswer(null);
    setLastAnswerCorrect(null);
    setHintVisible(false);
    setSelectedAnswer(null);

    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    setQuestionsQueue((prevQueue) => {
      const updated = [...prevQueue];
      // remove current
      const removed = updated.splice(currentQuestionIndex, 1)[0];
      if (!isCorrect) {
        // re-append if wrong
        updated.push(removed);
      }
      if (updated.length === 0) {
        setSessionDone(true);
        setCurrentQuestion(null);
        return [];
      }
      let nextIndex = currentQuestionIndex;
      if (nextIndex >= updated.length) {
        nextIndex = 0;
      }
      setCurrentQuestion(updated[nextIndex]);
      setCurrentQuestionIndex(nextIndex);
      return updated;
    });
  };

  const buttonLabel = hasSubmitted ? "Następne" : "Zatwierdź";

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
          {/* Only in-session: show X, progress bar, hearts */}
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
            <div className="exercise-box">
              <p className="exercise-question">
                <strong>Pytanie:</strong>{" "}
                <Latex>{currentQuestion.question}</Latex>
              </p>
            </div>

            {currentQuestion.image && (
              <div className="exercise-box">
                <img
                  src={currentQuestion.image}
                  className="exercise-image"
                  alt="question illustration"
                />
              </div>
            )}

            <div className="exercise-box answer-box">
              {currentQuestion.answers.map((ans, idx) => {
                let btnClass = "answer-button";
                if (idx === lastSubmittedAnswer) {
                  if (lastAnswerCorrect) btnClass += " correct";
                  else btnClass += " incorrect";
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

            <div className="exercise-box hint-box">
              <button
                className="button-hint"
                onClick={() => setHintVisible(!hintVisible)}
              >
                {hintVisible ? "Ukryj podpowiedź" : "Pokaż podpowiedź"}
              </button>
              {hintVisible && (
                <p className="hint-text">{currentQuestion.hint}</p>
              )}
            </div>

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
