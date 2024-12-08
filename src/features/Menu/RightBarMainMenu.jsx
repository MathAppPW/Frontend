import fire from '../../assets/images/Fire.png';
import spaceship from '../../assets/images/Spaceship.png';

import MiniCalendar from '../../components/MiniCalenadar/MiniCalendar';

function RightBarMainMenu(props){
    

    return(<>
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet"/>

    

    <div class=" bar-main-menu right-bar-main-menu">
        <div class="streak-main-menu-cointener">
            <p>{props.motto}</p>
            <div class="streak-main-menu">
                <p>{props.streak}</p>
                <img src={fire} class="fire"></img>
            </div>
        </div>
        <div class="spaceship-main-menu-container">
            <img class="space-ship" src={spaceship}></img>
            <div class="life">
                <span className="icon-heart-full material-icons">favorite</span>
                <span className="icon-heart-full material-icons">favorite</span>
                <span className="icon-heart-full material-icons">favorite</span>
                <span className="icon-heart-empty material-icons">favorite_border</span>
                <span className="icon-heart-empty material-icons">favorite_border</span>
                
            </div>
           <div className="progress-container">
                <p className="progress-number">{props.level}</p>
                <div className="progress-bar">
                    <div className="progress-filled"></div>
                </div>
            </div>

        </div>
        <MiniCalendar/>
    
   

    </div>
    <div class="borrder-menu left-borrder-menu-top"></div>
    <div class="borrder-menu left-borrder-menu-bottom"></div>

    
    </>);
}

export default RightBarMainMenu;