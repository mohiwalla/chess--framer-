"use client"

import {
	DndContext,
	useDraggable,
	useDroppable,
	DragEndEvent,
} from "@dnd-kit/core"
import React from "react"

interface DraggablePieceProps {
	id: string
}

const DraggablePiece: React.FC<DraggablePieceProps> = ({ id }) => {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id,
	})

	const style: React.CSSProperties = {
		transform: transform
			? `translate3d(${transform.x}px, ${transform.y}px, 0)`
			: undefined,
		width: 50,
		height: 50,
		backgroundColor: "lightblue",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	}

	return (
		<div ref={setNodeRef} style={style} {...listeners} {...attributes}>
			♘ {/* Sample chess piece */}
		</div>
	)
}

interface DroppableSquareProps {
	id: string
}

const DroppableSquare: React.FC<DroppableSquareProps> = ({ id }) => {
	const { isOver, setNodeRef } = useDroppable({
		id,
	})

	const style: React.CSSProperties = {
		width: 60,
		height: 60,
		backgroundColor: isOver ? "lightgreen" : "beige",
		border: "1px solid black",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	}

	return <div ref={setNodeRef} style={style}></div>
}

const ChessBoard: React.FC = () => {
	const handleDragEnd = (event: DragEndEvent) => {
		console.log(event)
	}

	return (
		<DndContext onDragEnd={handleDragEnd}>
			<div style={{ display: "grid", gridTemplateColumns: "repeat(8, 60px)" }}>
				{Array.from({ length: 64 }, (_, i) => (
					<DroppableSquare key={i} id={`square-${i}`} />
				))}
			</div>
			<DraggablePiece id="knight" />
		</DndContext>
	)
}

export default ChessBoard
