// ==UserScript==
// @name         Old Reddit - Remember RedGif Sound Setting
// @description  Unmute content from redgifs.com on old.reddit.com
// @author       VoltronicAcid
// @version      0.0.2
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @match        https://www.redgifs.com/ifr/*
// @match        https://www.redgifs.com/watch/*
// ==/UserScript==

(() => {
    "use strict";

    const enableSound = (player) => {
        const soundOn = JSON.parse(localStorage.getItem("enableSound"));
        const svg = player.querySelector("div.buttons > div.button:nth-child(1) > svg.soundOff");

        if (soundOn && svg) {
            svg.dispatchEvent(new MouseEvent("click", {
                bubbles: true,
            }));
        }
    };

    const observeVideoPlayer = (player) => {
        new MutationObserver((mutations) => {
            for (const { addedNodes } of mutations) {
                if (addedNodes.length) {
                    const svg = addedNodes[0].firstElementChild;
                    localStorage.setItem("enableSound", svg.className.baseVal === "soundOn");
                }
            }
        }).observe(player, { subtree: true, childList: true, });
    };

    new MutationObserver((mutations, observer) => {
        for (const { target, addedNodes } of mutations) {
            if (target.className === "routeWrapper" && addedNodes[0]?.className === "embeddedPlayer") {
                const [videoPlayer] = addedNodes;

                enableSound(videoPlayer);
                observeVideoPlayer(videoPlayer);

                observer.disconnect();
            }
        }
    }).observe(document.body, { subtree: true, childList: true, });
})();
