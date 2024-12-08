

function LeftBarMainMenu(props){

    return(<>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"></link>

    <div class="bar-main-menu left-bar-main-menu" >
        <h1 class="app-title-main">SpaceMath</h1>

        <div class="profile">
            <img src={props.profilePicture} class="profile-picture"></img>
            <p class="user-name">{props.username}</p>
        </div>
        <div class="button-container-main-menu">
            <button class="button-main-menu" >
                 <span class="material-icons">school</span>
                Nauka
            </button>
            <button class="button-main-menu">
                <span class="material-icons">leaderboard</span>
                Ranking
            </button>
            <button class="button-main-menu">
                <span class="material-icons">group</span>
                Znajomi
            </button>
            <button class="button-main-menu">
                <span class="material-icons">person</span> 
                Profil
            </button>
            <button class="button-main-menu">
                <span class="material-icons">settings</span> 
                Ustawienia
            </button>
        </div>
        <button class="button-log-out">Wyloguj</button>
    </div>
    <div class="borrder-menu right-borrder-menu-top"></div>
    <div class=" borrder-menu right-borrder-menu-bottom"></div>

    
    </>);
}

export default LeftBarMainMenu;