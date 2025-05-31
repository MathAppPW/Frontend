import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Latex from "react-latex-next"
import "katex/dist/katex.min.css"; 
import Loading from "../../components/Loading/Loading.jsx";
import "../../styles/theory.css";

export default function Theory() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const chapter = searchParams.get("section");
  const lesson = searchParams.get("lesson");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!chapter || !lesson) {
      setError("Brakujące parametry: rozdział lub lekcja.");
      setLoading(false);
      return;
    }

    axios
      .get(`/Exercise/theory/${chapter}/${lesson}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      .then((res) => {
        console.log("Odpowiedź z serwera:", res.data);
        if (res.data && typeof res.data.content === "string") {
          setData(res.data);
        } else {
          console.error(
            "Nieprawidłowy format danych. Oczekiwano obiektu z polem 'content'. Otrzymano:",
            res.data
          );
          setError("Nieprawidłowy format danych z serwera.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Błąd podczas pobierania danych:", err);
        if (err.response) {
          console.error("Odpowiedź serwera z błędem:", err.response.data);
          setError(
            `Błąd serwera: ${err.response.status} - ${
              err.response.data.message || err.response.data
            }`
          );
        } else if (err.request) {
          console.error("Brak odpowiedzi od serwera:", err.request);
          setError("Nie udało się połączyć z serwerem.");
        } else {
          setError(`Błąd: ${err.message}`);
        }
        setLoading(false);
      });
  }, [chapter, lesson, token]);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="theory-container-outer error-page">
        <h1 className="title">SpaceMath</h1>
        <div className="theory-box">
          <button
            className="theory-exit-button"
            onClick={() => navigate(`/system?section=${chapter || "1"}`)}
          >
            x
          </button>
          <h2>Błąd</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!data || !data.content) {
    return (
      <div className="theory-container-outer no-data-page">
        <h1 className="title">SpaceMath</h1>
        <div className="theory-box">
          <button
            className="theory-exit-button"
            onClick={() => navigate(`/system?section=${chapter || "1"}`)}
          >
            x
          </button>
          <h2>Brak Danych</h2>
          <p>Brak treści do wyświetlenia dla tej lekcji.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="theory-container-outer">
        <h1 className="title">SpaceMath</h1>
        <div className="theory-box">
          <button
            className="theory-exit-button"
            onClick={() => navigate(`/system?section=${chapter}`)}
          >
            x
          </button>
          <h2>{chapter ? chapter.replaceAll("_", " ") : "Rozdział"}</h2>
          <h3>{lesson ? lesson.replaceAll("_", " ") : "Lekcja"}</h3>
          <div className="theory-box-content">
            <Latex>{data.content}</Latex>
          </div>
        </div>
      </div>
    </>
  );
}
