import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
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

import UserProfilePopup from "../../components/Popup/UserProfilePopup";


const RankList = () => {

    const RankLenght = 50;


    const [rank, setRank] = useState();
    const [searchError, setSearchError] = useState();


    const [showUserPopup, setShowUserPopup] = useState(false);
    const username = useSelector((state) => state.userName);
    const profilePicture = useSelector((state) => state.profilePicture)

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


    const getAuthHeader = () => ({
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
    });


    const getGlobalRank = () => {
        axios.get(`/Ranking/getGlobal/${RankLenght}`, getAuthHeader())
            .then(res => {
                setRank(res.data);
                setSearchError(false);
            })
            .catch(err => {
                console.error(err);
                setSearchError(true);
            });
    };

    const getFriendRank = () => {
        axios.get(`/Ranking/getFriend/${RankLenght}`, getAuthHeader())
            .then(res => {
                setRank(res.data);
                setSearchError(false);
            })
            .catch(err => {
                console.error(err);
                setSearchError(true);
            });
    };


    useEffect(() => {
        if (username && username !== "Nieznany") {
            getGlobalRank();
        }
    }, [username]);



    const handleSubmit = (e) => {
        if (e.target.value == 'znajomi') {
            getFriendRank();
        }
        else {
            getGlobalRank();
        }
    };

    const getTimeRemaining = (finishDateStr) => {
        const now = new Date();
        const finishDate = new Date(finishDateStr);
        const diffMs = finishDate - now;

        if (diffMs <= 0) return "0 dni";

        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);

        return `${diffDays} dni i ${diffHours}h`;
    };

    return (
        <>
            <div className="list-of-friends-container">
                <div className="header-container">
                    <p className="header-list-of-friends">Ranking</p>
                    {!rank || !rank.rankingEntries ? (
                        <p>Pobieranie</p>
                    ) : (
                        <p className="liczba-znaj">Pozostało {getTimeRemaining(rank.finishDate)}</p>)}
                </div >

                <div className="typ-rank-container">
                    <select className="task-filter-rank" onChange={handleSubmit}>
                        <option value='ogolny'>Ogólny</option>
                        <option value='znajomi'>Znajomi</option>
                    </select>
                </div>

                <div className="rank-all-container">
                    <div className="rank-all-container-list">
                        {!rank || !rank.rankingEntries ? (
                            <p>Pobieranie</p>
                        ) : (
                            rank.rankingEntries.map((friend, index) => {
                                const isCurrentUser = friend.username === username;
                                return (
                                    <div
                                        className={`one-friend-record ${isCurrentUser ? 'one-friend-record-my' : ''}`}
                                        key={index}
                                    >
                                        <p>{index + 1}.</p>
                                        <div onClick={() => setShowUserPopup(friend.username)} className={`one-friend-container-rank ${isCurrentUser ? 'one-friend-container-rank-my' : ''}`}>
                                            <p className='num-of-exercies'>{friend.score} zadań</p>
                                            <img className="one-friend-profile-picture-rank" src={profileImages[friend.profileSkin]} />
                                            <p className="friend-userName-rank">{friend.username}</p>
                                            <div className="firnds-onfo-container-rank">
                                                <p className="friend-level-rank">Level: 0</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })

                        )}
                        {showUserPopup && (
                            <UserProfilePopup
                                username={showUserPopup}
                                onClose={() => setShowUserPopup(false)}
                            />
                        )}

                    </div>


                    < div className='line'></div>
                    {!rank ? (
                        <p>Pobieranie</p>
                    ) : (
                        <div className='one-friend-record one-friend-record-my'>
                            <p>{rank.yourPosition}</p>
                            <div className="one-friend-container-rank one-friend-container-rank-my" >
                                <p className='num-of-exercies'> {0} zadań </p>
                                <img className="one-friend-profile-picture-rank" src={profileImages[profilePicture]} />
                                <p className="friend-userName-rank"> {username} </p>
                                <div className="firnds-onfo-container-rank">
                                    <p className="friend-level-rank">Level: {0}</p>
                                </div>
                            </div>
                        </div>)}

                </div>

            </div >

        </>
    );
}

export default RankList