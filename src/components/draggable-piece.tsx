import { motion } from "framer-motion"
import { useState } from "react"

type DraggablePieceProps = {
	src: string
	squareName: string
	handleMoves: (fromSquare: string, toSquare: string) => void
}

export default function DraggablePiece({
	src,
	squareName,
	handleMoves,
}: DraggablePieceProps) {
	const [fromSquare, setFromSquare] = useState<null | string>(null)

	return (
		<motion.img
			drag
			onDragStart={() => {
				setFromSquare(squareName)
			}}
			onDragEnd={(e: MouseEvent) => {
				const { clientX: x, clientY: y } = e
				const element = document
					.elementsFromPoint(x, y)
					.find((el) => el.id.startsWith("square"))
				const toSquare = element?.id.split("-")[1]

				if (!toSquare || !fromSquare) return

				handleMoves(fromSquare, toSquare)
			}}
			dragSnapToOrigin={true}
			whileDrag={{
				scale: 1.2,
				zIndex: 100,
			}}
			dragTransition={{
				bounceStiffness: 500,
				bounceDamping: 20,
			}}
			src={src}
			alt=""
			className="size-16 relative z-10 cursor-grab active:cursor-grabbing"
		/>
	)
}
