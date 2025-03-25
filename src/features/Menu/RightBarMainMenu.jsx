import fire from '../../assets/images/Fire.png';
import spaceship from '../../assets/images/Spaceship.png';
import rocket0 from '../../assets/images/RocketsImages/0.png';
import rocket1 from '../../assets/images/RocketsImages/1.png';
import rocket2 from '../../assets/images/RocketsImages/2.png';
import rocket3 from '../../assets/images/RocketsImages/3.png';
import rocket4 from '../../assets/images/RocketsImages/4.png';

import { useSelector } from "react-redux";

import MiniCalendar from '../../components/MiniCalenadar/MiniCalendar';

function RightBarMainMenu(props) {
    const level = useSelector((state) => state.level);
    const lives = useSelector((state) => state.lives);
    const ship = useSelector((state) => state.rocketSkin);
    const streak = useSelector((state) => state.streak);

    const rocketImages = {
        0: rocket0,
        1: rocket1,
        2: rocket2,
        3: rocket3,
        4: rocket4,
      };


    return (<>
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet" />



        <div className=" bar-main-menu right-bar-main-menu">
            <div className="streak-main-menu-cointener">
                <p>{props.motto}</p>
                <div className="streak-main-menu">
                    <p>{streak}</p>
                    <img src={fire} className="fire"></img>
                </div>
            </div>
            <div className="spaceship-main-menu-container">
            <img className="space-ship" src={rocketImages[ship]}  />
                <div className="life">
                    {[...Array(5)].map((_, i) => (
                        <span
                            key={i}
                            className={`material-icons ${i < lives ? "icon-heart-full" : "icon-heart-empty"}`}
                        >
                            {i < lives ? "favorite" : "favorite_border"}
                        </span>
                    ))}
                </div>
                <div className="progress-container">
                    <p className="progress-number">{level}</p>
                    <div className="progress-bar">
                        <div className="progress-filled"></div>
                    </div>
                </div>

            </div>
            <MiniCalendar />



        </div>
        <div class="borrder-menu left-borrder-menu-top"></div>
        <div class="borrder-menu left-borrder-menu-bottom"></div>


    </>);
}

export default RightBarMainMenu;