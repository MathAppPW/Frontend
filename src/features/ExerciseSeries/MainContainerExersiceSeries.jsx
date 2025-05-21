import React, { useState, useEffect, useMemo } from "react";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";
import "../../styles/exercise-series.css"; // Adjust the path as needed

// Helper function to shuffle an array (Fisher-Yates)
const shuffleArray = (array) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

function MainContainerExersiceSeries() {
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [lives, setLives] = useState(null);
  const [overallSessionStartTime, setOverallSessionStartTime] = useState(null);
  const [currentQuestionAttemptStartTime, setCurrentQuestionAttemptStartTime] =
    useState(null);

  const [questionsQueue, setQuestionsQueue] = useState([]);
  const [initialCount, setInitialCount] = useState(0);

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [lastSubmittedAnswer, setLastSubmittedAnswer] = useState(null);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null);

  const [hintVisible, setHintVisible] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [noLivesAtStart, setNoLivesAtStart] = useState(false);
  const [outOfLivesMidLesson, setOutOfLivesMidLesson] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);

  // questionResults: { [contentId]: { dbId: number, wasEverWrongThisSession: boolean, accumulatedTimeSpentSeconds: number, isCompletedAndLogged: boolean, firstEncounterCorrect: boolean } }
  const [questionResults, setQuestionResults] = useState({});
  const [sessionFinalizedForXP, setSessionFinalizedForXP] = useState(false); // For XP logging
  const [sessionHistoryLogged, setSessionHistoryLogged] = useState(false); // For History logging

  const token = localStorage.getItem("accessToken");

  const urlParams = useMemo(
    () => new URLSearchParams(window.location.search),
    []
  );

  const chapterNameForAPI = useMemo(
    () => urlParams.get("section") || "",
    [urlParams]
  );

  const subjectNameForAPI = useMemo(
    () => urlParams.get("lesson") || "",
    [urlParams]
  );

  const rawTaskParamFromUrl = useMemo(
    () => urlParams.get("task") || "",
    [urlParams]
  );

  // lessonIdForAPI will be used as the seriesId for history logging
  const lessonIdForAPI = useMemo(() => {
    if (!rawTaskParamFromUrl) {
      return "";
    }
    const baseTaskNumber = parseInt(rawTaskParamFromUrl, 10);

    if (isNaN(baseTaskNumber) || baseTaskNumber < 1 || baseTaskNumber > 6) {
      return "";
    }

    let offset = 0;
    switch (subjectNameForAPI) {
      case "Potęgi":
        offset = 6;
        break;
      case "Pierwiastki":
        offset = 12;
        break;
      case "Logarytmy":
        offset = 18;
        break;
      case "Procenty":
        offset = 24;
        break;
      case "Przedziały liczbowe i zbiory":
        offset = 30;
        break;
      case "Liczby_rzeczywiste":
        offset = 0;
        break;
      default:
        const knownSubjects = [
          "Liczby_rzeczywiste",
          "Potęgi",
          "Pierwiastki",
          "Logarytmy",
          "Procenty",
          "Przedziały liczbowe i zbiory",
        ];
        if (subjectNameForAPI && !knownSubjects.includes(subjectNameForAPI)) {
          console.warn(
            `Subject "${subjectNameForAPI}" (from 'lesson' URL param) ` +
              `is not in the explicit offset map. Defaulting to offset 0. ` +
              `Resulting API lesson ID for this subject will be ${baseTaskNumber}.`
          );
        }
        offset = 0;
        break;
    }
    return String(baseTaskNumber + offset);
  }, [rawTaskParamFromUrl, subjectNameForAPI]);

  useEffect(() => {
    const initializeSession = async () => {
      if (!token) {
        setFetchError("Brak autoryzacji. Zaloguj się ponownie.");
        setIsLoadingQuestions(false);
        return;
      }
      if (!chapterNameForAPI || !subjectNameForAPI || !lessonIdForAPI) {
        setFetchError(
          `Niekompletny adres URL zadania (oczekiwano parametrów ?section=...&lesson=...&task=...). Otrzymano: section='${chapterNameForAPI}', lesson='${subjectNameForAPI}', task (po przetworzeniu)='${lessonIdForAPI}'. Sprawdź czy 'task' (1-6) jest poprawny i czy 'lesson' jest znany.`
        );
        setIsLoadingQuestions(false);
        return;
      }

      try {
        const livesRes = await fetch("http://localhost:3000/Lives", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!livesRes.ok)
          throw new Error(
            `HTTP error checking lives! status: ${livesRes.status}`
          );
        const livesData = await livesRes.json();

        if (livesData.lives > 0) {
          setLives(livesData.lives);
          setIsLoadingQuestions(true);
          setFetchError(null);
          try {
            const questionsUrl = `http://localhost:3000/Exercise/series/${encodeURIComponent(
              chapterNameForAPI
            )}/${encodeURIComponent(subjectNameForAPI)}/${encodeURIComponent(
              lessonIdForAPI
            )}`;
            console.log("Fetching questions from URL:", questionsUrl);
            const questionsRes = await fetch(questionsUrl, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
            if (!questionsRes.ok) {
              if (questionsRes.status === 404)
                throw new Error(
                  `Nie znaleziono serii dla podanych parametrów (404). URL: ${questionsUrl}`
                );
              throw new Error(
                `HTTP error fetching questions! status: ${questionsRes.status}. URL: ${questionsUrl}`
              );
            }
            const fetchedSeriesData = await questionsRes.json();

            let parsedQuestions = [];
            if (
              fetchedSeriesData &&
              Array.isArray(fetchedSeriesData.series) &&
              fetchedSeriesData.series.length > 0
            ) {
              const seriesObject = fetchedSeriesData.series[0];

              if (seriesObject && typeof seriesObject.id === "number") {
                const seriesIdFromResponse = seriesObject.id;
                const lessonIdNumeric = parseInt(lessonIdForAPI, 10);
                if (seriesIdFromResponse !== lessonIdNumeric) {
                  console.warn(
                    `Mismatch between lessonIdForAPI (${lessonIdNumeric}) and series.id from response (${seriesIdFromResponse}). Using lessonIdForAPI for consistency unless specified otherwise.`
                  );
                }
              } else {
                console.warn(
                  "Series object from API response does not have a numeric 'id' field or seriesObject is undefined.",
                  seriesObject
                );
              }

              if (seriesObject && Array.isArray(seriesObject.exercises)) {
                parsedQuestions = seriesObject.exercises
                  .map((exercise) => {
                    try {
                      const content = JSON.parse(exercise.contents);
                      if (
                        !content ||
                        typeof content.id === "undefined" ||
                        typeof content.question !== "string" ||
                        !Array.isArray(content.answers) ||
                        typeof content.correct_answer !== "number" ||
                        typeof exercise.id === "undefined"
                      ) {
                        console.warn(
                          "Skipping exercise due to missing critical fields:",
                          exercise,
                          content
                        );
                        return null;
                      }
                      return {
                        dbId: exercise.id,
                        id: content.id,
                        question: content.question,
                        answers: content.answers,
                        correct_answer: content.correct_answer,
                        hint: content.hint || "",
                        image: content.image || "",
                      };
                    } catch (parseError) {
                      console.error(
                        `Failed to parse contents for exercise DB ID ${exercise.id}:`,
                        parseError,
                        exercise.contents
                      );
                      return null;
                    }
                  })
                  .filter((q) => q !== null);
              }
            } else {
              throw new Error(
                "Otrzymane dane serii są w nieprawidłowym formacie lub seria jest pusta."
              );
            }

            if (parsedQuestions.length === 0) {
              setSessionDone(true);
              setInitialCount(0);
              setQuestionsQueue([]);
              setCurrentQuestion(null);
              setOverallSessionStartTime(Date.now());
            } else {
              const shuffledQuestions = shuffleArray([...parsedQuestions]);
              setQuestionsQueue(shuffledQuestions);
              setInitialCount(shuffledQuestions.length);
              setCurrentQuestion(shuffledQuestions[0]);
              setCurrentQuestionIndex(0);
              setOverallSessionStartTime(Date.now());
              setCurrentQuestionAttemptStartTime(Date.now());
            }
          } catch (err) {
            console.error("Error during question fetching/processing:", err);
            setFetchError(`Nie można załadować pytań: ${err.message}`);
          } finally {
            setIsLoadingQuestions(false);
          }
        } else {
          setNoLivesAtStart(true);
          setLives(0);
          setIsLoadingQuestions(false);
        }
      } catch (err) {
        console.error("Error during session initialization:", err);
        setFetchError(`Błąd inicjalizacji: ${err.message}`);
        setIsLoadingQuestions(false);
      }
    };
    initializeSession();
  }, [token, chapterNameForAPI, subjectNameForAPI, lessonIdForAPI]);

  useEffect(() => {
    const finalizeXPSession = async () => {
      if (sessionDone && !sessionFinalizedForXP && token) {
        setSessionFinalizedForXP(true);
        if (initialCount > 0) {
          const xpAmount = initialCount * 100;
          try {
            console.log(`Attempting to add ${xpAmount} XP...`);
            const response = await fetch(
              "http://localhost:3000/experience/add",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ amount: xpAmount }),
              }
            );
            if (!response.ok) {
              const errorData = await response.text();
              throw new Error(
                `Failed to add XP: ${response.status} - ${errorData}`
              );
            }
            console.log("XP added successfully!");
          } catch (e) {
            console.error("Error adding XP:", e);
          }
        } else {
          console.log(
            "Skipping XP addition: No questions in this session or session not fully completed for XP."
          );
        }
      }
    };
    finalizeXPSession();
  }, [sessionDone, sessionFinalizedForXP, token, initialCount]);

  // Effect to log history when session ends (either by completion or out of lives)
  useEffect(() => {
    const logSessionHistory = async () => {
      if (
        (sessionDone || outOfLivesMidLesson) &&
        !sessionHistoryLogged &&
        token &&
        overallSessionStartTime &&
        lessonIdForAPI
      ) {
        setSessionHistoryLogged(true);
        console.log(
          "Session ended, attempting to log session summary to history..."
        );

        const sessionEndTime = new Date();
        const totalSessionTimeSeconds = Math.floor(
          (sessionEndTime.getTime() - overallSessionStartTime) / 1000
        );

        let calculatedSuccessfulCount = 0;
        let calculatedFailedCount = 0;

        Object.values(questionResults).forEach((entry) => {
          if (entry.wasEverWrongThisSession) {
            calculatedFailedCount++;
          } else if (entry.isCompletedAndLogged) {
            calculatedSuccessfulCount++;
          }
        });

        const seriesIdNum = parseInt(lessonIdForAPI, 10);
        if (isNaN(seriesIdNum)) {
          console.error(
            "Invalid lessonIdForAPI for history logging, cannot parse to number. Value:",
            lessonIdForAPI
          );
          return;
        }

        const historyPayload = {
          seriesId: seriesIdNum,
          date: sessionEndTime.toISOString(),
          timeSpent: Math.max(0, totalSessionTimeSeconds),
          successfulCount: calculatedSuccessfulCount,
          failedCount: calculatedFailedCount,
        };

        console.log(
          "Preparing to log session summary to History (revised counting):",
          historyPayload
        );

        try {
          const res = await fetch("http://localhost:3000/History/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(historyPayload),
          });

          if (!res.ok) {
            const errorText = await res.text();
            console.error(
              `Failed to add session summary to history. Status: ${res.status}. Response: ${errorText}`,
              historyPayload
            );
          } else {
            console.log(`Session summary added to history successfully.`);
          }
        } catch (err) {
          console.error(
            `Network error while logging session summary:`,
            err,
            historyPayload
          );
        }
      }
    };
    logSessionHistory();
  }, [
    sessionDone,
    outOfLivesMidLesson,
    sessionHistoryLogged,
    token,
    questionResults,
    initialCount,
    overallSessionStartTime,
    lessonIdForAPI,
  ]);

  const handleClose = () => {
    const backSection = urlParams.get("section") || "1";
    window.location.href = `/system?section=${encodeURIComponent(backSection)}`;
  };

  const handleAnswerSelect = (index) => {
    if (!hasSubmitted) setSelectedAnswer(index);
  };

  const handleSubmit = async () => {
    if (
      selectedAnswer === null ||
      !currentQuestion ||
      currentQuestionAttemptStartTime === null
    )
      return;

    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    const attemptDurationSeconds = Math.max(
      1,
      Math.floor((Date.now() - currentQuestionAttemptStartTime) / 1000)
    );

    setLastSubmittedAnswer(selectedAnswer);
    setLastAnswerCorrect(isCorrect);
    setHasSubmitted(true);

    const qContentId = currentQuestion.id;
    const qDbId = currentQuestion.dbId;

    setQuestionResults((prevResults) => {
      const newResults = { ...prevResults };
      let entry = newResults[qContentId] ? { ...newResults[qContentId] } : null;

      if (!entry) {
        entry = {
          dbId: qDbId,
          wasEverWrongThisSession: !isCorrect,
          isCompletedAndLogged: false,
          firstEncounterCorrect: isCorrect,
        };
      } else {
        if (!isCorrect) {
          entry.wasEverWrongThisSession = true;
        }
      }

      if (isCorrect) {
        entry.isCompletedAndLogged = true;
      }

      newResults[qContentId] = entry;
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
        if (!res.ok) {
          console.error(
            "Failed to apply damage. Status:",
            res.status,
            await res.text()
          );
        } else {
          const data = await res.json();
          setLives(data.lives);
          if (data.lives === 0) {
            setOutOfLivesMidLesson(true);
          }
        }
      } catch (err) {
        console.error("Error damaging lives:", err);
      }
    }
  };

  const handleButtonClick = () => {
    if (!hasSubmitted) handleSubmit();
    else handleNext();
  };

  const handleNext = () => {
    if (!currentQuestion || !hasSubmitted) return;

    if (outOfLivesMidLesson) {
      console.log("Out of lives, not proceeding to next question.");
      return;
    }

    const wasCorrectThisAttempt = lastAnswerCorrect; // Correctness of the last attempt
    const currentQuestionInfo = questionResults[currentQuestion.id];

    setHasSubmitted(false);
    setLastSubmittedAnswer(null);
    setLastAnswerCorrect(null);
    setHintVisible(false);
    setSelectedAnswer(null);

    setQuestionsQueue((prevQueue) => {
      const currentContentId = currentQuestion.id;
      let updatedQueue = [...prevQueue];
      let nextIdx = currentQuestionIndex;
      const currentIndexInQueue = updatedQueue.findIndex(
        (q) => q.id === currentContentId
      );

      if (currentIndexInQueue === -1) {
        console.error(
          "Consistency error: Current question not found in queue."
        );
        nextIdx =
          (currentQuestionIndex + 1) %
          (updatedQueue.length > 0 ? updatedQueue.length : 1);
      } else if (wasCorrectThisAttempt) {
        updatedQueue.splice(currentIndexInQueue, 1);
        if (nextIdx > currentIndexInQueue) nextIdx--;
        if (nextIdx >= updatedQueue.length && updatedQueue.length > 0)
          nextIdx = 0;
        else if (updatedQueue.length === 0) nextIdx = 0;
      } else {
        const [movedQuestion] = updatedQueue.splice(currentIndexInQueue, 1);
        updatedQueue.push(movedQuestion);
        if (nextIdx > currentIndexInQueue) nextIdx--;
        if (nextIdx >= updatedQueue.length && updatedQueue.length > 0)
          nextIdx = 0;
        else if (updatedQueue.length === 0) nextIdx = 0;
      }

      if (updatedQueue.length === 0) {
        setSessionDone(true);
        setCurrentQuestion(null);
        setCurrentQuestionAttemptStartTime(null);
        return [];
      }

      if (nextIdx < 0 || nextIdx >= updatedQueue.length) {
        nextIdx = 0;
      }

      setCurrentQuestion(updatedQueue[nextIdx]);
      setCurrentQuestionIndex(nextIdx);
      setCurrentQuestionAttemptStartTime(Date.now());
      return updatedQueue;
    });
  };

  // --- Render logic ---

  if (isLoadingQuestions && lives === null && !fetchError) {
    return (
      <div
        style={{
          color: "white",
          fontFamily: "Orbitron, sans-serif",
          marginTop: "20vh",
          textAlign: "center",
        }}
      >
        Ładowanie danych...
      </div>
    );
  }

  if (fetchError) {
    return (
      <>
        <div className="left-bar-main-menu-small bar-main-menu-small"></div>
        <div className="right-bar-main-menu-small bar-main-menu-small"></div>
        <div className="borrder-menu-small right-borrder-menu-top-small"></div>
        <div className="borrder-menu-small right-borrder-menu-bottom-small"></div>
        <div className="borrder-menu-small left-borrder-menu-top-small"></div>
        <div className="borrder-menu-small left-borrder-menu-bottom-small"></div>
        <div className="exercise-container-outer">
          <h1 className="app-title-main-exercise">SpaceMath</h1>
          <div className="exercise-frame center-all-content no-close-icon">
            <h2>Wystąpił błąd</h2>
            <p>{fetchError}</p>
            <button className="auth-button" onClick={handleClose}>
              Wróć do menu
            </button>
          </div>
        </div>
      </>
    );
  }

  if (noLivesAtStart) {
    return (
      <>
        <div className="left-bar-main-menu-small bar-main-menu-small"></div>
        <div className="right-bar-main-menu-small bar-main-menu-small"></div>
        <div className="borrder-menu-small right-borrder-menu-top-small"></div>
        <div className="borrder-menu-small right-borrder-menu-bottom-small"></div>
        <div className="borrder-menu-small left-borrder-menu-top-small"></div>
        <div className="borrder-menu-small left-borrder-menu-bottom-small"></div>
        <div className="exercise-container-outer">
          <h1 className="app-title-main-exercise">SpaceMath</h1>
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

  if (outOfLivesMidLesson) {
    return (
      <>
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

  if (sessionDone) {
    let displayCorrectCount = 0;
    let displayFailedCount = 0;

    Object.values(questionResults).forEach((entry) => {
      if (entry.wasEverWrongThisSession) {
        displayFailedCount++;
      } else if (entry.isCompletedAndLogged) {
        displayCorrectCount++;
      }
    });

    const totalSessionSeconds = overallSessionStartTime
      ? Math.floor((Date.now() - overallSessionStartTime) / 1000)
      : 0;
    const awardedXp = initialCount > 0 ? initialCount * 100 : 0;

    return (
      <>
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
            {initialCount > 0 ? (
              <>
                <p>Czas całkowity: {totalSessionSeconds} sekund</p>
                <p>
                  Pytania ukończone bezbłędnie: {displayCorrectCount} /{" "}
                  {initialCount}
                </p>
                {displayFailedCount > 0 && (
                  <p>
                    Liczba pytań, w których popełniono błąd (co najmniej raz):{" "}
                    {displayFailedCount}
                  </p>
                )}
                <p>Otrzymałeś {awardedXp} XP za ukończenie lekcji.</p>
              </>
            ) : (
              <p>Brak pytań w tej serii. Sesja zakończona.</p>
            )}
            <button className="auth-button" onClick={handleClose}>
              Wróć do menu
            </button>
          </div>
        </div>
      </>
    );
  }

  if (lives === null || !currentQuestion) {
    return (
      <div
        style={{
          color: "white",
          fontFamily: "Orbitron, sans-serif",
          marginTop: "20vh",
          textAlign: "center",
        }}
      >
        Przygotowywanie sesji...
      </div>
    );
  }

  const progressPercentage =
    initialCount > 0
      ? Math.round(
          ((initialCount - questionsQueue.length) / initialCount) * 100
        )
      : 0;
  const buttonLabel = hasSubmitted ? "Następne" : "Zatwierdź";
  return (
    <>
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
                if (hasSubmitted) {
                  if (idx === lastSubmittedAnswer)
                    btnClass += lastAnswerCorrect ? " correct" : " incorrect";
                } else if (idx === selectedAnswer) {
                  btnClass += " selected";
                }
                return (
                  <button
                    key={`${currentQuestion.id}-${idx}`}
                    onClick={() => handleAnswerSelect(idx)}
                    disabled={hasSubmitted}
                    className={btnClass}
                  >
                    <Latex>{ans}</Latex>
                  </button>
                );
              })}
            </div>
            {currentQuestion.hint && (
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
            )}
            <div className="submit-box">
              <button
                onClick={handleButtonClick}
                disabled={
                  (!hasSubmitted && selectedAnswer === null) ||
                  currentQuestionAttemptStartTime === null ||
                  outOfLivesMidLesson
                }
                className={`auth-button ${
                  (!hasSubmitted && selectedAnswer === null) ||
                  outOfLivesMidLesson
                    ? "disabled-submit"
                    : ""
                }`}
              >
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
