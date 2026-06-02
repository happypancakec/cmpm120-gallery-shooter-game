class GalleryShooter extends Phaser.Scene {
    constructor() {
        super("galleryShooterScene");
    }

    preload() {
        this.load.setPath("./assets/");

        for (let i = 1; i <= 9; i++) {
            this.load.image("introSlide" + i, "introslide" + i + ".png");
        }

        for (let i = 1; i <= 5; i++) {
            this.load.image("preBossSlide" + i, "PrebossCutsceneSlide" + i + ".png");
        }

        this.load.audio("bellaIntroDialogue", "bellaIntroDialogue.wav");
        this.load.audio("BellaIntroDialogue2", "BellaIntroDialogue2.wav");
        this.load.audio("bellaIntroDialogue3", "bellaIntroDialogue3.wav");
        this.load.audio("bellaIntroDialogue4", "bellaIntroDialogue4.wav");
        this.load.audio("bellaIntroDialogue5", "bellaIntroDialogue5.wav");
        this.load.audio("bellaIntroDialogue7", "bellaIntroDialogue7.wav");
        this.load.audio("bellaIntroDialogue8", "bellaIntroDialogue8.wav");
        this.load.audio("bellaIntroDialogue9", "bellaIntroDialogue9.wav");

        this.load.image("bg1", "1.png");
        this.load.image("bg2", "2.png");
        this.load.image("bg3", "3.png");
        this.load.image("bg4", "4.png");

        this.load.image("bossBg1", "boss1bg.png");
        this.load.image("bossBg2", "boss2bg.png");
        this.load.image("bossBg3", "boss3bg.png");

        this.load.image("playerShip", "ship_0020.png");
        this.load.image("enemyShip", "ship_0013.png");
        this.load.image("bossShip", "ship_0015.png");

        this.load.image("playerBullet", "tile_0000.png");
        this.load.image("enemyBullet", "tile_0012.png");
        this.load.image("healthPickup", "tile_0024.png");

        this.load.image("bellPortrait", "picture bust.png");
        this.load.image("valPortrait", "valBust.png");

        this.load.audio("bulletSound", "BulletSound.mp3");
        this.load.audio("healthPickupSound", "HealthPickupSound.mp3");
        this.load.audio("defeatSound", "defeatsound.mp3");

        this.load.audio("cutsceneMusic", "CutsceneMusic.mp3");
        this.load.audio("bgMusic", "BackgroundMusic.mp3");
        this.load.audio("bossMusic", "BossMusic.mp3");
        this.load.audio("gameOverMusic", "GameOverMusic.mp3");

        this.load.audio("voiceline1", "voiceline1.wav");
        this.load.audio("voiceline2", "voiceline2.wav");
        this.load.audio("voiceline3", "voiceline3.wav");
        this.load.audio("voiceline4", "voiceline4.wav");
        this.load.audio("voiceline5", "voiceline5.wav");
        this.load.audio("voiceline6", "voiceline6.wav");

        this.load.audio("enemyline1", "enemyline1.wav");
        this.load.audio("enemyline2", "enemyline2.wav");
        this.load.audio("enemyline3", "enemyline3.wav");
        this.load.audio("BellatoVal", "BellatoVal.wav");
        this.load.audio("BellatoVal2", "BellatoVal2.wav");
    }

    create() {
        this.sound.stopAll();

        this.inMenu = true;
        this.inOpeningCutscene = false;
        this.openingSlideIndex = 1;

        this.createGameObjects();
        this.createStartMenu();
    }

    fitToScreen(image) {
        const { width, height } = this.scale;

        image.setPosition(width / 2, height / 2);
        image.setScale(Math.max(width / image.width, height / image.height));
    }

    fitInsideScreen(image) {
        const { width, height } = this.scale;

        image.setPosition(width / 2, height / 2);
        image.setScale(Math.min(width / image.width, height / image.height));
    }

    createGameObjects() {
        const { width, height } = this.scale;

        this.bg1 = this.add.image(0, 0, "bg1").setDepth(-40);
        this.bg2 = this.add.image(0, 0, "bg2").setDepth(-30);
        this.bg3 = this.add.image(0, 0, "bg3").setDepth(-20);
        this.bg4 = this.add.image(0, 0, "bg4").setDepth(-10);

        this.fitToScreen(this.bg1);
        this.fitToScreen(this.bg2);
        this.fitToScreen(this.bg3);
        this.fitToScreen(this.bg4);

        this.bossBg1 = this.add.image(0, 0, "bossBg1").setDepth(-40).setVisible(false);
        this.bossBg2 = this.add.image(0, 0, "bossBg2").setDepth(-30).setVisible(false);
        this.bossBg3 = this.add.image(0, 0, "bossBg3").setDepth(-20).setVisible(false);

        this.fitToScreen(this.bossBg1);
        this.fitToScreen(this.bossBg2);
        this.fitToScreen(this.bossBg3);

        this.bg2StartX = this.bg2.x;
        this.bg3StartX = this.bg3.x;
        this.bossBg2StartX = this.bossBg2.x;
        this.bossBg3StartX = this.bossBg3.x;

        this.score = 0;
        this.lives = 3;
        this.wave = 1;
        this.bossBattleStarted = false;
        this.preBossCutsceneStarted = false;
        this.gameIsOver = false;
        this.cutsceneActive = true;
        this.introStarted = false;

        this.player = this.physics.add.sprite(width / 2, height - 80, "playerShip");
        this.player.setScale(3);
        this.player.setCollideWorldBounds(true);
        this.player.setVisible(false);
        this.player.body.enable = false;

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys("W,A,S,D,SPACE");

        this.playerBullets = this.physics.add.group();
        this.enemyBullets = this.physics.add.group();
        this.enemies = this.physics.add.group();
        this.healthPickups = this.physics.add.group();

        this.bulletSound = this.sound.add("bulletSound", { volume: 0.4 });
        this.healthPickupSound = this.sound.add("healthPickupSound", { volume: 0.6 });
        this.defeatSound = this.sound.add("defeatSound", { volume: 0.7 });

        this.cutsceneMusic = this.sound.add("cutsceneMusic", { volume: 0.35, loop: true });
        this.bgMusic = this.sound.add("bgMusic", { volume: 0.25, loop: true });
        this.bossMusic = this.sound.add("bossMusic", { volume: 0.35, loop: true });
        this.gameOverMusic = this.sound.add("gameOverMusic", { volume: 0.35, loop: true });

        this.currentRadioSound = null;
        this.currentIntroSound = null;

        this.scoreText = this.add.text(20, 20, "Score: 0", {
            fontSize: "24px",
            fill: "#ffffff"
        }).setVisible(false);

        this.livesText = this.add.text(20, 55, "Lives: 3", {
            fontSize: "24px",
            fill: "#ffffff"
        }).setVisible(false);

        this.waveText = this.add.text(width - 150, 20, "Wave: 1", {
            fontSize: "24px",
            fill: "#ffffff"
        }).setVisible(false);

        this.bossHealthText = this.add.text(width / 2 - 110, 20, "", {
            fontSize: "24px",
            fill: "#ff6666"
        }).setVisible(false);

        this.dialogueBox = this.add.rectangle(width / 2, height - 30, width - 40, 50, 0x000000, 0.75)
            .setVisible(false);

        this.dialogueText = this.add.text(150, height - 47, "RADIO: Awaiting transmission...", {
            fontSize: "16px",
            fill: "#66ccff",
            wordWrap: { width: width - 190 }
        }).setVisible(false);

        this.bellPortrait = this.add.image(78, height - 45, "bellPortrait");
        this.bellPortrait.setScale(0.7);
        this.bellPortrait.setDepth(10);
        this.bellPortrait.setVisible(false);

        this.valPortrait = this.add.image(78, height - 45, "valPortrait");
        this.valPortrait.setDisplaySize(90, 90);
        this.valPortrait.setDepth(10);
        this.valPortrait.setVisible(false);

        this.physics.add.overlap(this.playerBullets, this.enemies, this.bulletHitsEnemy, null, this);
        this.physics.add.overlap(this.enemyBullets, this.player, this.enemyBulletHitsPlayer, null, this);
        this.physics.add.overlap(this.enemies, this.player, this.enemyHitsPlayer, null, this);
        this.physics.add.overlap(this.player, this.healthPickups, this.collectHealthPickup, null, this);
    }

    createStartMenu() {
        const { width, height } = this.scale;

        this.menuOverlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.75).setDepth(2000);

        this.titleText = this.add.text(width / 2, height / 2 - 115, "GALLERY SHOOTER", {
            fontSize: "54px",
            fill: "#ffffff"
        }).setOrigin(0.5).setDepth(2001);

        this.playButton = this.add.rectangle(width / 2, height / 2 + 25, 240, 70, 0x2244aa)
            .setInteractive()
            .setDepth(2001);

        this.playButtonText = this.add.text(width / 2, height / 2 + 25, "PLAY", {
            fontSize: "34px",
            fill: "#ffffff"
        }).setOrigin(0.5).setDepth(2002);

        this.creditsButton = this.add.rectangle(width / 2, height / 2 + 110, 330, 60, 0x333333)
            .setInteractive()
            .setDepth(2001);

        this.creditsButtonText = this.add.text(width / 2, height / 2 + 110, "CONTROLS / CREDITS", {
            fontSize: "24px",
            fill: "#ffffff"
        }).setOrigin(0.5).setDepth(2002);

        this.playButton.on("pointerover", () => {
            this.playButton.setFillStyle(0x4466ff);
        });

        this.playButton.on("pointerout", () => {
            this.playButton.setFillStyle(0x2244aa);
        });

        this.creditsButton.on("pointerover", () => {
            this.creditsButton.setFillStyle(0x555555);
        });

        this.creditsButton.on("pointerout", () => {
            this.creditsButton.setFillStyle(0x333333);
        });

        this.playButton.on("pointerdown", () => {
            this.startOpeningCutscene();
        });

        this.creditsButton.on("pointerdown", () => {
            this.showControlsCredits();
        });
    }

    showControlsCredits() {
        const { width, height } = this.scale;

        this.creditsPanel = this.add.rectangle(width / 2, height / 2, width - 80, height - 80, 0x000000, 0.92)
            .setDepth(3000);

        this.creditsText = this.add.text(
            width / 2,
            height / 2 - 35,
            "CONTROLS\n\nWASD / Arrow Keys: Move\nSPACE: Shoot\n\nCREDITS\n\nGame by Chloe\nAssets, music, and voice lines from project files",
            {
                fontSize: "24px",
                fill: "#ffffff",
                align: "center",
                wordWrap: { width: width - 140 }
            }
        ).setOrigin(0.5).setDepth(3001);

        this.backButton = this.add.rectangle(width / 2, height - 90, 220, 60, 0x2244aa)
            .setInteractive()
            .setDepth(3001);

        this.backButtonText = this.add.text(width / 2, height - 90, "BACK", {
            fontSize: "28px",
            fill: "#ffffff"
        }).setOrigin(0.5).setDepth(3002);

        this.backButton.on("pointerover", () => {
            this.backButton.setFillStyle(0x4466ff);
        });

        this.backButton.on("pointerout", () => {
            this.backButton.setFillStyle(0x2244aa);
        });

        this.backButton.on("pointerdown", () => {
            this.creditsPanel.destroy();
            this.creditsText.destroy();
            this.backButton.destroy();
            this.backButtonText.destroy();
        });
    }

    startOpeningCutscene() {
        this.inMenu = false;
        this.inOpeningCutscene = true;

        this.menuOverlay.destroy();
        this.titleText.destroy();
        this.playButton.destroy();
        this.playButtonText.destroy();
        this.creditsButton.destroy();
        this.creditsButtonText.destroy();

        this.openingSlideIndex = 1;
        this.openingSlideRunId = 0;

        if (!this.cutsceneMusic.isPlaying) {
            this.cutsceneMusic.play();
        }

        const { width, height } = this.scale;

        this.introSlideImage = this.add.image(width / 2, height / 2, "introSlide1")
            .setDepth(1500);

        this.fitInsideScreen(this.introSlideImage);

        this.time.delayedCall(800, () => {
            this.playOpeningSlide();
        });
    }

    playOpeningSlide() {
        this.openingSlideRunId++;
        const runId = this.openingSlideRunId;

        if (this.openingSlideIndex > 9) {
            this.endOpeningCutscene();
            return;
        }

        const slideNumber = this.openingSlideIndex;

        this.introSlideImage.setTexture("introSlide" + slideNumber);
        this.fitInsideScreen(this.introSlideImage);

        if (this.currentIntroSound) {
            this.currentIntroSound.stop();
            this.currentIntroSound.destroy();
            this.currentIntroSound = null;
        }

        const slideDurations = {
            1: 5000,
            2: 5000,
            3: 7500,
            4: 5500,
            5: 8500,
            6: 3500,
            7: 8000,
            8: 8000,
            9: 6000
        };

        const audioStartDelay = {
            1: 700,
            2: 400,
            3: 400,
            4: 400,
            5: 1000,
            7: 1000,
            8: 1000,
            9: 500
        };

        const audioKeys = {
            1: "bellaIntroDialogue",
            2: "BellaIntroDialogue2",
            3: "bellaIntroDialogue3",
            4: "bellaIntroDialogue4",
            5: "bellaIntroDialogue5",
            7: "bellaIntroDialogue7",
            8: "bellaIntroDialogue8",
            9: "bellaIntroDialogue9"
        };

        const duration = slideDurations[slideNumber] || 5000;
        const soundKey = audioKeys[slideNumber];

        if (soundKey) {
            this.time.delayedCall(audioStartDelay[slideNumber] || 500, () => {
                if (runId !== this.openingSlideRunId) return;

                if (!this.cache.audio.exists(soundKey)) {
                    console.warn("Missing intro audio:", soundKey);
                    return;
                }

                this.currentIntroSound = this.sound.add(soundKey, { volume: 0.9 });
                this.currentIntroSound.play();
            });
        }

        this.time.delayedCall(duration, () => {
            if (runId !== this.openingSlideRunId) return;

            if (this.currentIntroSound) {
                this.currentIntroSound.stop();
                this.currentIntroSound.destroy();
                this.currentIntroSound = null;
            }

            this.openingSlideIndex++;
            this.playOpeningSlide();
        });
    }

    endOpeningCutscene() {
        this.inOpeningCutscene = false;

        if (this.currentIntroSound && this.currentIntroSound.isPlaying) {
            this.currentIntroSound.stop();
        }

        this.cutsceneMusic.stop();

        this.introSlideImage.destroy();

        this.showGameUI();
        this.startIntroCutscene();
    }

    showGameUI() {
        this.player.setVisible(true);
        this.player.body.enable = true;

        this.scoreText.setVisible(true);
        this.livesText.setVisible(true);
        this.waveText.setVisible(true);
        this.bossHealthText.setVisible(true);
        this.dialogueBox.setVisible(true);
        this.dialogueText.setVisible(true);
    }

    update() {
        this.updateBackground();

        if (this.inMenu || this.inOpeningCutscene || this.gameIsOver || this.cutsceneActive) {
            return;
        }

        this.player.setVelocity(0);

        if (this.cursors.left.isDown || this.keys.A.isDown) this.player.setVelocityX(-250);
        if (this.cursors.right.isDown || this.keys.D.isDown) this.player.setVelocityX(250);
        if (this.cursors.up.isDown || this.keys.W.isDown) this.player.setVelocityY(-250);
        if (this.cursors.down.isDown || this.keys.S.isDown) this.player.setVelocityY(250);

        if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) {
            this.shootPlayerBullet();
        }

        this.cleanupObjects();

        if (this.enemies.countActive(true) === 0 && !this.bossBattleStarted && !this.preBossCutsceneStarted) {
            this.wave++;
            this.waveText.setText("Wave: " + this.wave);

            if (this.wave === 2) {
                this.playRadioMessage("RADIO: Their formations are getting stranger...", "voiceline6");
            }

            if (this.wave === 3) {
                this.playRadioMessage("RADIO: That flight pattern... why does it feel familiar?", "voiceline4");
            }

            if (this.wave > 5) {
                this.startPreBossCutscene();
            } else {
                this.spawnEnemies();
            }
        }
    }

    updateBackground() {
        if (this.bossBattleStarted) {
            this.bossBg2.x = this.bossBg2StartX + Math.sin(this.time.now * 0.0004) * 30;
            this.bossBg3.x = this.bossBg3StartX + Math.sin(this.time.now * 0.0003) * -25;
        } else {
            this.bg2.x = this.bg2StartX + Math.sin(this.time.now * 0.0005) * 25;
            this.bg3.x = this.bg3StartX + Math.sin(this.time.now * 0.0004) * -20;
        }
    }

    switchToBossBackground() {
        this.bg1.setVisible(false);
        this.bg2.setVisible(false);
        this.bg3.setVisible(false);
        this.bg4.setVisible(false);

        this.bossBg1.setVisible(true);
        this.bossBg2.setVisible(true);
        this.bossBg3.setVisible(true);
    }

    playRadioMessage(text, voiceKey) {
        this.dialogueText.setText(text);

        if (this.bellPortrait) this.bellPortrait.setVisible(true);
        if (this.valPortrait) this.valPortrait.setVisible(false);

        if (this.currentRadioSound && this.currentRadioSound.isPlaying) {
            this.currentRadioSound.stop();
        }

        if (!this.cache.audio.exists(voiceKey)) {
            console.warn("Missing radio audio:", voiceKey);
            return;
        }

        this.currentRadioSound = this.sound.add(voiceKey, { volume: 0.9 });
        this.currentRadioSound.play();

        this.currentRadioSound.once("complete", () => {
            if (this.bellPortrait) this.bellPortrait.setVisible(false);
        });
    }

    startIntroCutscene() {
        if (this.introStarted) return;

        this.introStarted = true;
        this.cutsceneActive = true;

        this.physics.pause();

        if (!this.cutsceneMusic.isPlaying) {
            this.cutsceneMusic.play();
        }

        this.playRadioMessage(
            "RADIO: we are picking up the enemy leader's signal, something is wrong...",
            "voiceline5"
        );

        this.time.delayedCall(5000, () => {
            this.playRadioMessage(
                "RADIO: we have intel that the enemy leader is personally leading the attack.",
                "voiceline6"
            );
        });

        this.time.delayedCall(10000, () => {
            this.endIntroCutscene();
        });
    }

    endIntroCutscene() {
        this.cutsceneActive = false;

        this.cutsceneMusic.stop();

        if (!this.bgMusic.isPlaying) {
            this.bgMusic.play();
        }

        this.physics.resume();

        this.playRadioMessage(
            "RADIO: enemy squadron approching... stay sharp!!",
            "voiceline3"
        );

        this.spawnEnemies();

        this.enemyShootTimer = this.time.addEvent({
            delay: 1400,
            callback: this.enemyShoot,
            callbackScope: this,
            loop: true
        });

        this.healthSpawnTimer = this.time.addEvent({
            delay: 2500,
            callback: this.spawnRandomHealthPickup,
            callbackScope: this,
            loop: true
        });
    }

    startPreBossCutscene() {
        this.preBossCutsceneStarted = true;
        this.cutsceneActive = true;

        this.physics.pause();
        this.bgMusic.stop();

        if (!this.cutsceneMusic.isPlaying) {
            this.cutsceneMusic.play();
        }

        const { width, height } = this.scale;

        this.preBossSlideImage = this.add.image(width / 2, height / 2, "preBossSlide1")
            .setOrigin(0.5)
            .setDepth(1200);

        this.fitInsideScreen(this.preBossSlideImage);

        const preBossLines = [
            {
                slide: "preBossSlide1",
                voice: "enemyline1",
                text: "RADIO: hello bell...",
                speaker: "val",
                pauseAfter: 700
            },
            {
                slide: "preBossSlide2",
                voice: "BellatoVal",
                text: "RADIO: Val??, I thought you were dead, I thought they killed you!!",
                speaker: "bell",
                pauseAfter: 900
            },
            {
                slide: "preBossSlide3",
                voice: "enemyline2",
                text: "RADIO: I faked my death bell...",
                speaker: "val",
                pauseAfter: 700
            },
            {
                slide: "preBossSlide4",
                voice: "BellatoVal2",
                text: "RADIO: Val, why would you do such a thing??, we were planning on getting married for christ sake!!",
                speaker: "bell",
                pauseAfter: 1000
            },
            {
                slide: "preBossSlide5",
                voice: "enemyline3",
                text: "RADIO: the enemy had a better 401K",
                speaker: "val",
                pauseAfter: 1200
            }
        ];

        let index = 0;

        const playNext = () => {
            if (index >= preBossLines.length) {
                this.valPortrait.setVisible(false);
                this.bellPortrait.setVisible(false);

                if (this.preBossSlideImage) {
                    this.preBossSlideImage.destroy();
                }

                this.endPreBossCutscene();
                return;
            }

            const line = preBossLines[index];

            this.preBossSlideImage.setTexture(line.slide);
            this.fitInsideScreen(this.preBossSlideImage);

            this.dialogueText.setText(line.text);

            if (line.speaker === "val") {
                this.valPortrait.setVisible(true);
                this.bellPortrait.setVisible(false);
            } else {
                this.valPortrait.setVisible(false);
                this.bellPortrait.setVisible(true);
            }

            if (this.currentRadioSound && this.currentRadioSound.isPlaying) {
                this.currentRadioSound.stop();
            }

            if (!this.cache.audio.exists(line.voice)) {
                console.warn("Missing audio from cache:", line.voice);

                this.time.delayedCall(2500, () => {
                    index++;
                    playNext();
                });

                return;
            }

            this.currentRadioSound = this.sound.add(line.voice, { volume: 0.9 });
            this.currentRadioSound.play();

            this.currentRadioSound.once("complete", () => {
                this.time.delayedCall(line.pauseAfter, () => {
                    index++;
                    playNext();
                });
            });
        };

        playNext();
    }

    endPreBossCutscene() {
        this.cutsceneActive = false;
        this.cutsceneMusic.stop();

        this.startBossBattle();
        this.physics.resume();
    }

    shootPlayerBullet() {
        let bullet = this.playerBullets.create(this.player.x, this.player.y - 30, "playerBullet");
        bullet.setScale(2);
        bullet.setVelocityY(-450);
        this.bulletSound.play({ rate: Phaser.Math.FloatBetween(0.95, 1.1) });
    }

    enemyShoot() {
        if (this.gameIsOver || this.cutsceneActive) return;

        let didShoot = false;

        this.enemies.children.each((enemy) => {
            if (enemy.active) {
                let bullet = this.enemyBullets.create(enemy.x, enemy.y + 25, "enemyBullet");
                bullet.setScale(2);
                bullet.setVelocityY(this.bossBattleStarted ? 240 : 180);
                didShoot = true;
            }
        });

        if (didShoot) {
            this.bulletSound.play({
                volume: 0.25,
                rate: Phaser.Math.FloatBetween(0.8, 1.0)
            });
        }
    }

    spawnEnemies() {
        let count = 4 + this.wave;

        for (let i = 0; i < count; i++) {
            let x = 120 + i * 90;
            let y = 100 + Phaser.Math.Between(0, 80);

            let enemy = this.enemies.create(x, y, "enemyShip");
            enemy.setScale(2.5);
            enemy.setVelocityX(Phaser.Math.Between(-60, 60));
            enemy.setBounce(1, 0);
            enemy.setCollideWorldBounds(true);
        }
    }

    startBossBattle() {
        this.bossBattleStarted = true;
        this.waveText.setText("BOSS");

        this.switchToBossBackground();

        this.cutsceneMusic.stop();
        this.bgMusic.stop();

        if (!this.bossMusic.isPlaying) this.bossMusic.play();

        this.boss = this.enemies.create(400, 100, "bossShip");
        this.boss.setScale(4);
        this.boss.health = 40;
        this.boss.maxHealth = 40;
        this.boss.setVelocityX(150);
        this.boss.setBounce(1, 0);
        this.boss.setCollideWorldBounds(true);

        this.updateBossHealthText();

        this.bossSpawnTimer = this.time.addEvent({
            delay: 3000,
            callback: this.spawnBossObstacle,
            callbackScope: this,
            loop: true
        });
    }

    spawnBossObstacle() {
        if (!this.bossBattleStarted || this.gameIsOver || !this.boss || !this.boss.active) return;

        let obstacle = this.enemies.create(this.boss.x, this.boss.y + 40, "enemyShip");
        obstacle.setScale(2.3);
        obstacle.setVelocityY(160);
        obstacle.setVelocityX(Phaser.Math.Between(-80, 80));
        obstacle.setCollideWorldBounds(false);
    }

    updateBossHealthText() {
        if (this.boss && this.boss.active) {
            this.bossHealthText.setText("Boss HP: " + this.boss.health);
        } else {
            this.bossHealthText.setText("");
        }
    }

    bulletHitsEnemy(bullet, enemy) {
        bullet.destroy();

        if (enemy.health) {
            enemy.health--;
            this.updateBossHealthText();

            if (enemy.health <= 0) {
                this.maybeDropHealth(enemy.x, enemy.y);
                enemy.destroy();

                if (enemy === this.boss) {
                    this.bossDefeated();
                } else {
                    this.score += 500;
                }
            }
        } else {
            this.maybeDropHealth(enemy.x, enemy.y);
            enemy.destroy();
            this.score += 100;
        }

        this.scoreText.setText("Score: " + this.score);
    }

    bossDefeated() {
        this.score += 1000;
        this.scoreText.setText("Score: " + this.score);

        this.bossMusic.stop();

        if (this.bossSpawnTimer) {
            this.bossSpawnTimer.remove(false);
        }

        this.defeatSound.play();
        this.bossHealthText.setText("");

        this.time.delayedCall(1200, () => {
            this.showWinScreen();
        });
    }

    showWinScreen() {
        this.gameIsOver = true;
        this.physics.pause();

        this.bgMusic.stop();
        this.bossMusic.stop();
        this.cutsceneMusic.stop();

        const { width, height } = this.scale;

        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.78).setDepth(4000);

        this.add.text(width / 2, height / 2 - 110, "YOU WIN", {
            fontSize: "70px",
            fill: "#66ffcc"
        }).setOrigin(0.5).setDepth(4001);

        this.add.text(width / 2, height / 2 - 35, "Final Score: " + this.score, {
            fontSize: "30px",
            fill: "#ffffff"
        }).setOrigin(0.5).setDepth(4001);

        this.add.text(width / 2, height / 2 + 10, "The truth survived the battle.", {
            fontSize: "24px",
            fill: "#ffffff"
        }).setOrigin(0.5).setDepth(4001);

        let playAgainButton = this.add.rectangle(width / 2, height / 2 + 105, 260, 70, 0x2244aa)
            .setInteractive()
            .setDepth(4001);

        this.add.text(width / 2, height / 2 + 105, "Play Again?", {
            fontSize: "30px",
            fill: "#ffffff"
        }).setOrigin(0.5).setDepth(4002);

        playAgainButton.on("pointerover", () => {
            playAgainButton.setFillStyle(0x4466ff);
        });

        playAgainButton.on("pointerout", () => {
            playAgainButton.setFillStyle(0x2244aa);
        });

        playAgainButton.on("pointerdown", () => {
            this.sound.stopAll();
            this.scene.restart();
        });
    }

    maybeDropHealth(x, y) {
        let dropChance = 60 + this.wave * 5;
        dropChance = Math.min(dropChance, 90);

        if (Phaser.Math.Between(1, 100) <= dropChance) {
            let pickup = this.healthPickups.create(x, y, "healthPickup");
            pickup.setScale(2);
            pickup.setVelocityY(100);
        }
    }

    spawnRandomHealthPickup() {
        if (this.gameIsOver || this.cutsceneActive) return;
        if (this.healthPickups.countActive(true) >= 5) return;

        let spawnChance = 60 + this.wave * 5;
        spawnChance = Math.min(spawnChance, 95);

        if (Phaser.Math.Between(1, 100) > spawnChance) return;

        let x = Phaser.Math.Between(50, 750);
        let y = Phaser.Math.Between(40, 120);

        let pickup = this.healthPickups.create(x, y, "healthPickup");
        pickup.setScale(2);
        pickup.setVelocityY(90);
        pickup.setVelocityX(Phaser.Math.Between(-40, 40));
    }

    collectHealthPickup(player, pickup) {
        pickup.destroy();
        this.lives++;
        this.livesText.setText("Lives: " + this.lives);

        this.healthPickupSound.play({
            volume: 0.6,
            rate: Phaser.Math.FloatBetween(0.95, 1.1)
        });
    }

    enemyBulletHitsPlayer(player, bullet) {
        bullet.destroy();
        this.loseLife();
    }

    enemyHitsPlayer(player, enemy) {
        if (enemy === this.boss) {
            this.loseLife();
            this.boss.health -= 2;
            this.updateBossHealthText();

            if (this.boss.health <= 0) {
                this.boss.destroy();
                this.bossDefeated();
            }

            return;
        }

        enemy.destroy();
        this.loseLife();
    }

    loseLife() {
        if (this.gameIsOver) return;

        this.lives--;
        this.livesText.setText("Lives: " + this.lives);

        this.player.setTint(0xff0000);

        this.time.delayedCall(250, () => {
            this.player.clearTint();
        });

        if (this.lives <= 0) {
            this.showGameOver();
        }
    }

    showGameOver() {
        this.gameIsOver = true;

        this.physics.pause();

        this.cutsceneMusic.stop();
        this.bgMusic.stop();
        this.bossMusic.stop();
        this.gameOverMusic.play();

        this.dialogueText.setText("RADIO: Signal lost...");

        const { width, height } = this.scale;

        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7).setDepth(100);

        this.add.text(width / 2, height / 2 - 80, "GAME OVER", {
            fontSize: "64px",
            fill: "#ff5555"
        }).setOrigin(0.5).setDepth(101);

        this.add.text(width / 2, height / 2 - 10, "Final Score: " + this.score, {
            fontSize: "28px",
            fill: "#ffffff"
        }).setOrigin(0.5).setDepth(101);

        let playAgainButton = this.add.rectangle(width / 2, height / 2 + 70, 260, 70, 0x2244aa)
            .setInteractive()
            .setDepth(101);

        this.add.text(width / 2, height / 2 + 70, "Play Again?", {
            fontSize: "30px",
            fill: "#ffffff"
        }).setOrigin(0.5).setDepth(102);

        playAgainButton.on("pointerover", () => {
            playAgainButton.setFillStyle(0x4466ff);
        });

        playAgainButton.on("pointerout", () => {
            playAgainButton.setFillStyle(0x2244aa);
        });

        playAgainButton.on("pointerdown", () => {
            this.sound.stopAll();
            this.scene.restart();
        });
    }

    cleanupObjects() {
        this.playerBullets.children.each((b) => {
            if (b.active && b.y < -20) b.destroy();
        });

        this.enemyBullets.children.each((b) => {
            if (b.active && b.y > this.scale.height + 20) b.destroy();
        });

        this.healthPickups.children.each((p) => {
            if (p.active && p.y > this.scale.height + 20) p.destroy();
        });

        this.enemies.children.each((enemy) => {
            if (enemy.active && enemy.y > this.scale.height + 50) enemy.destroy();
        });
    }
}