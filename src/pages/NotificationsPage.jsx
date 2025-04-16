import React from "react";
import LeftBarMainMenu from "../features/Menu/LeftBarMainMenu";
import RightBarMainMenu from "../features/Menu/RightBarMainMenu";
import Notification from "../features/Menu/Notification";



const NotificationsPage = () => {
    return (<>
        <LeftBarMainMenu />
        <Notification />
        <RightBarMainMenu motto="Tak trzymaj!" />
    </>)
}
export default NotificationsPage