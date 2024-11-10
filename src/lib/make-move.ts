import {
	convertBoardToFEN,
	convertFENToBoard,
	getEnPassentSquare,
	squareNameToCoordinates,
} from "./utils"

type MakeMoveProps = {
	fromSquare: string
	toSquare: string
	FEN: string
	setFEN: (fen: string) => void
}

export function makeMove({ fromSquare, toSquare, FEN, setFEN }: MakeMoveProps) {
	const [position, turn, castlingRights, , halfMoveClock, fullMoveNumber] = FEN.split(" ")
	const board = convertFENToBoard(position)

	const [startX, startY] = squareNameToCoordinates(fromSquare)
	const [endX, endY] = squareNameToCoordinates(toSquare)

	const isCapture = board[endY][endX] !== ""

	const piece = board[startY][startX]
	board[startY][startX] = ""
	board[endY][endX] = piece

	const newPosition = convertBoardToFEN(board)

	const nextTurn = turn == "w" ? "b" : "w"
	const newEnPassentSquare = getEnPassentSquare({ fromSquare, toSquare, position })

	let newCastlingRights = castlingRights

	if (fromSquare === "h1" && piece === "R") {
		newCastlingRights = castlingRights.replace("K", "")
	} else if (fromSquare === "a1" && piece === "R") {
		newCastlingRights = castlingRights.replace("Q", "")
	} else if (fromSquare === "h8" && piece === "r") {
		newCastlingRights = castlingRights.replace("k", "")
	} else if (fromSquare === "a8" && piece === "r") {
		newCastlingRights = castlingRights.replace("q", "")
	} else if (piece === "K") {
		newCastlingRights = castlingRights.replace(/[KQ]/g, "")
	} else if (piece === "k") {
		newCastlingRights = castlingRights.replace(/[kq]/g, "")
	}

	if (newCastlingRights === "") {
		newCastlingRights = "-"
	}

	const newHalfMoveClock =
		isCapture || piece.toLowerCase() === "p" ? 0 : +halfMoveClock + 1
	const newFullMoveNumber =
		nextTurn === "w" ? +fullMoveNumber + 1 : fullMoveNumber

	const newFEN = `${newPosition} ${nextTurn} ${newCastlingRights} ${newEnPassentSquare} ${newHalfMoveClock} ${newFullMoveNumber}`

	setFEN(newFEN)
	return newFEN
}
