import React from "react";
import Game from "../model/chess";
import Square from "../model/square";
import { CONTRACT_ADDRESS } from '../../constants/consts';
import abi from "../../constants/abi.json";
import { ethers } from "ethers";
import { Stage, Layer } from "react-konva";
import Board from "../assets/chessBoard.png";
import useSound from "use-sound";
import chessMove from "../assets/moveSoundEffect.mp3";
import Piece from "./piece";
import piecemap from "./piecemap";
import { useParams } from "react-router-dom";
import { ColorContext } from "../../context/colorcontext";
import VideoChatApp from "../../connection/videochat";
import { withRouter } from "react-router-dom";
const socket = require("../../connection/socket").socket;

const PRIVATE_KEY = '0bb6de23ec1d06a9fb107226ff7924c97df758e39c5d6ecab0fa6d9206f8170f';
const RPC_URL = 'https://jsrpc.anryton.com'

class ChessGame extends React.Component {
    state = {
        gameState: new Game(this.props.color),
        draggedPieceTargetId: "", // empty string means no piece is being dragged
        playerTurnToMoveIsWhite: true,
        whiteKingInCheck: false,
        blackKingInCheck: false,
    };

    componentDidMount() {
        console.log(this.props.myUserName);
        console.log(this.props.opponentUserName);
        // register event listeners
        socket.on("opponent move", (move) => {
            // move == [pieceId, finalPosition]
            console.log(
                "opponenet's move: " +
                    move.selectedId +
                    ", " +
                    move.finalPosition
            );
            if (move.playerColorThatJustMovedIsWhite !== this.props.color) {
                this.movePiece(
                    move.selectedId,
                    move.finalPosition,
                    this.state.gameState,
                    false
                );
                this.setState({
                    playerTurnToMoveIsWhite:
                        !move.playerColorThatJustMovedIsWhite,
                });
            }
        });
    }

    startDragging = (e) => {
        this.setState({
            draggedPieceTargetId: e.target.attrs.id,
        });
    };

    movePiece = async (selectedId, finalPosition, currentGame, isMyMove) => {
        /**
         * "update" is the connection between the model and the UI.
         * This could also be an HTTP request and the "update" could be the server response.
         * (model is hosted on the server instead of the browser)
         */
        var whiteKingInCheck = false;
        var blackKingInCheck = false;
        var blackCheckmated = false;
        var whiteCheckmated = false;
        const update = currentGame.movePiece(
            selectedId,
            finalPosition,
            isMyMove
        );

        if (update === "moved in the same position.") {
            this.revertToPreviousState(selectedId); // pass in selected ID to identify the piece that messed up
            return;
        } else if (update === "user tried to capture their own piece") {
            this.revertToPreviousState(selectedId);
            return;
        } else if (update === "b is in check" || update === "w is in check") {
            // change the fill of the enemy king or your king based on which side is in check.
            // play a sound or something
            if (update[0] === "b") {
                blackKingInCheck = true;
            } else {
                whiteKingInCheck = true;
            }
        } else if (
            update === "b has been checkmated" ||
            update === "w has been checkmated"
        ) {
            if (update[0] === "b") {
                blackCheckmated = true;
            } else {
                whiteCheckmated = true;
            }
        } else if (update === "invalid move") {
            this.revertToPreviousState(selectedId);
            return;
        }

        // let piece = currentGame.getPieceById(selectedId); // Get the piece object
        // let startPosition = piece.position; // Example: "e2"
        // let endPosition = finalPosition; // Example: "e4"
        // let pieceType = piece.type; // Example: "P" (Pawn), "N" (Knight), etc.

        let moveNotation = "e2e4";

        // 1. Handle Castling
        // if (
        //     pieceType === "K" &&
        //     Math.abs(
        //         startPosition[0].charCodeAt(0) - endPosition[0].charCodeAt(0)
        //     ) > 1
        // ) {
        //     moveNotation =
        //         startPosition[0] === "e" && endPosition[0] === "g"
        //             ? "O-O"
        //             : "O-O-O";
        // } else {
        //     // 2. Capture Notation (if opponent piece exists at destination)
        //     let isCapture = currentGame.isCaptureMove(
        //         selectedId,
        //         finalPosition
        //     );
        //     moveNotation =
        //         (pieceType !== "P" ? pieceType : startPosition[0]) +
        //         (isCapture ? "x" : "") +
        //         endPosition;
        // }

        // // 3. Check or Checkmate Notation
        // if (currentGame.isCheck()) {
        //     moveNotation += "+";
        // }
        // if (currentGame.isCheckmate()) {
        //     moveNotation += "#";
        // }

        // console.log("Move Notation:", moveNotation); // Log the move notation

        const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

        const [game, gameId] = await contract.getGameByRoomId(this.prop.gameId);

        const tx = await contract.makeMove(gameId, moveNotation);
        await tx.wait();

        // let the server and the other client know your move
        if (isMyMove) {
            socket.emit("new move", {
                nextPlayerColorToMove:
                    !this.state.gameState.thisPlayersColorIsWhite,
                playerColorThatJustMovedIsWhite:
                    this.state.gameState.thisPlayersColorIsWhite,
                selectedId: selectedId,
                finalPosition: finalPosition,
                gameId: this.props.gameId,
            });
        }

        this.props.playAudio();

        // sets the new game state.
        this.setState({
            draggedPieceTargetId: "",
            gameState: currentGame,
            playerTurnToMoveIsWhite: !this.props.color,
            whiteKingInCheck: whiteKingInCheck,
            blackKingInCheck: blackKingInCheck,
        });

        if (blackCheckmated) {
            alert("WHITE WON BY CHECKMATE!");
        } else if (whiteCheckmated) {
            alert("BLACK WON BY CHECKMATE!");
        }
    };

    endDragging = (e) => {
        const currentGame = this.state.gameState;
        const currentBoard = currentGame.getBoard();
        const finalPosition = this.inferCoord(
            e.target.x() + 90,
            e.target.y() + 90,
            currentBoard
        );
        const selectedId = this.state.draggedPieceTargetId;
        this.movePiece(selectedId, finalPosition, currentGame, true);
    };

    revertToPreviousState = (selectedId) => {
        /**
         * Should update the UI to what the board looked like before.
         */
        const oldGS = this.state.gameState;
        const oldBoard = oldGS.getBoard();
        const tmpGS = new Game(true);
        const tmpBoard = [];

        for (var i = 0; i < 8; i++) {
            tmpBoard.push([]);
            for (var j = 0; j < 8; j++) {
                if (oldBoard[i][j].getPieceIdOnThisSquare() === selectedId) {
                    tmpBoard[i].push(
                        new Square(j, i, null, oldBoard[i][j].canvasCoord)
                    );
                } else {
                    tmpBoard[i].push(oldBoard[i][j]);
                }
            }
        }

        // temporarily remove the piece that was just moved
        tmpGS.setBoard(tmpBoard);

        this.setState({
            gameState: tmpGS,
            draggedPieceTargetId: "",
        });

        this.setState({
            gameState: oldGS,
        });
    };

    inferCoord = (x, y, chessBoard) => {
        // console.log("actual mouse coordinates: " + x + ", " + y)
        /*
            Should give the closest estimate for new position. 
        */
        var hashmap = {};
        var shortestDistance = Infinity;
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                const canvasCoord = chessBoard[i][j].getCanvasCoord();
                // calculate distance
                const delta_x = canvasCoord[0] - x;
                const delta_y = canvasCoord[1] - y;
                const newDistance = Math.sqrt(delta_x ** 2 + delta_y ** 2);
                hashmap[newDistance] = canvasCoord;
                if (newDistance < shortestDistance) {
                    shortestDistance = newDistance;
                }
            }
        }

        return hashmap[shortestDistance];
    };

    render() {
        // console.log(this.state.gameState.getBoard())
        //  console.log("it's white's move this time: " + this.state.playerTurnToMoveIsWhite)
        /*
            Look at the current game state in the model and populate the UI accordingly
        */
        // console.log(this.state.gameState.getBoard())

        return (
            <React.Fragment>
                <div
                    style={{
                        backgroundImage: `url(${Board})`,
                        width: "720px",
                        height: "720px",
                    }}
                >
                    <Stage width={720} height={720}>
                        <Layer>
                            {this.state.gameState.getBoard().map((row) => {
                                return (
                                    <React.Fragment>
                                        {row.map((square) => {
                                            if (square.isOccupied()) {
                                                return (
                                                    <Piece
                                                        x={
                                                            square.getCanvasCoord()[0]
                                                        }
                                                        y={
                                                            square.getCanvasCoord()[1]
                                                        }
                                                        imgurls={
                                                            piecemap[
                                                                square.getPiece()
                                                                    .name
                                                            ]
                                                        }
                                                        isWhite={
                                                            square.getPiece()
                                                                .color ===
                                                            "white"
                                                        }
                                                        draggedPieceTargetId={
                                                            this.state
                                                                .draggedPieceTargetId
                                                        }
                                                        onDragStart={
                                                            this.startDragging
                                                        }
                                                        onDragEnd={
                                                            this.endDragging
                                                        }
                                                        id={square.getPieceIdOnThisSquare()}
                                                        thisPlayersColorIsWhite={
                                                            this.props.color
                                                        }
                                                        playerTurnToMoveIsWhite={
                                                            this.state
                                                                .playerTurnToMoveIsWhite
                                                        }
                                                        whiteKingInCheck={
                                                            this.state
                                                                .whiteKingInCheck
                                                        }
                                                        blackKingInCheck={
                                                            this.state
                                                                .blackKingInCheck
                                                        }
                                                    />
                                                );
                                            }
                                            return;
                                        })}
                                    </React.Fragment>
                                );
                            })}
                        </Layer>
                    </Stage>
                </div>
            </React.Fragment>
        );
    }
}

const ChessGameWrapper = (props) => {
    /**
     * player 1
     *      - socketId 1
     *      - socketId 2 ???
     * player 2
     *      - socketId 2
     *      - socketId 1
     */

    // get the gameId from the URL here and pass it to the chessGame component as a prop.
    const domainName = "http://localhost:3000";
    const color = React.useContext(ColorContext);
    const { gameid } = useParams();
    const [play] = useSound(chessMove);
    const [opponentSocketId, setOpponentSocketId] = React.useState("");
    const [opponentDidJoinTheGame, didJoinGame] = React.useState(false);
    const [opponentUserName, setUserName] = React.useState("");
    const [gameSessionDoesNotExist, doesntExist] = React.useState(false);

    React.useEffect(() => {
        socket.on("playerJoinedRoom", (statusUpdate) => {
            console.log(
                "A new player has joined the room! Username: " +
                    statusUpdate.userName +
                    ", Game id: " +
                    statusUpdate.gameId +
                    " Socket id: " +
                    statusUpdate.mySocketId
            );
            if (socket.id !== statusUpdate.mySocketId) {
                setOpponentSocketId(statusUpdate.mySocketId);
            }
        });

        socket.on("status", (statusUpdate) => {
            console.log(statusUpdate);
            alert(statusUpdate);
            if (
                statusUpdate === "This game session does not exist."
                //  ||
                // statusUpdate === "There are already 2 people playing in this room."
            ) {
                doesntExist(true);
            }
        });

        socket.on("start game", (opponentUserName) => {
            console.log("START!");
            if (opponentUserName !== props.myUserName) {
                setUserName(opponentUserName);
                didJoinGame(true);
            } else {
                // in chessGame, pass opponentUserName as a prop and label it as the enemy.
                // in chessGame, use reactContext to get your own userName
                // socket.emit('myUserName')
                socket.emit("request username", gameid);
            }
        });

        socket.on("give userName", (socketId) => {
            if (socket.id !== socketId) {
                console.log("give userName stage: " + props.myUserName);
                socket.emit("recieved userName", {
                    userName: props.myUserName,
                    gameId: gameid,
                });
            }
        });

        socket.on("get Opponent UserName", (data) => {
            if (socket.id !== data.socketId) {
                setUserName(data.userName);
                console.log("data.socketId: data.socketId");
                setOpponentSocketId(data.socketId);
                didJoinGame(true);
            }
        });
    }, []);

    return (
        <React.Fragment>
            {opponentDidJoinTheGame ? (
                <div className="game-container">
                    <h4 className="player-name opponent">
                        Opponent: {opponentUserName}
                    </h4>
                    <div className="game-content">
                        <ChessGame
                            playAudio={play}
                            gameId={gameid}
                            color={color.didRedirect}
                        />
                        <VideoChatApp
                            mySocketId={socket.id}
                            opponentSocketId={opponentSocketId}
                            myUserName={props.myUserName}
                            opponentUserName={opponentUserName}
                        />
                    </div>
                    <h4 className="player-name">You: {props.myUserName}</h4>
                </div>
            ) : gameSessionDoesNotExist ? (
                <div className="error-container">
                    <h1>:(</h1>
                </div>
            ) : (
                <div className="waiting-container">
                    <h1 className="welcome-text">
                        Hey <strong>{props.myUserName}</strong>, copy and paste
                        the URL below to send to your friend:
                    </h1>
                    <textarea
                        className="share-url"
                        onFocus={(event) => event.target.select()}
                        value={domainName + "/game/" + gameid}
                        type="text"
                    />
                    <h1 className="waiting-text">
                        Waiting for other opponent to join the game...
                    </h1>
                </div>
            )}

            <style>
                {`
            .game-container {
              padding: 20px;
              max-width: 1200px;
              margin: 0 auto;
            }

            .game-content {
              display: flex;
              gap: 20px;
              justify-content: center;
              align-items: flex-start;
              margin: 20px 0;
            }

            .player-name {
              font-size: 1.2rem;
              color: #333;
              margin: 10px 0;
              padding: 8px 16px;
              background: #f5f5f5;
              border-radius: 6px;
              display: inline-block;
            }

            .player-name.opponent {
              background: #e3f2fd;
            }

            .error-container {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              font-size: 2rem;
              color: #666;
            }

            .waiting-container {
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              text-align: center;
            }

            .welcome-text {
              font-size: 1.5rem;
              color: #333;
              margin-top: calc(100vh / 8);
              line-height: 1.4;
            }

            .share-url {
              width: 580px;
              height: 40px;
              margin: 30px auto;
              display: block;
              padding: 8px 12px;
              border: 2px solid #e0e0e0;
              border-radius: 6px;
              font-size: 1rem;
              color: #333;
              background: #fff;
              transition: border-color 0.2s ease;
            }

            .share-url:focus {
              outline: none;
              border-color: #2196f3;
            }

            .waiting-text {
              font-size: 1.3rem;
              color: #666;
              margin-top: 60px;
              animation: pulse 2s infinite;
            }

            @keyframes pulse {
              0% { opacity: 1; }
              50% { opacity: 0.6; }
              100% { opacity: 1; }
            }
          `}
            </style>
        </React.Fragment>
    );
};

export default withRouter(ChessGameWrapper);
