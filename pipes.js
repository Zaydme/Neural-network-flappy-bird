let pipeWidth = 100;
let maxPipePos = 150
let minPipePos = /*height*/600 - maxPipePos

class Pipes {
    constructor(xstart) {
        this.xpos = xstart
        this.ypos = Math.floor(Math.random() * (maxPipePos - minPipePos)) +minPipePos; 
        this.spacing = 150
        this.speed = 5
    }

    move() {

        if (this.yspeed < 15) this.yspeed++
        this.xpos -= this.speed
        if (this.xpos <-pipeWidth){
            this.ypos = Math.floor(Math.random() * (maxPipePos - minPipePos)) +minPipePos; 
            this.xpos = width  
        }
    }


    draw() {
        rect(this.xpos, this.ypos-this.spacing/2, pipeWidth,-this.ypos) //top
        rect(this.xpos, this.ypos+this.spacing/2, pipeWidth,height-this.ypos) //bottom

    }

}