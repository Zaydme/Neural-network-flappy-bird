class Player {
    constructor(xstart, ystart) {
        this.xpos = xstart
        this.ypos = ystart
        this.yspeed = 1
        this.vision = []
        this.dead = false
        this.age = 0
        this.brain = tf.sequential({
            layers: [tf.layers.dense({units:10,activation: "sigmoid", inputShape: [4]}),
                    tf.layers.dense({units: 6}),
                    tf.layers.dense({units: 2})]
          });
        this.brain.compile({
            loss: "categoricalCrossentropy",
            optimizer: tf.train.adam()
        })
    }

    fall() {
        if (this.dead) return
        if (this.yspeed < 15) this.yspeed++
        this.ypos += this.yspeed
        if (this.ypos>height) this.die()
        if (this.ypos<0) this.die()
    }

    look(){
        if (this.dead) return
        this.vision[0] = this.ypos
        this.vision[1] = pipes[0].xpos - this.xpos
        this.vision[2] = pipes[0].ypos
        this.vision[3] = this.yspeed
    }

    flap() {
        if (this.dead) return
        this.yspeed = -12
    }

    die(){
        this.dead = true
        allDead()
    }

    draw() {
        if (this.dead) return
        circle(this.xpos, this.ypos, 10)
        this.age++
    }

}