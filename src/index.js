import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
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
        idx += 1;
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
        squares: Array(9).fill(null),
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
    if(calculateWinner(squares) || squares[i]){ return; }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
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

    const selected = this.state.selection;
    const moves = history.map((step,move) => {
      const desc = move ?
        `Go to move #${move} at ${step.row}, ${step.col}`:
        'Go to Game Start';
      if(selected === move){
        return (
          <li key={move}>
            <button class="bold" onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      } else {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      }
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
