import LeftBar from "../features/ExerciseSeries/LeftBar";
import RightBar from "../features/ExerciseSeries/RightBar";
import FavoriteAlien from '../assets/images/Favorite_Alien.png';
import MainContainerExersiceSeries from "../features/ExerciseSeries/MainContainerExersiceSeries";

function ExerciseSeries(){
    return( <>
    <LeftBar />
    <MainContainerExersiceSeries/>
    <RightBar/>
    </>);

}

export default ExerciseSeries;