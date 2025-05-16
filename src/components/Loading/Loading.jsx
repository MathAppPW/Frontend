import "./Loading.css"

export default function Loading() {
    return (
        <>
            <div className="loadingContent">
                <div className="planet"></div>

                <div className="orbitWrapper orbit1">
                    <div className="satellite"></div>
                </div>
                <div className="orbitWrapper orbit2">
                    <div className="satellite"></div>
                </div>
                <div className="orbitWrapper orbit3 reverse">
                    <div className="satellite"></div>
                </div>
                <div className="orbitWrapper orbit4">
                    <div className="satellite"></div>
                </div>
            </div>
            <p className="loadingText">Wczytywanie ...</p>
        </>
    );
}
