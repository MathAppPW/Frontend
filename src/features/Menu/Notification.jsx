import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import profile0 from '../../assets/images/ProfileImages/0.png';
import profile1 from '../../assets/images/ProfileImages/1.png';
import profile2 from '../../assets/images/ProfileImages/2.png';
import profile3 from '../../assets/images/ProfileImages/3.png';
import profile4 from '../../assets/images/ProfileImages/4.png';
import profile5 from '../../assets/images/ProfileImages/5.png';
import profile6 from '../../assets/images/ProfileImages/6.png';
import profile7 from '../../assets/images/ProfileImages/7.png';
import profile8 from '../../assets/images/ProfileImages/8.png';
import profile9 from '../../assets/images/ProfileImages/9.png';

import rocket0 from '../../assets/images/RocketsImages/0.png';
import rocket1 from '../../assets/images/RocketsImages/1.png';
import rocket2 from '../../assets/images/RocketsImages/2.png';
import rocket3 from '../../assets/images/RocketsImages/3.png';
import rocket4 from '../../assets/images/RocketsImages/4.png';

const Notification = () => {
  const [notifi, setNotifi] = useState([]);

  const username = useSelector((state) => state.userName); 
  const profileImages = {
    0: profile0,
    1: profile1,
    2: profile2,
    3: profile3,
    4: profile4,
    5: profile5,
    6: profile6,
    7: profile7,
    8: profile8,
    9: profile9,
};
const rocketImages = {
    0: rocket0,
    1: rocket1,
    2: rocket2,
    3: rocket3,
    4: rocket4,
};

  const handleAccept = (requestId) => {
    const token = localStorage.getItem("accessToken");
  
    axios.post("/Friends/respond", {
      requestId: requestId,
      didAccept: true
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log("Zaakceptowano zaproszenie:", res.data);
        setNotifi((prev) => prev.filter((n) => n.requestId !== requestId));
      })
      .catch((err) => {
        console.error("Błąd podczas akceptacji:", err);
      });
  };
  
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
    <>
      <div className="list-of-friends-container">
        <div className="header-container">
          <p className="header-list-of-friends">Powiadomienia</p>
          <p className="liczba-znaj">Liczba nowych: {notifi.length}</p>
        </div >

        <div className="friends-container">
          {notifi.length === 0 ? (
            <p>Brak nowych zaproszeń</p>
          ) : (
            <ul>
              {notifi.map((item, index) => (
                <div className="one-nofifcation-container" key={index}>
                  <img className="one-friend-profile-picture" src={profileImages[0]} />
                  <p className="notifi-username"> {item.senderName}</p>
                  <p className="notifi-text">wysłała tobie zaproszenie do znajomych!</p>
                  <button className="notifi-button przyjmij" onClick={() => handleAccept(item.senderName, true)}>Przyjmij</button>
                  <button className="notifi-button odrzuc"> Odrzuć </button>
                </div>

              ))}
            </ul>
          )}
        </div>
      </div>

    </>
  );
};

export default Notification;
