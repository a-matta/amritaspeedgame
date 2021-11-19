import React, { Component } from "react";
import Circle from "./component/Circle";
import GameOver from "./component/GameOver.js";
import { circles } from "./component/circles";

import click from "./sounds/Mario Coin Sound - Sound Effect (HD).mp3";
import gameOverSound from "./sounds/Super Mario Bros. Music - Miss _ Game Over (1).mp3";


let clickSound = new Audio(click);
let gameOver = new Audio(gameOverSound);


const getRndInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

class App extends Component {
  state = {
    score: 0,
    current: 0,
    gameOver: false,
    pace: 1500,
    rounds: 0,
    gameStart: false,
    gameStop:true,
  };

  timer = undefined;

  clickPlay = () => {
    if (clickSound.paused) {
      clickSound.play();
    } else {
      clickSound.currentTime = 0;
    }
  };

  clickHandler = (id) => {
    this.clickPlay();

    console.log("you clicked: ", id);

    if (this.state.current !== id) {
      this.stopHandler();
      return;
    }

    this.setState({
      score: this.state.score + 10,
      rounds: 0,
    });
  };

  nextCircle = () => {
    if (this.state.rounds >= 5) {
      this.stopHandler();
      return;
    }

    let nextActive;

    do {
      nextActive = getRndInteger(1, 4);
    } while (nextActive === this.state.current);

    this.setState({
      current: nextActive,
      pace: this.state.pace * 0.95,
      rounds: this.state.rounds + 1,
    });

    this.timer = setTimeout(this.nextCircle, this.state.pace);

    console.log("active circle is ", this.state.current);
    console.log("round number ", this.state.rounds);
  };

  startHandler = () => {

      this.nextCircle();
    this.setState({
      gameStart: true,
      gameStop:false,
    });
  };

  stopHandler = () => {
    clearTimeout(this.timer);
    gameOver.play();

    this.setState({
      gameOver: true,
      current: 0,
      gameStart: false,
      gameStop: true,
    });
  };

  closeHandler = () => {
    this.setState({
      gameOver: false,
      score: 0,
      pace: 1500,
      rounds: 0,
    });
  };

  render() {
    return (
        <div>
          {this.state.gameOver && (
              <GameOver score={this.state.score} close={this.closeHandler} />
          )}
          <h1>Shoot the duck</h1>
          <p>Your score: {this.state.score}</p>
          <div className="circles">
            {circles.map((c) => (
                <Circle
                    key={c.id}
                    color={c.color}
                    id={c.id}
                    click={() => this.clickHandler(c.id)}
                    active={this.state.current === c.id}
                    disabled={this.state.gameStart}
                />
            ))}
          </div>
          <div>
            <button disabled={this.state.gameStart} onClick={this.startHandler}>
              Start
            </button>
            <button onClick={this.state.gameStop}>Stop</button>
            <footer className="footer">&copy; Copyright 2021 Amrita Matta</footer>
          </div>
        </div>
    );
  }
}

export default App;
