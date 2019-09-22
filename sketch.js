function setup() {
    createCanvas(width, height);
    tf.setBackend('cpu');

}


initPipes()
for (let i = 0; i < playersCount; i++) {
    players.push(new Player(playerPos[0],playerPos[1]))
}



function draw() {
    background(0);
    fill(255)
    players.forEach(player => {
        if (player.dead) return
        player.draw()
        player.fall()
        pipeCollideWith(player)
    });

    pipes.forEach(pipe => {
        fill(255)
        if (pipe == pipes[0]) fill(255,0,0)
        pipe.draw()
        pipe.move()
    });
    checkScore()
    textSize(32);
    text('Gen: '+ Gen, 10, 30);
    text('score: ' + bestScore, 10, 60);
    think()
}


function think(){

    getClosestPipe()

    players.forEach(player => {
        if (player.dead) return
        player.look()
        let prediction = player.brain.predict(tf.tensor2d([player.vision])).dataSync()
        if (prediction[0] > prediction[1]) player.flap()
    });

}

function initPipes(){
    pipes = []
    pipes.push(new Pipes(400))
    pipes.push(new Pipes(700))
}

function pipeCollideWith(plyr){
        if(0 > pipes[0].xpos - plyr.xpos && 
            pipes[0].xpos - plyr.xpos < pipeWidth &&
        (plyr.ypos > pipes[0].ypos+pipes[0].spacing/2 || plyr.ypos < pipes[0].ypos-pipes[0].spacing/2)
        ) plyr.die()
        
}

function checkScore(){
    players.sort((a,b) => (a.age < b.age) ? 1 : ((b.age < a.age) ? -1 : 0))
        if(pipes[0].xpos - players[0].xpos == -50 ) bestScore++
}

function getClosestPipe(){
    pipes.sort((a,b) => a.xpos-playerPos[0] - b.xpos-playerPos[0])
}


function mousePressed(){
    players[0].flap()
}


function allDead(){
    let alive = 0
    for (let i = 0; i < players.length; i++) {
        if(!players[i].dead) alive++
    }
    if (alive == 0) newGen() 
}

function newGen(){
    Gen++
    bestScore = 0
    players.sort((a,b) => (a.age < b.age) ? 1 : ((b.age < a.age) ? -1 : 0))
    bestPlayer = players[0]
    console.log("cloning old weights")
    oldWeights = bestPlayer.brain.getWeights()

    players = []
    initPipes()
    bestPlayer.dead = false
    bestPlayer.age = 0
    bestPlayer.ypos = playerPos[1]
    players.push(bestPlayer)
    console.log("cloning old weights")

    for (let i = 1; i < playersCount/3; i++) {
        players.push(new Player(playerPos[0],playerPos[1]))
        console.log("mutating old weights")
        mutatebrain(oldWeights,players[i].brain,mutationRate)
    }

}



function mutatebrain(old_Weights,newBrain,rate){
    const weights = old_Weights;
    const mutatedWeights = []
    for (let i = 0; i < weights.length; i++) {
        let tensor = weights[i];
        let tensorShape = tensor.shape;
        let tensorValues = tensor.dataSync().slice();
        for (let j = 0; j < tensorValues.length; j++) {
            if (random(1) < rate) {
                let value = tensorValues[j];
                tensorValues[j] = value + random(-0.5,0.5)
            }
        }
        let mutatedTensor = tf.tensor(tensorValues,tensorShape)
        mutatedWeights[i] = mutatedTensor;
    }
    newBrain.setWeights(mutatedWeights)
}

