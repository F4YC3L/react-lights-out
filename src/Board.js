import React, {Component} from "react";
import Cell from "./Cell";
import './Board.css';


/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/
// Array.from({length: this.props.numBoxes}).map(c => this.getRandColor())


class Board extends Component {  
  static defaultProps = {
    nrows: 5,
    ncols: 5,
    chanceLightStartsOn: 0.1
  }

  constructor(props) {
    super(props);
    this.state = {
      hasWon: false,
      board: this.createBoard()
    }
    this.createBoard = this.createBoard.bind(this)
    this.flipCellsAround = this.flipCellsAround.bind(this)
  }
  // return randomly true or false
  randLit() {
    if(Math.random() < this.props.chanceLightStartsOn) return true;
    return false;
  }
  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */

  createBoard() {
    let board = [];
    //create array-of-arrays of true/false values
    board = Array.from({length:this.props.nrows})
                 .map(r => Array.from({length:this.props.ncols})
                 .map( c => this.randLit()))
    return board
  }

  /** handle changing a cell: update board & determine if winner */

  flipCellsAround(coord) {
    let {ncols, nrows} = this.props;
    let board = this.state.board;
    let [y, x] = coord.split("-").map(Number);

    function flipCell(y, x) {
      // if this coord is actually on board, flip it
      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[y][x] = !board[y][x];
      }
    }

    //flip this cell and the cells around it
    flipCell(y, x);
    flipCell(y, x - 1);
    flipCell(y, x + 1);
    flipCell(y - 1, x);
    flipCell(y + 1, x);

    // win when every cell is turned off
    //determine is the game has been won
    let hasWon = board.every(row => row.every(cell => !cell));
    this.setState({ board, hasWon});
  }

  /** Render game board or winning message. */

  render() {
    if (this.state.hasWon) {
      return <div>You Win!</div>;
    }

    let table = this.state.board.map((r, y) => 
      <tr key={y}>
      {r.map( (c, x) => <Cell isLit={c} key={`${y}-${x}`} flipCellsAround={() => this.flipCellsAround(`${y}-${x}`)}/>)}
      </tr>)

    return (
      <tbody className="Board">
        {table}
      </tbody>
      )
  }
}

export default Board;

