// Jim Whitehead
// Created: 4/25/2024
// Phaser: 3.70.0
//
// Bullet Time
//
// Multiple examples of how to implement bullet firing logic using Phaser
// 
// Art assets from Kenny Assets:
// https://kenney.nl/assets/

// debug with extreme prejudice
"use strict"

// game config
let config = {
    type: Phaser.CANVAS,
    parent: "phaser-game",

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },

    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },

    scene: [GalleryShooter]
};

let game = new Phaser.Game(config);