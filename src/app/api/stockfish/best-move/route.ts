import { spawn } from "child_process"

export async function POST(req: Request) {
	try {
		const data = await req.json()
		const { FEN, depth, skillLevel } = data

		const engine = spawn(process.env.STOCKFISH_PATH as string)

		let returnResponse = ""
		engine.stdin?.write(`setoption name Skill Level value ${skillLevel}\n`)
		engine.stdin?.write(`position fen ${FEN}\n`)
		engine.stdin?.write(`go depth ${depth}\n`)

		return new Promise((resolve) => {
			engine.stdout?.on("data", function (data) {
				returnResponse += data

				if (data.includes("bestmove")) {
					const allLines = returnResponse
						.replace(/\r/g, "")
						.split("\n")
						.slice(0, -1)
					const lastLine = allLines.pop()
					const bestMove = lastLine?.substring(9, 13)

					resolve(
						new Response(
							JSON.stringify({
								bestMove,
							})
						)
					)

					engine.stdout?.removeAllListeners("data")
					engine.stdin?.end()
					engine.stdout?.destroy()
					engine.kill()
				}
			})
		})
	} catch (error) {
		console.error("Error handling request:", error)
		return new Response(JSON.stringify({ error: "Internal server error." }), {
			status: 500,
		})
	}
}
