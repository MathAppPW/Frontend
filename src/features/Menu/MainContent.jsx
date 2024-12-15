import Galactic from '../../assets/images/Galactic.png';
import Bacground from "../../features/Bacground/Bacground.jsx"

function MainContent(props){
    return(<>
    <div class="main-content-contener">
        <Bacground/>
        <div class="main-content-arrow main-content-up-arrow"></div>
        <h2 class="main-content-section"> Sekcja {props.sekcja}</h2>
        <img class="main-content-galactic" src={Galactic}></img>
        <h2 class="main-content-number">{props.numer}/5</h2>
        <div class="main-content-arrow main-content-down-arrow"></div>
    </div>
    </>);

}

export default MainContent