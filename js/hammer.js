class Hammer {
    
    constructor(pos, direction) {
        this.speed = new Vector3D(0, 0, 0.3);
        this.xSpeed = 0.1;
        // this.degrees = 90;
        this.direction = {...direction};
        this.collisionBox = new CollisionBox({...pos}, new Vector3D(0.5, 0.5, 0.5));
        this.isDestroyed = false;

        this.moveXY = (game) => {
            this.speed.x = 0;
            this.speed.y = 0;

            if (this.direction.x === -0.5 && this.direction.y === 0.5) {
                this.speed.x += this.xSpeed;
                this.speed.y += this.xSpeed;
            } else if (this.direction.x === 0.5 && this.direction.y === -0.5) {
                this.speed.x -= this.xSpeed;
                this.speed.y -= this.xSpeed;
            } else if (this.direction.x === 0.5 && this.direction.y === 0.5) {
                this.speed.x += this.xSpeed;
                this.speed.y -= this.xSpeed;
            } else if (this.direction.x === -0.5 && this.direction.y === -0.5) {
                this.speed.x -= this.xSpeed;
                this.speed.y += this.xSpeed;
            } else if (this.direction.x === 1 && this.direction.y === 0) {
                this.speed.x = 0;
                this.speed.y -= this.xSpeed;
            } else if (this.direction.x === 0 && this.direction.y === 1) {
                this.speed.x += this.xSpeed;
                this.speed.y = 0;
            } else if (this.direction.x === -1 && this.direction.y === 0) {
                this.speed.x = 0;
                this.speed.y += this.xSpeed;
            } else if (this.direction.x === 0 && this.direction.y === -1) {
                this.speed.x -= this.xSpeed;
                this.speed.y = 0;
            }

            var newCollisionBox = new CollisionBox(this.collisionBox.pos.plus(new Vector3D(this.speed.x, 0, 0)), this.collisionBox.size);
            if (!newCollisionBox.intersectingCollisionBoxes([...game.scene.blocks.values()]).length &&
                newCollisionBox.isIncludedIn(game.scene.collisionBox)) {
                this.collisionBox = newCollisionBox;
            }

            var newCollisionBox = new CollisionBox(this.collisionBox.pos.plus(new Vector3D(0, this.speed.y, 0)), this.collisionBox.size);
            if (!newCollisionBox.intersectingCollisionBoxes([...game.scene.blocks.values()]).length &&
                newCollisionBox.isIncludedIn(game.scene.collisionBox)) {
                this.collisionBox = newCollisionBox;
            }
        }

        this.moveZ = (game) => {
            this.speed.z -= game.scene.gravity.z;

            var newCollisionBox = new CollisionBox(this.collisionBox.pos.plus(new Vector3D(0, 0, this.speed.z)), this.collisionBox.size);
            if (!newCollisionBox.intersectingCollisionBoxes([...game.scene.blocks.values()]).length &&
                newCollisionBox.isIncludedIn(game.scene.collisionBox)) {
                this.collisionBox = newCollisionBox;
            } else {
                this.isDestroyed = true;
                console.log(newCollisionBox.intersectingCollisionBoxes([...game.scene.blocks.values()]));
            }

            var newCollisionBox = new CollisionBox(this.collisionBox.pos.plus(new Vector3D(0, 0, this.speed.z)), this.collisionBox.size);
            if (!newCollisionBox.intersectingCollisionBoxes([...game.scene.blocks.values()]).length &&
                newCollisionBox.isIncludedIn(game.scene.collisionBox)) {
                this.collisionBox = newCollisionBox;
            } else {
                this.isDestroyed = true;
                console.log(newCollisionBox.intersectingCollisionBoxes([...game.scene.blocks.values()]));
            }
        }

        this.update = (game, player) => {
            this.moveXY(game);
            this.moveZ(game);
            if (this.isDestroyed) {
                player.hammer = null;
            }
        }
    }
} 