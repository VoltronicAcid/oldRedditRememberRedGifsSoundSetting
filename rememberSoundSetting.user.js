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

    const soundEnabled = JSON.parse(localStorage.getItem("enableSound"));

    new MutationObserver((mutationsList, observer) => {
        for (const record of mutationsList) {
            const { target, addedNodes } = record;

            if (target.classList.contains("routeWrapper")) {
                if (addedNodes.length) {
                    const [node] = addedNodes;

                    if (node.classList.contains("embeddedPlayer")) {
                        const videoButtons = node.querySelectorAll("div.buttons > div.button");

                        if (videoButtons.length === 4 && soundEnabled) {
                            const [soundButton] = videoButtons;

                            const soundSVG = soundButton.querySelector("svg.soundOff");
                            soundSVG.dispatchEvent(new MouseEvent('click', {
                                bubbles: true,
                            }));
                        }

                        new MutationObserver((list, obs) => {
                            for (const { addedNodes, removedNodes } of list) {
                                if (addedNodes.length) {
                                    const addedNode = addedNodes[0].firstElementChild;

                                    if (addedNode.classList.contains("soundOff")) {
                                        localStorage.setItem("enableSound", false);
                                    }
                                    if (addedNode.classList.contains("soundOn")) {
                                        localStorage.setItem("enableSound", true);
                                    }
                                }
                            }
                        }).observe(node, { subtree: true, childList: true, })

                        observer.disconnect();
                    }
                }
            }
        }
    }).observe(document.body, { subtree: true, childList: true, });
})();
