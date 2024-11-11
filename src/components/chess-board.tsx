"use client"

import { useEffect, useState } from "react"
import isLegalMove from "@/lib/legal-moves"
import { DroppableSquare } from "./droppable-square"
import { makeMove } from "@/lib/make-move"
import { AnimatePresence } from "framer-motion"

type ChessBoardProps = {
	position?: string
}

const startPosFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
// const startPosFEN = "rnbqkbnr/ppppppp1/8/6Pp/8/8/PPPPPPPP/RNBQKBNR w KQkq h6 0 1"
const imagesBasePath = "/images/pieces/lolz"

export default function ChessBoard({
	position = startPosFEN,
}: ChessBoardProps) {
	// const [previousPositions, setPreviousPositions] = useState<string[]>([])
	const [FEN, setFEN] = useState(position)
	const [highlightedSquares, setHighlightedSquares] = useState<
		(string | boolean)[]
	>(new Array(64).fill(false))

	const ranks = FEN.split(" ")[0].split("/")

	async function handleMoves(fromSquare: string, toSquare: string) {
		if (fromSquare === toSquare) return
		if (!isLegalMove(FEN, fromSquare, toSquare)) return

		let newFEN = makeMove({
			fromSquare,
			toSquare,
			FEN,
			setFEN,
			setHighlightedSquares,
		})

		// setPreviousPositions((prev) => [...prev, newFEN])
		// await new Promise((resolve) => setTimeout(resolve, 2e3))

		const req = await fetch("/api/stockfish/best-move", {
			method: "post",
			body: JSON.stringify({
				FEN: newFEN,
				depth: 1,
				skillLevel: 1,
			}),
		})

		if (!req.ok) {
			return alert("Something went wrong on server, please try again later.")
		}

		const res = await req.json()
		const computerMove = res.bestMove as string
		// setPreviousPositions((prev) => [...prev, newFEN])

		newFEN = makeMove({
			fromSquare: computerMove.substring(0, 2),
			toSquare: computerMove.substring(2, 4),
			FEN: newFEN,
			setFEN,
			setHighlightedSquares,
		})
	}

	useEffect(() => {
		window.addEventListener("keydown", showPreviousPositions)

		function showPreviousPositions(e: KeyboardEvent) {
			if (e.key == "ArrowRight") {
				console.log("next")
			} else if (e.key == "ArrowLeft") {
				console.log("prev")
			}
		}

		return () => {
			window.removeEventListener("keydown", showPreviousPositions)
		}
	}, [])

	return (
		<AnimatePresence>
			<div className="grid grid-cols-8 grid-rows-8 w-fit mx-auto my-6 select-none">
				{ranks.map((rank, y) => {
					const pieces = rank.split("")
					let x = -1

					return pieces.map((piece) => {
						let imagePath
						switch (piece) {
							case "r":
								imagePath = "br.png"
								break
							case "n":
								imagePath = "bn.png"
								break
							case "b":
								imagePath = "bb.png"
								break
							case "q":
								imagePath = "bq.png"
								break
							case "k":
								imagePath = "bk.png"
								break
							case "p":
								imagePath = "bp.png"
								break
							case "R":
								imagePath = "wr.png"
								break
							case "N":
								imagePath = "wn.png"
								break
							case "B":
								imagePath = "wb.png"
								break
							case "Q":
								imagePath = "wq.png"
								break
							case "K":
								imagePath = "wk.png"
								break
							case "P":
								imagePath = "wp.png"
								break
							default:
								return new Array(+piece).fill(null).map(() => {
									++x

									return (
										<DroppableSquare
											key={`square-${x * 8 + y}`}
											x={x}
											y={y}
											handleMoves={handleMoves}
											imagePath={null}
											highlightedSquares={highlightedSquares}
											setHighlightedSquares={setHighlightedSquares}
										/>
									)
								})
						}

						++x
						return (
							<DroppableSquare
								x={x}
								y={y}
								handleMoves={handleMoves}
								key={`square-${x * 8 + y}`}
								imagePath={`${imagesBasePath}/${imagePath}`}
								highlightedSquares={highlightedSquares}
								setHighlightedSquares={setHighlightedSquares}
							/>
						)
					})
				})}
			</div>
		</AnimatePresence>
	)
}
