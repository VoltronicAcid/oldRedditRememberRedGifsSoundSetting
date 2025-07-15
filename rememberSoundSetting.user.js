// ==UserScript==
// @name         Old Reddit - Remember RedGif Sound Setting
// @description  Unmute content from redgifs.com on old.reddit.com
// @author       VoltronicAcid
// @version      0.0.1
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @match        https://www.redgifs.com/ifr/*
// @match        https://www.redgifs.com/watch/*
// ==/UserScript==

(() => {
    "use strict";

    const enforceSoundSettings = (player) => {
        const soundEnabled = JSON.parse(localStorage.getItem("enableSound"));

        const videoButtons = player.querySelectorAll("div.buttons > div.button");

        if (videoButtons.length === 4 && soundEnabled) {
            const [soundButton] = videoButtons;

            const soundSVG = soundButton.querySelector("svg.soundOff");
            soundSVG.dispatchEvent(new MouseEvent('click', {
                bubbles: true,
            }));
        }
    };

    const watchSoundButtons = (player) => {
        new MutationObserver((mutations) => {
            for (const { addedNodes } of mutations) {
                if (addedNodes.length) {
                    const svg = addedNodes[0].firstElementChild;

                    if (svg.classList.contains("soundOff")) {
                        localStorage.setItem("enableSound", false);
                    }

                    if (svg.classList.contains("soundOn")) {
                        localStorage.setItem("enableSound", true);
                    }
                }
            }
        }).observe(player, { subtree: true, childList: true, });
    };

    new MutationObserver((mutations, observer) => {
        for (const { target, addedNodes } of mutations) {
            const [node] = addedNodes;

            if (target.className === "routeWrapper" && node?.className === "embeddedPlayer") {
                enforceSoundSettings(node);
                watchSoundButtons(node);

                observer.disconnect();
            }
        }
    }).observe(document.body, { subtree: true, childList: true, });
})();
