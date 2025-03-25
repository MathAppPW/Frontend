
import LeftBarMainMenu from "../features/Menu/LeftBarMainMenu";
import ListOfFriends from "../features/Menu/ListOfFriends";

import RightBarMainMenu from "../features/Menu/RightBarMainMenu";

const Friends = () => {
    return (
        <>
            <LeftBarMainMenu />
            <ListOfFriends/>

            <RightBarMainMenu motto="Tak trzymaj!"  />
        </>
    );
}

export default Friends;