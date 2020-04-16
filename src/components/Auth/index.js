import React from 'react'

const Auth = (Component) => {
    
    React.useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://connect.facebook.net/en_US/fbinstant.6.3.js";
        script.id = "fbinstant";
        document.body.appendChild(script);

        script.onload = () => {
            window.FBInstant.initializeAsync().then(function () {
                window.FBInstant.startGameAsync().then(() => {
                    var contextId = window.FBInstant.context.getID();
                    var contextType = window.FBInstant.context.getType();

                    var playerName = window.FBInstant.player.getName();
                    var playerPic = window.FBInstant.player.getPhoto();
                    var playerId = window.FBInstant.player.getID();

                    console.log({ playerName, playerPic });
                });
            });
        };
    });
    return (() => {
        return (
            <Component />
        )
    })
}
export default Auth;