import {
	convertFENToBoard,
	coordinateToSquareName,
	getEnPassentSquare,
	squareNameToCoordinates,
} from "./utils"

export default function isLegalMove(
	FEN: string,
	fromSquare: string,
	toSquare: string
): boolean {
	const [
		position,
		turn,
		castlingRights,
		enPassentSquare,
		halfMoveClock,
		fullMoveNumber,
	] = FEN.split(" ")
	const board = convertFENToBoard(position)
	const [startX, startY] = squareNameToCoordinates(fromSquare)
	const [endX, endY] = squareNameToCoordinates(toSquare)

	const pieceMoved = board[startY][startX]
	const pieceOnDestination = board[endY][endX]

	// wrong person moved
	if (turn != pieceColor(pieceMoved)) {
		return false
	}

	// already a piece on destination square
	if (
		pieceOnDestination != "" &&
		pieceColor(pieceMoved) == pieceColor(pieceOnDestination)
	) {
		return false
	}

    return true
	let isLegalMove = false

	// console.log(
	// 	isLegalPawnMove({
	// 		fromSquare,
	// 		toSquare,
	// 		position,
	// 		turn,
	// 	})
	// )

	const pieceName = pieceMoved.toLowerCase()
	switch (pieceName) {
		case "p":
			isLegalMove = isLegalPawnMove({
				turn,
				fromSquare,
				toSquare,
				position,
				pieceOnDestination,
			})
			break
	}

	return isLegalMove
}

function pieceColor(pieceName: string) {
	return pieceName.charCodeAt(0) > 96 ? "b" : "w"
}

function isLegalPawnMove({
	turn,
	fromSquare,
	toSquare,
	position,
	pieceOnDestination,
}: {
	turn: string
	fromSquare: string
	toSquare: string
	position: string
	pieceOnDestination: string
}) {
	const [startX, startY] = squareNameToCoordinates(fromSquare)
	const [endX, endY] = squareNameToCoordinates(toSquare)

	const direction = startY > endY ? 1 : -1
	const squaresTravelled = Math.abs(startY - endY)
	const captureSqaures = pawnCapturePossibleOnSquares({
		turn,
		fromSquare,
		toSquare,
		position,
		pieceOnDestination,
	})

	if ((turn == "w" && direction == -1) || (turn == "b" && direction == 1)) {
		return false
	}

	if (startX == endX && pieceOnDestination == "") {
		if (squaresTravelled == 2) {
			if ((turn == "w" && startY != 6) || (turn == "b" && startY != 1)) {
				return false
			}
		} else if (squaresTravelled != 1) {
			return false
		}
	} else if (!captureSqaures.includes(toSquare)) {
		console.log(captureSqaures)
		return false
	}

	return true
}

function pawnCapturePossibleOnSquares({
	turn,
	fromSquare,
	toSquare,
	position,
	pieceOnDestination,
}: {
	turn: string
	fromSquare: string
	toSquare: string
	position: string
	pieceOnDestination: string
}) {
	const captureSqaures = []
	const [startX, startY] = squareNameToCoordinates(fromSquare)

	if (pieceOnDestination != "") {
		if (turn == "w") {
			captureSqaures.push(coordinateToSquareName(startX - 1, startY - 1))
			captureSqaures.push(coordinateToSquareName(startX + 1, startY - 1))
		} else {
			captureSqaures.push(coordinateToSquareName(startX - 1, startY + 1))
			captureSqaures.push(coordinateToSquareName(startX + 1, startY + 1))
		}
	}

	return [
		...captureSqaures,
		getEnPassentSquare({ fromSquare, toSquare, position }),
	]
}
