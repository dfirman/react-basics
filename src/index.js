import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
    return (
      <button
        className="square"
        onClick={props.onClick}
        style={{background: props.color}}
        >
        {props.value}
      </button>
    );
}

class Board extends React.Component {

  renderSquare(i) {
    const color = this.props.squares[i][1] === true ? "coral" : "white";
    return (
      <Square
        color={color}
        value={this.props.squares[i][0]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderBoard() {
    let board = [];
    let idx = 0;
    for (let i = 0; i < 3; i++) {
      let children = [];
      for (let j = 0; j < 3; j++) {
        children.push(this.renderSquare(idx));
        idx++;
      }
      board.push(<div className="board-row">{children}</div>);
    }
    return board;
  }

  render() {
    return (
      <div>
        {this.renderBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill([null, false]),
        row: 0,
        col: 0,
      }],
      step: 0,
      xIsNext: true,
      selection: null,
    };
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.step + 1);
    const cur = history[history.length - 1];
    const squares = cur.squares.slice();
    let line = calculateWinner(squares);
    if(line || squares[i][0]){return;}

    squares[i] = [this.state.xIsNext ? 'X' : 'O', false];
    line = calculateWinner(squares);
    if(line){
      for(let j = 0;j < 3; j++){
        squares[line[j]] = [squares[line[j]][0], true];
      }
    }
    this.setState({
      history: history.concat([{
        squares: squares,
        row: Math.floor(i/3) + 1,
        col: i%3 + 1,
      }]),
      step: history.length,
      xIsNext: !this.state.xIsNext,
      selection: null,
    });
  }

  jumpTo(move){
    this.setState({
      step: move,
      xIsNext: (move % 2) === 0,
      selection: move,
    });
  }

  render() {
    const history = this.state.history;
    const cur = history[this.state.step];
    const winner = calculateWinner(cur.squares);
    let status;
    if(winner){
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const moves = history.map((step,move) => {
      const desc = move ?
        `Go to move #${move} at ${step.row}, ${step.col}`:
        'Go to Game Start';
      const selected = this.state.selection === move ? "bold" : "";
      return (
        <li key={move}>
          <button class={selected} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    })

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={cur.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


// returns the index to highlight
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a][0] && squares[a][0] === squares[b][0] && squares[a][0] === squares[c][0]) {
      return lines[i];
    }
  }
  return null;
}
