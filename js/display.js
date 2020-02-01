class Display {
    constructor(game) {
        this.frame = 0;
        this.zoom = 4;

        this.game = game;
        this.scale = 16;
        this.shadowStep = 1 / 16;

        this.backgroundImg = document.createElement("img");
        this.backgroundImg.src = "img/background.png";

        this.titleImg = document.createElement("img");
        this.titleImg.src = "img/title.png";
        this.blockImg = document.createElement("img");
        this.blockImg.src = "img/block.png";
        this.playerImg = document.createElement("img");
        this.playerImg.src = "img/player.png";
        this.player2Img = document.createElement("img");
        this.player2Img.src = "img/player2.png";
        this.playerShadowImg = document.createElement("img");
        this.playerShadowImg.src = "img/playerShadow.png";
        this.hammerImg = document.createElement("img");
        this.hammerImg.src = "img/hammer.png";
        this.limitImg = document.createElement("img");
        this.limitImg.src = "img/limit.png";
        this.winner1Img = document.createElement("img");
        this.winner1Img.src = 'img/win1.png';
        this.winner2Img = document.createElement("img");
        this.winner2Img.src = 'img/win2.png';
        this.keyboardControls = document.createElement("img");
        this.keyboardControls.src = 'img/keyboard-controls.png';
        this.layerImg = document.createElement("img");
        this.layerImg.src = 'img/layer.png';

        this.p1headImg = document.createElement("img");
        this.p1headImg.src = 'img/p1head.png';
        this.p2headImg = document.createElement("img");
        this.p2headImg.src = 'img/p2head.png';

        this.playersHeads = [this.p1headImg, this.p2headImg];
        this.playersColors = ["#BEE3FF", "#FAB9F0"];

        this.drawPlayer = (player, playerPos) => {
            var playerFrameSpeed = 16;
            var playerFrameLength = 4;
            var yPos = 0;

            if (player.direction.x === -0.5 && player.direction.y === 0.5) {
                yPos = 0;
            } else if (player.direction.x === 0.5 && player.direction.y === -0.5) {
                yPos = 1;
            } else if (player.direction.x === -0.5 && player.direction.y === -0.5) {
                yPos = 2;
            } else if (player.direction.x === 0.5 && player.direction.y === 0.5) {
                yPos = 3;
            }

            if (player.speed.x || player.speed.y) {
                playerFrameSpeed = 12;
                if (player.direction.x === 1 && player.direction.y === 0) {
                    yPos = 6;
                } else if (player.direction.x === 0 && player.direction.y === 1) {
                    yPos = 6;
                } else if (player.direction.x === -1 && player.direction.y === 0) {
                    yPos = 5;
                } else if (player.direction.x === 0 && player.direction.y === -1) {
                    yPos = 5;
                } else if (player.direction.x === 0.5 && player.direction.y === -0.5) {
                    yPos = 7;
                } else if (player.direction.x === -0.5 && player.direction.y === 0.5) {
                    yPos = 4;
                } else if (player.direction.x === 0.5 && player.direction.y === 0.5) {
                    yPos = 6;
                } else if (player.direction.x === -0.5 && player.direction.y === -0.5) {
                    yPos = 5;
                }
            }

            var xPos = Math.floor(this.frame / playerFrameSpeed) % playerFrameLength;

            var modifier = player.hitstun ? player.hitstun % 2 : 1;

            if (modifier) {
                this.cx.drawImage(player.id === this.game.scene.player1.id ? this.playerImg : this.player2Img,
                    10 * xPos,
                    16 * yPos,
                    10,
                    16,
                    playerPos.x * this.scale + this.scale / 8,
                    playerPos.y * this.scale - this.scale / 2 + this.scale / 4,
                    10,
                    16
                );
            }

        }

        this.drawHammer = (hammer, hammerPos) => {
            this.cx.drawImage(this.hammerImg,
                this.scale * (Math.floor(this.frame / 4) % 4),
                0,
                this.scale, this.scale,
                hammerPos.x * this.scale,
                hammerPos.y * this.scale,
                this.scale, this.scale
            );
        }

        this.drawBackground = () => {
            this.cx.drawImage(this.layerImg,
                0, 0,
                512, 512,
                this.canvas.width / 2 / this.zoom - 256,
                this.canvas.height / 2 / this.zoom - 256 + 24,
                512, 512
            );
            this.cx.drawImage(this.backgroundImg,
                0,
                0,
                196,
                98,
                this.canvas.width / 2 / this.zoom - 196 / 2,
                this.canvas.height / 2 / this.zoom - 26,
                196,
                98
            );
        }

        this.drawScene = () => {
            this.cx.translate(
                this.canvas.width / 2 / this.zoom - this.scale / 2,
                this.canvas.height / 2 / this.zoom - this.scale * 2
            );

            var scene = this.game.scene;

            // for (let i = 0, k = 0; i < scene.size.x * scene.size.z + 2; i++, k = (i + 1) / 2) {
            //     for (let x = 0; x <= k; x++) {
            //         for (let y = 0; y <= k; y++) {
            //             for (let z = 0; z <= k; z++) {
            //                 if (x + y + z === k) {

            for (let z = 0; z < scene.size.z; z++) {
                for (let x = 0; x < scene.size.x; x++) {
                    for (let y = 0; y < scene.size.y; y++) {
                        if (scene.blocks.has(x + ', ' + y + ', ' + z)) {
                            var tilePos = v3toV2(new Vector3D(x, y, z));

                            this.cx.drawImage(this.blockImg,
                                0,
                                0,
                                this.scale, this.scale,
                                tilePos.x * this.scale,
                                tilePos.y * this.scale,
                                this.scale, this.scale
                            );

                            // this.cx.fillStyle = '#0f0';
                            // this.cx.fillRect(
                            //     tilePos.x * this.scale,
                            //     tilePos.y * this.scale,
                            //     this.scale, this.scale
                            // );
                        }

                        scene.players.forEach(player => {
                            if (player.collisionBox.pos.floor().equals(new Vector3D(x, y, z))) {
                                this.drawPlayer(player, v3toV2(player.collisionBox.pos));
                            }
                        });
                        //     }
                        // }
                    }
                }

                scene.players.forEach(player => {
                    if (player.hammer) {
                        this.drawHammer(player.hammer, v3toV2(player.hammer.collisionBox.pos));
                    }
                });
            }

            this.cx.globalAlpha = 0.5;
            scene.players.forEach(player => this.drawPlayer(player, v3toV2(player.collisionBox.pos)));
            this.cx.globalAlpha = 1;

            this.cx.translate(
                -this.canvas.width / 2 / this.zoom + this.scale / 2,
                -this.canvas.height / 2 / this.zoom + this.scale * 2
            );
        }

        this.drawLimit = () => {
            if (this.game.scene.players.find((p) => p.collisionBox.pos.z > 7)) {
                this.cx.drawImage(this.limitImg,
                    0,
                    0,
                    192,
                    96,
                    this.canvas.width / 2 / this.zoom - 192 / 2,
                    this.canvas.height / 2 / this.zoom - 96 / 2 - this.scale * 3.5,
                    192,
                    96
                );
            }
        }

        this.drawHUD = () => {
            var scene = this.game.scene;
            scene.players.forEach((player, i) => {
                console.log(this.scale * -4 * -i + this.canvas.width / 2 / this.zoom);
                

                this.cx.fillStyle = '#fff';
                this.cx.fillRect(
                    -this.scale * 16 * -i + this.canvas.width / 2 / this.zoom - this.scale * 8 - 1,
                    this.canvas.height / 2 / this.zoom - this.scale * 2 - 1,
                    4, this.scale * 5 + 2
                );

                this.cx.fillStyle = '#000';
                this.cx.fillRect(
                    -this.scale * 16 * -i + this.canvas.width / 2 / this.zoom - this.scale * 8,
                    this.canvas.height / 2 / this.zoom - this.scale * 2,
                    2, this.scale * 5
                );
                
                this.cx.fillStyle = this.playersColors[i];
                this.cx.fillRect(
                    -this.scale * 16 * -i + this.canvas.width / 2 / this.zoom - this.scale * 8,
                    this.canvas.height / 2 / this.zoom + this.scale * 3 - this.scale * player.collisionBox.pos.z / 2,
                    2, this.scale * player.collisionBox.pos.z / 2
                );

                this.cx.drawImage(
                    this.playersHeads[i],
                    0, 0,
                    16, 16,
                    -this.scale * 16 * -i + this.canvas.width / 2 / this.zoom - this.scale * 8 - 5,
                    this.canvas.height / 2 / this.zoom + this.scale * 3 - this.scale * player.collisionBox.pos.z / 2 - 5,
                    16, 16
                );
            });
        }

        this.update = () => {

            //skybox

            var gradient = this.cx.createLinearGradient(0, 0, 0, this.canvas.height / this.zoom);
            gradient.addColorStop(0, "#e1c58b");
            gradient.addColorStop(1, "#84dbd6");

            this.cx.fillStyle = gradient;
            this.cx.fillRect(
                0,
                0,
                this.canvas.width / this.zoom,
                this.canvas.height / this.zoom
            );

            //background
            this.drawBackground();

            //scene
            if (this.game.scene) {
                if (!this.game.scene.winner) {
                    this.drawScene();
                    this.drawLimit();
                    this.drawHUD();
                } else {
                    console.log("winner" + this.game.scene.winner.index + "Img")
                    this.cx.drawImage(this["winner" + this.game.scene.winner.index + "Img"],
                        0,
                        0,
                        256,
                        64,
                        this.canvas.width / 2 / this.zoom - 256 / 2,
                        this.canvas.height / 2 / this.zoom - 64 / 2,
                        256,
                        64
                    );
                }
            } else {
                this.cx.drawImage(this.titleImg,
                    0,
                    0,
                    256,
                    40,
                    this.canvas.width / 2 / this.zoom - 256 / 2,
                    this.canvas.height / 2 / this.zoom - 64 / 2,
                    256,
                    40
                );
                var alpha = 0.5 + 1 / (Math.floor(this.frame / 2) % 20) * 2;
                this.cx.globalAlpha = alpha;
                this.cx.drawImage(this.titleImg,
                    0,
                    40,
                    256,
                    24,
                    this.canvas.width / 2 / this.zoom - 256 / 2,
                    40 + this.canvas.height / 2 / this.zoom - 64 / 2,
                    256,
                    24
                );
                this.cx.globalAlpha = 1;

                // controls
                this.cx.drawImage(
                    this.keyboardControls,
                    0, 0,
                    160, 32,
                    8, 8,
                    160, 32
                );
            }

            this.frame++;
        }

        this.canvas = document.createElement('canvas');
        this.canvas.width = innerWidth - (innerWidth % 2);
        this.canvas.height = innerHeight - (innerHeight % 2);

        this.cx = this.canvas.getContext("2d");
        this.cx.scale(this.zoom, this.zoom);
        this.cx.imageSmoothingEnabled = false;

        document.body.appendChild(this.canvas);
        window.addEventListener('resize', () => {
            this.canvas.width = innerWidth - (innerWidth % 2);
            this.canvas.height = innerHeight - (innerHeight % 2);
            this.cx.scale(this.zoom, this.zoom);
            this.cx.imageSmoothingEnabled = false;
        });
    }
}