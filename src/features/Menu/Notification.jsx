import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const Notification = () => {
  const [notifi, setNotifi] = useState([]);
  const username = useSelector((state) => state.userName); // lub np. state.user.userName

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
  
    axios.get("/Friends/getPendingRequests", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log("Odpowiedź z endpointa /Friends/getPendingRequests:", res.data);
        setNotifi(res.data);
      })
      .catch((err) => {
        console.error("Błąd podczas pobierania powiadomień:", err);
        if (err.response) {
          console.error("Szczegóły odpowiedzi z backendu:", err.response.data);
        }
      });
  }, [username]);

  return (
    <div>
      <h3>Powiadomienia</h3>
      {notifi.length === 0 ? (
        <p>Brak nowych zaproszeń</p>
      ) : (
        <ul>
          {notifi.map((item, index) => (
            <li key={index}>
              {item.senderName} ➝ {item.receiverName} ({item.timeStamp})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notification;
