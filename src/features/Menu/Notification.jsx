import React, { useEffect, useState } from "react";
import axios from "axios";


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
import { useSelector } from 'react-redux';

import { useDispatch } from "react-redux";
import { fetchNotifications } from "../../../src/store/reducer.jsx";

const Notification = () => {
  const [notifi, setNotifi] = useState([]);
  const dispatch = useDispatch();
  const notiNumber = useSelector((state) => state.notification);

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

  const handleAnswer = async (requestId, actept_decline) => {
    const token = localStorage.getItem("accessToken");

    try {
      const res = await axios.post("/Friends/respond", {
        requestId,
        didAccept: actept_decline
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(
        actept_decline ? "Zaakceptowano zaproszenie:" : "Odrzucono zaproszenie:",
        res.data
      );

  
      await dispatch(fetchNotifications());
      loadNotifications();

      setNotifi((prev) => prev.filter((n) => n.requestId !== requestId));

    } catch (err) {
      console.error("Błąd podczas akceptacji/odrzucenia:", err);
      if (err.response) {
        console.error("Szczegóły błędu:", err.response.data);
      }
    }
  };




  const loadNotifications = () => {
    const token = localStorage.getItem("accessToken");

    axios.get("/Friends/getPendingRequests", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setNotifi(res.data);
      })
      .catch((err) => {
        console.error("Błąd podczas pobierania powiadomień:", err);
        if (err.response) {
          console.error("Szczegóły odpowiedzi z backendu:", err.response.data);
        }
      });
      console.log(notifi.length)
  };

  useEffect(() => {
    loadNotifications();
  }, []);


  return (
    <>
      <div className="list-of-friends-container">
        <div className="header-container">
          <p className="header-list-of-friends">Powiadomienia</p>
          <p className="liczba-znaj">Liczba nowych: {notiNumber}</p>
        </div >

        <div className="friends-container">
          {notifi.length === 0 ? (
            <p>Brak nowych zaproszeń</p>
          ) : (
            <ul>
              {notifi.map((item, index) => (
                <div className="one-nofifcation-container" key={index}>
                  <img className="one-friend-profile-picture" src={profileImages[item.avatarSkinId]} />
                  <p className="notifi-username"> {item.senderName}</p>
                  <p className="notifi-text">wysłała tobie zaproszenie do znajomych!</p>
                  <button className="notifi-button przyjmij" onClick={() => handleAnswer(item.id, true)}>Przyjmij</button>
                  <button className="notifi-button odrzuc" onClick={() => handleAnswer(item.id, false)}> Odrzuć </button>
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
