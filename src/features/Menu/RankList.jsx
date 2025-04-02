import fire from '../../assets/images/Fire.png';

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


const RankList = () => {
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

    return (
        <>
            <div className="list-of-friends-container">
                <div className="header-container">
                    <p className="header-list-of-friends">Ranking</p>
                    <p className="liczba-znaj">Pozostało 2 dni i 30h</p>
                </div >

                <div className="typ-rank-container">
                    <label className="radio-label">
                        <input type="radio" name="ranking" />
                        <span className="custom-radio"></span>
                        Ogólny
                    </label>
                    <label className="radio-label">
                        <input type="radio" name="ranking" />
                        <span className="custom-radio"></span>
                        Znajomi
                    </label>
                </div>


                <div className="rank-all-container">
                    {[...Array(10)].map((_, i) => (
                        <div className='one-friend-record'>
                            <p>{i + 1}.</p>
                            <div className="one-friend-container-rank" key={i}>
                                <p className='num-of-exercies'> {500 - i * 30} zadań </p>
                                <img className="one-friend-profile-picture-rank" src={profileImages[i % 10]} />
                                <p className="friend-userName-rank"> username {i + 1}</p>
                                <div className="firnds-onfo-container-rank">
                                    <p className="friend-level-rank">Level: {i * + (i * 7 % (i + 1)) + 3}</p>
                                </div>
                            </div>
                        </div>
                    ))}



                </div>

            </div >

        </>
    );
}

export default RankList