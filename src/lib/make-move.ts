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
	setHighlightedSquares: (highlightedSquares: (string | boolean)[]) => void
}

export function makeMove({
	fromSquare,
	toSquare,
	FEN,
	setFEN,
	setHighlightedSquares,
}: MakeMoveProps) {
	const [position, turn, castlingRights, enPassentSquare, halfMoveClock, fullMoveNumber] =
		FEN.split(" ")
	const board = convertFENToBoard(position)

	const [startX, startY] = squareNameToCoordinates(fromSquare)
	const [endX, endY] = squareNameToCoordinates(toSquare)

	const startIndex = startY + startX * 8
	const endIndex = endY + endX * 8

	const piece = board[startY][startX]
	const isEnPassentMove = piece.toLowerCase() == "p" && toSquare == enPassentSquare

	board[startY][startX] = ""
	board[endY][endX] = piece
	
	if (isEnPassentMove) {
		board[endY + (turn == "w" ? 1 : -1)][endX] = ""
	}

	const isCapture = board[endY][endX] != "" || isEnPassentMove
	const newPosition = convertBoardToFEN(board)

	const nextTurn = turn == "w" ? "b" : "w"
	const newEnPassentSquare = getEnPassentSquare({
		fromSquare,
		toSquare,
	})

	let newCastlingRights = castlingRights

	if (fromSquare == "h1" && piece == "R") {
		newCastlingRights = castlingRights.replace("K", "")
	} else if (fromSquare == "a1" && piece == "R") {
		newCastlingRights = castlingRights.replace("Q", "")
	} else if (fromSquare == "h8" && piece == "r") {
		newCastlingRights = castlingRights.replace("k", "")
	} else if (fromSquare == "a8" && piece == "r") {
		newCastlingRights = castlingRights.replace("q", "")
	} else if (piece == "K") {
		newCastlingRights = castlingRights.replace(/[KQ]/g, "")
	} else if (piece == "k") {
		newCastlingRights = castlingRights.replace(/[kq]/g, "")
	}

	if (newCastlingRights == "") {
		newCastlingRights = "-"
	}

	const newHalfMoveClock =
		isCapture || piece.toLowerCase() == "p" ? 0 : +halfMoveClock + 1
	const newFullMoveNumber =
		nextTurn == "w" ? +fullMoveNumber + 1 : fullMoveNumber

	const newFEN = `${newPosition} ${nextTurn} ${newCastlingRights} ${newEnPassentSquare} ${newHalfMoveClock} ${newFullMoveNumber}`
	const highlightedSquares = new Array(64).fill(false)

	highlightedSquares[startIndex] = "#f0d137cc"
	highlightedSquares[endIndex] = "#f0d137cc"

	setFEN(newFEN)
	setHighlightedSquares(highlightedSquares)

	return newFEN
}
