
import LeftBarMainMenu from "../features/Menu/LeftBarMainMenu";
import RankList from "../features/Menu/RankList";

import RightBarMainMenu from "../features/Menu/RightBarMainMenu";

const Rank = () => {
    return (
        <>
            <LeftBarMainMenu />
            <RankList/>

            <RightBarMainMenu motto="Tak trzymaj!"  />
        </>
    );
}

export default Rank;