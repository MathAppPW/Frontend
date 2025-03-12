function MainContainerExersiceSeries(){
    return(<>
    <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      ></link>

    <div className="main-exercise-container">
    <h1 className="app-title-main app-title-main-exercise">SpaceMath</h1>
        <div className="frame">

            <div className="exercise-progress-bar-container">
            <span className="material-icons icons-progress-bar">close</span>
                <div className="exercise-progress-bar">
                    <div className="exercise-progress"></div>
                </div>
                <div className="life-left-container">
                <span className="life-left">5</span>
                <span className="icon-heart-full material-icons icons-progress-bar">favorite</span>
                </div>
            </div>
            <div className="exercise-container">
                <p className="polecenie">polecenie</p>
                <p className="zdjecie">zdjęcie</p>
                <div className="answer-button-container">
                <p>odpowiedzi</p>

                </div>
                <div className="hint-container">
                    <button className="button-hint"> guzik podpowiedz</button>
                    <p>podpowiedz</p>
                </div>

            </div>
        </div>
    </div>
    
    </>);
}

export default MainContainerExersiceSeries;