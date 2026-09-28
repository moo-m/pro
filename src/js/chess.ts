import "../css/style.css";

type PositionType = {
	x: number;
	y: number;
	index: number;
	color: string | null;
	pName: string | null;
	countMoves: number;
	canSkip: boolean;
};
type CheckingMoves = {
	prevIndex: number;
	nextIndex: number;
	Pname: string;
};
type CanSkip = CheckingMoves & {
	lessThan: number;
	greaterThan: number;
};
interface App {
	container: HTMLDivElement;
	boardCan: HTMLCanvasElement;
	boardCtx: CanvasRenderingContext2D;
	picesCan: HTMLCanvasElement;
	picesCtx: CanvasRenderingContext2D;
	boundBoard: DOMRect;
	position: PositionType[];
	turn: "#fff" | "#000";

	catch: {
		x: number;
		y: number;
		index: number | null;
		color: string | null;
		pName: string | null;
		countMoves: number;
	};
	eatSkip: {
		white: boolean;
		black: boolean;
	};
	canCastle: boolean;
	kingPosition: {
		"#fff": number;
		"#000": number;
	};
	checked: boolean;
	init(): void;
	createBoard(): void;
	pices(
		x: number,
		y: number,
		i: number,
		color: string,
		name: string,
		countMoves: number
	): void;
	move(e: MouseEvent): void;
	checkMove({ prevIndex, nextIndex, Pname }: CheckingMoves): boolean;
	eatAtSkip({
		prevIndex,
		nextIndex,
		Pname,
		lessThan,
		greaterThan
	}: CanSkip): boolean | void;
	pawn({ prevIndex, nextIndex, Pname }: CheckingMoves): boolean;
	rook({ prevIndex, nextIndex, Pname }: CheckingMoves): boolean;
	bishop({ prevIndex, nextIndex, Pname }: CheckingMoves): boolean;
	knight({ prevIndex, nextIndex, Pname }: CheckingMoves): boolean;
	king({ prevIndex, nextIndex, Pname }: CheckingMoves): boolean;
	queen({ prevIndex, nextIndex, Pname }: CheckingMoves): boolean;
	drawGoals({
		prevIndex,
		Pname,
		x,
		y
	}: Omit<CheckingMoves, "nextIndex"> & {
		x: number;
		y: number;
	}): void;
	kingStream({
		prevIndex,
		Pname,
		x,
		y
	}: Omit<CheckingMoves, "nextIndex"> & {
		x: number;
		y: number;
	}): void;
	castle({ prevIndex, nextIndex, Pname }: CheckingMoves): boolean;
	checkSquare(nextIndex: number): boolean;
	checkMate(nextI: number): boolean;
}
class ChessApp implements App {
	container: HTMLDivElement;
	boardCan: HTMLCanvasElement;
	infoCan: HTMLCanvasElement;
	boardCtx: CanvasRenderingContext2D;
	infoCtx: CanvasRenderingContext2D;
	picesCan: HTMLCanvasElement;
	picesCtx: CanvasRenderingContext2D;
	boundBoard: DOMRect;
	position: {
		x: number;
		y: number;
		index: number;
		color: string | null;
		pName: string | null;
		countMoves: number;
		canSkip: boolean;
	}[];
	turn: "#fff" | "#000";
	catch: {
		x: number;
		y: number;
		index: number | null;
		color: string | null;
		pName: string | null;
		countMoves: number;
	};
	eatSkip: {
		white: boolean;
		black: boolean;
	};
	canCastle: boolean;
	kingPosition: {
		"#fff": number;
		"#000": number;
	};
	checked: boolean;
	constructor() {
		this.container = document.querySelector(
			".chess-board"
		) as HTMLDivElement;
		this.boardCan = document.getElementById("board")! as HTMLCanvasElement;
		this.infoCan = document.getElementById("info")! as HTMLCanvasElement;
		this.boardCtx = this.boardCan.getContext(
			"2d"
		) as CanvasRenderingContext2D;
		this.infoCtx = this.infoCan.getContext(
			"2d"
		) as CanvasRenderingContext2D;
		this.picesCan = document.getElementById("pices")! as HTMLCanvasElement;
		this.picesCtx = this.picesCan.getContext(
			"2d"
		) as CanvasRenderingContext2D;
		this.boardCan.width = 320;
		this.boardCan.height = 320;
		this.boundBoard = this.boardCan.getBoundingClientRect();
		this.position = [];
		this.turn = "#fff";
		this.catch = {
			x: 1000,
			y: 1000,
			index: null,
			color: null,
			pName: null,
			countMoves: 0
		};
		this.eatSkip = {
			white: false,
			black: false
		};
		this.canCastle = false;
		this.kingPosition = {
			"#fff": 60,
			"#000": 4
		};
		this.checked = false;
	}
	init(): void {
		this.boardCan.width =
			this.infoCan.width =
			this.picesCan.width =
				this.container.offsetWidth;
		this.boardCan.height =
			this.infoCan.height =
			this.picesCan.height =
				this.container.offsetHeight;
		this.boundBoard = this.boardCan.getBoundingClientRect();
		this.position = Array.from({ length: 64 }, (_, index) => ({
			x: (Math.ceil(this.boundBoard.width) / 8) * Math.floor(index % 8),
			y: (Math.ceil(this.boundBoard.height) / 8) * Math.floor(index / 8),
			index,
			color: (() => {
				if (index < 16) {
					return "#000";
				} else if (index > 47) {
					return "#fff";
				} else return null;
			})(),
			pName: (() => {
				switch (index) {
					case 0:
					case 7:
						return "r";
					case 56:
					case 63:
						return "R";
					case 1:
					case 6:
						return "n"; //n
					case 57:
					case 62:
						return "N"; //N
					case 2:
					case 5:
						return "b"; //b
					case 58:
					case 61:
						return "B"; //B
					case 4:
						return "k";
					case 60:
						return "K";
					case 3:
						return "q";
					case 59:
						return "Q";
					default:
						if (index < 16 && index > 7) return "p";
						else if (index < 56 && index > 47) return "P"; //P
						else return null;
				}
			})(),
			countMoves: 0,
			canSkip: false
		}));
		this.createBoard();
		this.position.forEach(({ x, y, index, color, pName, countMoves }) => {
			this.pices(x, y, index, color, pName, countMoves);
		});
		this.picesCan.addEventListener("click", e => this.move(e));
	}

	createBoard(): void {
		const width = Math.ceil(this.boundBoard.width) / 8;
		const height = Math.ceil(this.boundBoard.height) / 8;
		for (let i = 0; i < 64; i++) {
			this.boardCtx.fillStyle =
				(i + Math.floor(i / 8)) % 2 == 0 ? "#1C1678" : "#912BBC";
			this.boardCtx.fillRect(
				width * (i % 8),
				height * Math.floor(i / 8),
				width,
				height
			);
			this.boardCtx.fillStyle = "green";
			this.boardCtx.fillText(
				i.toString(),
				width * (i % 8),
				height * Math.floor(i / 8) + 8
			);
		}
	}
	pices(
		x: number,
		y: number,
		//@ts-ignore
		i: number,
		c: string | null,
		n: string | null,
		countMoves: number
	): void {
		if (n) {
			switch (n) {
				case "P":
					this.picesCtx.beginPath();
					this.picesCtx.fillStyle = <string>c;
					this.picesCtx.arc(x + 19, y + 8, 5, 0, Math.PI * 2);
					this.picesCtx.moveTo(x + 19, y + 12);
					this.picesCtx.lineTo(x + 8, y + 32);
					this.picesCtx.lineTo(x + 30, y + 32);
					this.picesCtx.lineTo(x + 19, y + 12);
					this.picesCtx.fill();
					this.picesCtx.beginPath();
					this.picesCtx.strokeRect(x + 8, y + 13, 23, 23);
					this.picesCtx.fillStyle = "red";
					this.picesCtx.fillRect(x + 8, y + 18, 22, 4);
					this.picesCtx.fillRect(x + 8, y + 25, 22, 4);
					this.picesCtx.fillRect(x + 8, y + 32, 22, 4);
					this.picesCtx.fill();
					break;
				case "p":
					this.picesCtx.beginPath();
					this.picesCtx.fillStyle = <string>c;
					this.picesCtx.arc(x + 19, y + 34, 5, 0, Math.PI * 2);
					this.picesCtx.moveTo(x + 8, y + 10);
					this.picesCtx.lineTo(x + 19, y + 30);
					this.picesCtx.lineTo(x + 31, y + 10);
					this.picesCtx.strokeRect(x + 8, y + 8, 23, 21);
					this.picesCtx.fill();
					this.picesCtx.fillStyle = "blue";
					this.picesCtx.fillRect(x + 8, y + 6, 22, 4);
					this.picesCtx.fillRect(x + 8, y + 13, 22, 4);
					this.picesCtx.fillRect(x + 8, y + 21, 22, 4);
					break;
				case "B":
					this.picesCtx.beginPath();
					this.picesCtx.fillStyle = <string>c;
					this.picesCtx.strokeStyle = <string>c;
					this.picesCtx.arc(x + 20, y + 10, 5, 0, Math.PI * 2);
					this.picesCtx.moveTo(x + 18, y + 15);
					this.picesCtx.lineTo(x + 13, y + 34);
					this.picesCtx.lineTo(x + 27, y + 34);
					this.picesCtx.lineTo(x + 22, y + 15);
					this.picesCtx.fill();
					this.picesCtx.beginPath();
					this.picesCtx.ellipse(
						x + 20,
						y + 22,
						8,
						3,
						Math.PI,
						0,
						Math.PI * 2
					);
					this.picesCtx.fill();
					this.picesCtx.beginPath();
					this.picesCtx.ellipse(
						x + 20,
						y + 35,
						12,
						3,
						Math.PI,
						0,
						Math.PI * 2
					);
					this.picesCtx.fill();
					break;
				case "b":
					this.picesCtx.beginPath();
					this.picesCtx.fillStyle = <string>c;
					this.picesCtx.strokeStyle = <string>c;
					this.picesCtx.arc(x + 20, y + 30, 5, 0, Math.PI * 2);
					this.picesCtx.moveTo(x + 20, y + 30);
					this.picesCtx.lineTo(x + 13, y + 8);
					this.picesCtx.lineTo(x + 28, y + 8);
					this.picesCtx.lineTo(x + 20, y + 30);
					this.picesCtx.fill();
					this.picesCtx.beginPath();
					this.picesCtx.ellipse(
						x + 20,
						y + 18,
						8,
						3,
						Math.PI,
						0,
						Math.PI * 2
					);
					this.picesCtx.fill();
					this.picesCtx.beginPath();
					this.picesCtx.ellipse(
						x + 20,
						y + 8,
						12,
						3,
						Math.PI,
						0,
						Math.PI * 2
					);
					this.picesCtx.fill();
					break;
				case "N":
					this.picesCtx.beginPath();
					this.picesCtx.fillStyle = <string>c;
					this.picesCtx.arc(x + 20, y + 10, 7, 0, Math.PI * 2);
					this.picesCtx.moveTo(x + 20, y + 17);
					this.picesCtx.lineTo(x + 8, y + 30);
					this.picesCtx.lineTo(x + 8, y + 17);
					this.picesCtx.lineTo(x + 30, y + 30);
					this.picesCtx.lineTo(x + 20, y + 17);
					this.picesCtx.ellipse(
						x + 20,
						y + 34,
						15,
						4,
						Math.PI,
						0,
						Math.PI * 2
					);
					this.picesCtx.fill();
					break;
				case "n":
					this.picesCtx.beginPath();
					this.picesCtx.fillStyle = <string>c;
					this.picesCtx.arc(x + 20, y + 30, 7, 0, Math.PI * 2);
					this.picesCtx.moveTo(x + 20, y + 30);
					this.picesCtx.lineTo(x + 10, y + 10);
					this.picesCtx.lineTo(x + 9, y + 23);
					this.picesCtx.lineTo(x + 30, y + 10);
					this.picesCtx.lineTo(x + 20, y + 23);
					this.picesCtx.fill();
					this.picesCtx.beginPath();
					this.picesCtx.ellipse(
						x + 20,
						y + 6,
						15,
						4,
						Math.PI,
						0,
						Math.PI * 2
					);
					this.picesCtx.fill();
					break;
				case "R":
					this.picesCtx.beginPath();
					this.picesCtx.fillStyle = <string>c;
					this.picesCtx.fillRect(x + 6, y + 5, 6, 8);
					this.picesCtx.fillRect(x + 16, y + 5, 6, 8);
					this.picesCtx.fillRect(x + 26, y + 5, 6, 8);
					this.picesCtx.fillRect(x + 12, y + 13, 15, 19);
					this.picesCtx.fillRect(x + 7, y + 32, 25, 4);
					break;
				case "r":
					this.picesCtx.beginPath();
					this.picesCtx.fillStyle = <string>c;
					this.picesCtx.fillRect(x + 6, y + 27, 6, 8);
					this.picesCtx.fillRect(x + 16, y + 27, 6, 8);
					this.picesCtx.fillRect(x + 26, y + 27, 6, 8);
					this.picesCtx.fillRect(x + 12, y + 9, 15, 19);
					this.picesCtx.fillRect(x + 7, y + 5, 25, 4);
					break;
				case "K":
					this.picesCtx.beginPath();
					this.picesCtx.fillStyle = <string>c;
					this.picesCtx.strokeStyle = <string>c;
					this.picesCtx.arc(x + 20, y + 10, 5, 0, Math.PI * 2);
					this.picesCtx.moveTo(x + 18, y + 15);
					this.picesCtx.lineTo(x + 13, y + 34);
					this.picesCtx.lineTo(x + 27, y + 34);
					this.picesCtx.lineTo(x + 22, y + 15);
					this.picesCtx.fill();
					this.picesCtx.beginPath();
					this.picesCtx.ellipse(
						x + 20,
						y + 35,
						12,
						3,
						Math.PI,
						0,
						Math.PI * 2
					);
					this.picesCtx.ellipse(
						x + 20,
						y + 5,
						12,
						3,
						Math.PI,
						0,
						Math.PI * 2
					);
					this.picesCtx.fillStyle = "red";
					this.picesCtx.fill();
					break;
				case "k":
					this.picesCtx.beginPath();
					this.picesCtx.fillStyle = <string>c;
					this.picesCtx.strokeStyle = <string>c;
					this.picesCtx.arc(x + 20, y + 30, 5, 0, Math.PI * 2);
					this.picesCtx.moveTo(x + 20, y + 33);
					this.picesCtx.lineTo(x + 13, y + 5);
					this.picesCtx.lineTo(x + 29, y + 5);
					this.picesCtx.lineTo(x + 20, y + 33);
					this.picesCtx.fill();
					this.picesCtx.beginPath();
					this.picesCtx.ellipse(
						x + 20,
						y + 5,
						12,
						3,
						Math.PI,
						0,
						Math.PI * 2
					);
					this.picesCtx.ellipse(
						x + 20,
						y + 35,
						12,
						3,
						Math.PI,
						0,
						Math.PI * 2
					);
					this.picesCtx.fillStyle = "blue";
					this.picesCtx.fill();
					break;
				case "Q":
					this.picesCtx.beginPath();
					this.picesCtx.fillStyle = <string>c;
					this.picesCtx.arc(x + 6, y + 10, 3, 0, Math.PI * 2);
					this.picesCtx.moveTo(x + 5, y + 13);
					this.picesCtx.lineTo(x + 5, y + 34);
					this.picesCtx.lineTo(x + 20, y + 34);
					this.picesCtx.fill();
					this.picesCtx.beginPath();
					this.picesCtx.arc(x + 20, y + 10, 3, 0, Math.PI * 2);
					this.picesCtx.moveTo(x + 6, y + 34);
					this.picesCtx.lineTo(x + 20, y + 13);
					this.picesCtx.lineTo(x + 34, y + 34);
					this.picesCtx.fill();
					this.picesCtx.beginPath();
					this.picesCtx.arc(x + 33, y + 10, 3, 0, Math.PI * 2);
					this.picesCtx.moveTo(x + 35, y + 34);
					this.picesCtx.lineTo(x + 35, y + 13);
					this.picesCtx.lineTo(x + 20, y + 34);
					this.picesCtx.fill();
					this.picesCtx.beginPath();
					this.picesCtx.ellipse(
						x + 20,
						y + 34,
						15,
						3,
						Math.PI,
						0,
						Math.PI * 2
					);
					this.picesCtx.fill();
					break;
				case "q":
					this.picesCtx.beginPath();
					this.picesCtx.fillStyle = <string>c;
					this.picesCtx.arc(x + 6, y + 29, 3, 0, Math.PI * 2);
					this.picesCtx.moveTo(x + 5, y + 27);
					this.picesCtx.lineTo(x + 5, y + 6);
					this.picesCtx.lineTo(x + 20, y + 6);
					this.picesCtx.fill();
					this.picesCtx.beginPath();
					this.picesCtx.arc(x + 20, y + 29, 3, 0, Math.PI * 2);
					this.picesCtx.moveTo(x + 6, y + 6);
					this.picesCtx.lineTo(x + 20, y + 27);
					this.picesCtx.lineTo(x + 34, y + 6);
					this.picesCtx.fill();
					this.picesCtx.beginPath();
					this.picesCtx.arc(x + 33, y + 29, 3, 0, Math.PI * 2);
					this.picesCtx.moveTo(x + 35, y + 6);
					this.picesCtx.lineTo(x + 35, y + 27);
					this.picesCtx.lineTo(x + 20, y + 6);
					this.picesCtx.fill();
					this.picesCtx.beginPath();
					this.picesCtx.ellipse(
						x + 20,
						y + 6,
						15,
						3,
						Math.PI,
						0,
						Math.PI * 2
					);
					this.picesCtx.fill();
					break;
				default:
					return;
			}
			this.picesCtx.fillStyle = "#08D9D6";
			this.picesCtx.font = `16px bolder sans-serif`;
			this.picesCtx.fillText(`${countMoves || ""}`, x + 15, y + 30, 20);
		}
	}
	move(e: MouseEvent): void {
		const x = e?.offsetX;
		const y = e?.offsetY;
		const col = Math.ceil(x / 40);
		const row = Math.ceil(y / 40);
		const index = (row - 1) * 8 + col - 1;

		/**
		 * (not catching)&&(click at empty square||not my turn)
		 */
		if (
			!this.catch.pName &&
			(!this.position[index].pName ||
				this.position[index].color !== this.turn)
		) {
			return;
		}
		/*
		 * (not catching)&&(click on fill square)&&(my turn)
		 */
		//catch
		if (
			!this.catch.pName &&
			this.position[index].pName &&
			this.position[index].color === this.turn
		) {
			//draw squares at posipol squares
			this.drawGoals({
				prevIndex: index,
				Pname: this.position[index].pName!
			});
			//fill catch
			this.catch = {
				...this.position[index]
			};
			//clear draw of prev piece
			this.picesCtx.clearRect(
				this.position[index].x,
				this.position[index].y,
				this.picesCan.width / 8,
				this.picesCan.height / 8
			);
			//clear position
			this.position[index] = {
				...this.position[index],
				pName: null,
				color: null,
				countMoves: 0
			};
			return;
		}

		/*
		 * (catching && put the piece on same team || put the piece on same index)
		 * not equale castle
		 */
		if (
			!(
				(this.catch.pName == "k" &&
					this.position[index].pName == "r") ||
				(this.catch.pName === "K" && this.position[index].pName == "R")
			)
		) {
			if (
				this.catch.color == this.position[index].color ||
				this.catch.index == this.position[index].index ||
				(this.position[index].pName &&
					/k/i.test(this.position[index].pName!))
			) {
				//clear info
				this.infoCtx.clearRect(
					0,
					0,
					this.infoCan.width,
					this.infoCan.height
				);
				//return piece to prev square
				this.pices(
					this.catch.x,
					this.catch.y,
					this.catch.index!,
					this.catch.color,
					this.catch.pName,
					this.catch.countMoves
				);
				//return the info to last position
				this.position[this.catch.index!] = {
					...this.position[this.catch.index!],
					pName: this.catch.pName,
					color: this.catch.color,
					countMoves: this.catch.countMoves
				};
				//clear catch
				this.catch = {
					x: 1000,
					y: 1000,
					index: null,
					color: null,
					pName: null,
					countMoves: 0
				};
				return;
			}
		}

		//put the piece
		//Attacking an opponent's piece or castle
		if (
			(this.position[index].color !== this.turn ||
				(this.position[index].color === this.turn &&
					/k/i.test(this.catch.pName!) &&
					/r/i.test(this.position[index].pName!))) &&
			this.checkMove({
				prevIndex: this.catch.index!,
				nextIndex: index,
				Pname: this.catch.pName!
			}) &&
			this.checkSquare(index)
		) {
			//castle
			if (this.canCastle && /r/i.test(this.position[index].pName!)) {
				const rookStep: number = this.catch.index! > index ? 3 : -2,
					kingStep: number = index > this.catch.index! ? -1 : 2;
				this.infoCtx.clearRect(
					0,
					0,
					this.infoCan.width,
					this.infoCan.height
				);
				const isCanSkip = this.position[index].canSkip;
				//can skip
				const arr: number[] = [
					24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
					39
				];
				arr.forEach(n => {
					this.position[n].canSkip = false;
				});
				this.position[index].canSkip = isCanSkip;

				//remove rook
				this.catch.countMoves++;
				this.picesCtx.clearRect(
					this.position[index].x,
					this.position[index].y,
					this.picesCan.width / 8,
					this.picesCan.height / 8
				);
				// add new position of rook
				this.position[index + rookStep] = {
					...this.position[index + rookStep],
					pName: this.position[index].pName,
					color: this.position[index].color,
					countMoves: this.position[index].countMoves
				};
				//put rook
				this.pices(
					this.position[index + rookStep].x,
					this.position[index + rookStep].y,
					index,
					this.position[index].color,
					this.position[index].pName,
					++this.position[index].countMoves
				);
				//remove position history of rook
				this.position[index] = {
					...this.position[index],
					pName: null,
					color: null,
					countMoves: 0
				};

				// add king on his position
				this.pices(
					this.position[index + kingStep].x,
					this.position[index + kingStep].y,
					this.position[index + kingStep].index,
					this.catch.color,
					this.catch.pName,
					this.catch.countMoves
				);
				//add position info to the new position of king
				this.position[index + kingStep] = {
					...this.position[index + kingStep],
					pName: this.catch.pName,
					color: this.catch.color,
					countMoves: this.catch.countMoves
				};
				//clear catch
				this.catch = {
					x: 1000,
					y: 1000,
					index: null,
					color: null,
					pName: null,
					countMoves: 0
				};

				this.kingPosition[this.turn] = index;
				this.turn = this.turn === "#fff" ? "#000" : "#fff";
				this.canCastle = false;
				return;
			}

			if (
				this.eatSkip.white &&
				/p/i.test(this.catch.pName!) &&
				Math.abs(index - this.catch.index!) !== 8
			) {
				const Pname = this.catch.pName == "P" ? "p" : "P";
				const culc3: number = Pname == "p" ? 1 : -1;
				this.catch.countMoves++;
				this.picesCtx.clearRect(
					this.position[this.catch.index! - culc3].x,
					this.position[this.catch.index! - culc3].y,
					this.picesCan.width / 8,
					this.picesCan.height / 8
				);
				this.position[this.catch.index! - culc3] = {
					...this.position[this.catch.index! - culc3],
					pName: null,
					color: null,
					countMoves: 0
				};
				this.eatSkip.white = false;
			}
			if (
				this.eatSkip.black &&
				/p/i.test(this.catch.pName!) &&
				Math.abs(index - this.catch.index!) !== 8
			) {
				const Pname = this.catch.pName == "P" ? "p" : "P";
				const culc3: number = Pname == "p" ? 1 : -1;
				this.catch.countMoves++;
				this.picesCtx.clearRect(
					this.position[this.catch.index! + culc3].x,
					this.position[this.catch.index! + culc3].y,
					this.picesCan.width / 8,
					this.picesCan.height / 8
				);
				this.position[this.catch.index! + culc3] = {
					...this.position[this.catch.index! + culc3],
					pName: null,
					color: null,
					countMoves: 0
				};
				this.eatSkip.black = false;
			}
			this.infoCtx.clearRect(
				0,
				0,
				this.infoCan.width,
				this.infoCan.height
			);
			const isCanSkip = this.position[index].canSkip;
			//can skip
			const arr: number[] = [
				24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39
			];
			arr.forEach(n => {
				this.position[n].canSkip = false;
			});
			this.position[index].canSkip = isCanSkip;
			this.catch.countMoves++;

			//clear pice from new position
			this.picesCtx.clearRect(
				this.position[index].x,
				this.position[index].y,
				this.picesCan.width / 8,
				this.picesCan.height / 8
			);
			//put the pice draw in new position
			this.pices(
				this.position[index].x,
				this.position[index].y,
				this.position[index].index,
				this.catch.color,
				this.catch.pName,
				this.catch.countMoves
			);
			//put info to the new position
			this.position[index] = {
				...this.position[index],
				pName: this.catch.pName,
				color: this.catch.color,
				countMoves: this.catch.countMoves
			};
			//clear catch
			this.catch = {
				x: 1000,
				y: 1000,
				index: null,
				color: null,
				pName: null,
				countMoves: 0
			};
			if (this.position[index].pName?.match(/k/i)) {
				this.kingPosition[this.turn] = index;
			}
			this.turn = this.turn === "#fff" ? "#000" : "#fff";
			//console.table(this.position)

			return;
		} else {
			if (this.checked) this.checkMate(index);
			this.infoCtx.clearRect(
				0,
				0,
				this.infoCan.width,
				this.infoCan.height
			);
			this.pices(
				this.catch.x,
				this.catch.y,
				this.catch.index!,
				this.catch.color,
				this.catch.pName,
				this.catch.countMoves
			);
			this.position[this.catch.index!] = {
				...this.catch,
				index: this.catch.index!,
				canSkip: this.position[this.catch.index!].canSkip
			};

			this.catch = {
				x: 1000,
				y: 1000,
				index: null,
				color: null,
				pName: null,
				countMoves: 0
			};
			this.canCastle = false;
			return;
		}
	}
	checkMove({ prevIndex, nextIndex, Pname }: CheckingMoves): boolean {
		//test
		//check how much can the rook move
		//  console.table(obj)

		switch (Pname) {
			// @ts-ignore
			case "p":
			case "P":
				return this.pawn({ prevIndex, nextIndex, Pname });
			case "R":
			case "r":
				return this.rook({ prevIndex, nextIndex, Pname });
			case "B":
			case "b":
				return this.bishop({ prevIndex, nextIndex, Pname });
			case "N":
			case "n":
				return this.knight({ prevIndex, nextIndex, Pname });
			case "K":
			case "k":
				return this.king({ prevIndex, nextIndex, Pname });
			case "Q":
			case "q":
				return this.queen({ prevIndex, nextIndex, Pname });
			//20%12=8%8=0
			default:
				return false;
		}
	}
	pawn({ prevIndex, nextIndex, Pname }: CheckingMoves): boolean {
		//eat at right and left on not edge
		if (
			(prevIndex - nextIndex == 7 &&
				![15, 23, 31, 39, 47, 55].includes(prevIndex)) ||
			(prevIndex - nextIndex == 9 &&
				![8, 16, 24, 32, 40, 48].includes(prevIndex)) ||
			(nextIndex - prevIndex == 9 &&
				![15, 23, 31, 39, 47, 55].includes(prevIndex)) ||
			(nextIndex - prevIndex == 7 &&
				![8, 16, 24, 32, 40, 48].includes(prevIndex))
		) {
			const greaterThan: number = nextIndex < prevIndex ? 24 : 32,
				lessThan: number = nextIndex < prevIndex ? 31 : 39,
				PName: string = Pname == "P" ? "p" : "P";
			//eat on skip
			if (
				this.eatAtSkip({
					prevIndex,
					nextIndex,
					Pname: PName,
					lessThan,
					greaterThan
				})
			)
				return true;
			//eat left or right on not empty
			if (this.position[nextIndex].pName) {
				//upgrade to queen when eats left or right front
				if (
					((prevIndex >= 8 &&
						prevIndex <= 15 &&
						nextIndex < prevIndex) ||
						(prevIndex >= 48 &&
							prevIndex <= 55 &&
							nextIndex > prevIndex)) &&
					(Math.abs(prevIndex - nextIndex) == 7 ||
						Math.abs(prevIndex - nextIndex) == 9)
				) {
					this.catch.pName = nextIndex < prevIndex ? "Q" : "q";
					this.catch.countMoves = -1;
					return true;
				}
				return true;
			}
		}
		if (!this.position[nextIndex].pName) {
			//jump square to front
			const step: number = nextIndex < prevIndex ? -8 : 8;
			if (
				((prevIndex >= 48 &&
					prevIndex <= 55 &&
					nextIndex < prevIndex) ||
					(prevIndex >= 8 &&
						prevIndex <= 15 &&
						prevIndex < nextIndex)) &&
				Math.abs(prevIndex - nextIndex) == 16 &&
				!this.position[prevIndex + step].pName
			) {
				//turn on can skip
				this.position[nextIndex].canSkip = true;
				return true;
			}
			//jump one square
			//upgrade to queen when eats from front
			if (Math.abs(prevIndex - nextIndex) == 8) {
				if (
					(prevIndex >= 8 &&
						prevIndex <= 15 &&
						nextIndex < prevIndex) ||
					(prevIndex >= 48 &&
						prevIndex <= 55 &&
						prevIndex < nextIndex)
				) {
					this.catch.pName = nextIndex < prevIndex ? "Q" : "q";
					this.catch.countMoves = -1;
					return true;
				}
				return true;
			}
			return false;
		}
		return false;
	}
	rook({
		prevIndex,
		nextIndex,
		//@ts-ignore
		Pname
	}: CheckingMoves): boolean {
		//move up and down
		//if (this.position[nextIndex].color === this.position[prevIndex].color) return false

		if (Math.abs(nextIndex - prevIndex) % 8 == 0) {
			const culc = nextIndex < prevIndex ? 8 : -8;
			/**
			 * n=36
			 * p=60
			 * n<p
			 * culc=8
			 * for 36<60-8;
			 * 36<52 true;
			 * [36+8=44].pName==null
			 * 44<52 true
			 * [44+8=52].pName==null
			 * 52<=52 true break
			 */
			/**
			 * n=28
			 * p=4
			 * n>p
			 * culc=-8
			 * 28<4--8 false
			 * [28-8].Pname==null true
			 * 20<4 false
			 * 20<4--8 false
			 * [12].Pname===null true
			 * 12<=4--8 true back
			 * */
			//chick if there is a piece
			for (let i = nextIndex; ; ) {
				if (nextIndex < prevIndex) {
					if (i >= prevIndex - culc) break;
				} else {
					if (i <= prevIndex - culc) break;
				}
				i += culc;
				if (this.position[i].pName) return false;
			}
			return true;
		} else if (nextIndex - prevIndex < 8 && nextIndex > prevIndex) {
			//left right
			for (let i = prevIndex; i < nextIndex; i++) {
				if ([7, 15, 23, 31, 39, 47, 55, 63].includes(i)) {
					return false;
				}
				if (i !== prevIndex && this.position[i].pName) return false;
			}
			return true;
		} else if (prevIndex - nextIndex < 8 && nextIndex < prevIndex) {
			//left right
			for (let i = prevIndex; i > nextIndex; i--) {
				if ([0, 8, 16, 24, 32, 40, 48, 56].includes(i)) return false;

				if (i !== prevIndex && this.position[i].pName) return false;
			}
			return true;
		} else return false;
	}
	bishop({ prevIndex, nextIndex, Pname }: CheckingMoves): boolean {
		const step1 = nextIndex > prevIndex ? 9 : -9; // Step for top left and bottom right
		const step2 = nextIndex > prevIndex ? 7 : -7; // Step for top right and bottom left
		if (
			(prevIndex > nextIndex &&
				(prevIndex - nextIndex) % 9 == 0 &&
				![0, 8, 16, 24, 32, 40, 48, 56].includes(prevIndex)) ||
			(prevIndex < nextIndex &&
				(nextIndex - prevIndex) % 9 == 0 &&
				![7, 15, 23, 31, 39, 47, 55, 63].includes(prevIndex))
		) {
			for (let i = prevIndex, j = 1; j <= 7; j++, i += step1) {
				if (
					i + step1 !== nextIndex &&
					prevIndex > nextIndex &&
					[0, 8, 16, 24, 32, 40, 48, 56].includes(i + step1)
				)
					return false;
				if (
					i + step1 !== nextIndex &&
					prevIndex < nextIndex &&
					[7, 15, 23, 31, 39, 47, 55, 63].includes(i + step1)
				)
					return false;
				if (this.position[i].pName && this.position[i].pName !== Pname)
					return false;
				if (i + step1 === nextIndex) return true;
			}
		} else if (
			(prevIndex > nextIndex &&
				(prevIndex - nextIndex) % 7 == 0 &&
				![7, 15, 23, 31, 39, 47, 55, 63].includes(prevIndex)) ||
			(nextIndex > prevIndex &&
				(nextIndex - prevIndex) % 7 == 0 &&
				![0, 8, 16, 24, 32, 40, 48, 56].includes(prevIndex))
		) {
			for (let i = prevIndex, j = 1; j <= 7; j++, i += step2) {
				if (
					[7, 15, 23, 31, 39, 47, 55, 63].includes(i + step2) &&
					i + step2 !== nextIndex &&
					prevIndex > nextIndex
				)
					return false;
				if (
					[0, 8, 16, 24, 32, 40, 48, 56].includes(i + step2) &&
					i + step2 !== nextIndex &&
					prevIndex < nextIndex
				)
					return false;
				if (this.position[i].pName && this.position[i].pName !== Pname)
					return false;
				if (i + step2 === nextIndex) return true;
			}
		}
		return false;
	}
	knight({
		prevIndex,
		nextIndex,
		//@ts-ignore
		Pname
	}: CheckingMoves): boolean {
		//row start from 0 ///// col start from 0
		const prevCol: number = prevIndex % 8; //0
		const nextCol: number = nextIndex % 8; //1
		const prevRow: number = Math.floor(prevIndex / 8); //0
		const nextRow: number = Math.floor(nextIndex / 8); //2
		//  console.log(prevCol,nextCol,prevRow,nextRow)//0102
		if (
			(Math.abs(nextIndex - prevIndex) == 15 ||
				Math.abs(nextIndex - prevIndex) == 17) &&
			Math.abs(prevRow - nextRow) == 2 &&
			Math.abs(prevCol - nextCol) == 1
		)
			return true;
		else if (
			(Math.abs(nextIndex - prevIndex) == 6 ||
				Math.abs(nextIndex - prevIndex) == 10) &&
			Math.abs(prevRow - nextRow) == 1 &&
			Math.abs(prevCol - nextCol) == 2
		)
			return true;
		return false;
	}
	king({ prevIndex, nextIndex, Pname }: CheckingMoves): boolean {
		const prevRow: number = Math.floor(prevIndex / 8);
		const nextRow: number = Math.floor(nextIndex / 8);
		const arrMove: number[] = [7, 8, 9];
		if (this.castle({ prevIndex, nextIndex, Pname })) return true;
		if (this.position[nextIndex].color == this.turn) return false;
		if (
			(arrMove.includes(Math.abs(nextIndex - prevIndex)) &&
				Math.abs(prevRow - nextRow) == 1) ||
			(Math.abs(nextIndex - prevIndex) == 1 && prevRow == nextRow)
		)
			return true;
		return false;
	}
	queen({ prevIndex, nextIndex, Pname }: CheckingMoves): boolean {
		return (
			this.king({ prevIndex, nextIndex, Pname }) ||
			this.rook({ prevIndex, nextIndex, Pname }) ||
			this.bishop({ prevIndex, nextIndex, Pname })
		);
	}
	eatAtSkip({
		prevIndex,
		nextIndex,
		Pname,
		lessThan,
		greaterThan
	}: CanSkip): boolean | void {
		if (prevIndex >= greaterThan && prevIndex <= lessThan) {
			const culc1: number = Pname == "p" ? 9 : -9,
				culc2: number = Pname == "p" ? 7 : -7,
				culc3: number = Pname == "p" ? 1 : -1;
			if (
				prevIndex - nextIndex == culc1 && //P -9
				this.position[prevIndex - culc3].pName == Pname &&
				this.position[prevIndex - culc3].countMoves == 1 &&
				this.position[prevIndex - culc3].canSkip
			) {
				this.eatSkip.white = true;
				return true;
			} else if (
				prevIndex - nextIndex == culc2 &&
				this.position[prevIndex + culc3].pName == Pname &&
				this.position[prevIndex + culc3].countMoves == 1 &&
				this.position[prevIndex + culc3].canSkip
			) {
				this.eatSkip.black = true;
				return true;
			}
		}
	}
	drawGoals({ prevIndex, Pname }: Omit<CheckingMoves, "nextIndex">): void {
		switch (Pname) {
			case "p":
			case "P":
				{
					const step: number = Pname == "P" ? -17 : 17,
						count: number = Pname == "P" ? -1 : 1;
					for (
						let i = prevIndex;
						i != prevIndex + step && i > 0 && i < 63;
						i += count
					) {
						if (
							this.pawn({ prevIndex, nextIndex: i, Pname }) &&
							!(
								this.position[i].pName === "k" ||
								this.position[i].pName === "K"
							) &&
							this.position[i].color !==
								this.position[prevIndex].color
						) {
							this.infoCtx.strokeStyle = "red";
							this.infoCtx.beginPath();
							this.infoCtx.strokeRect(
								this.position[i].x,
								this.position[i].y,
								40,
								40
							);
						}
					}
				}
				break;
			case "r":
			case "R":
				for (let j = 0; j <= 63; j++) {
					//  if ( i >= 63 ) return;
					if (
						this.rook({ prevIndex, nextIndex: j, Pname }) &&
						this.position[prevIndex].color !==
							this.position[j].color &&
						!(
							this.position[j].pName === "k" ||
							this.position[j].pName === "K"
						)
					) {
						this.infoCtx.strokeStyle = "red";
						this.infoCtx.beginPath();
						this.infoCtx.strokeRect(
							this.position[j].x,
							this.position[j].y,
							40,
							40
						);
					}
				}
				break;
			case "n":
			case "N":
				for (let j = 0; j <= 63; j++) {
					//  if ( i >= 63 ) return;
					if (
						this.knight({ prevIndex, nextIndex: j, Pname }) &&
						this.position[prevIndex].color !==
							this.position[j].color &&
						!(
							this.position[j].pName === "k" ||
							this.position[j].pName === "K"
						)
					) {
						this.infoCtx.strokeStyle = "red";
						this.infoCtx.beginPath();
						this.infoCtx.strokeRect(
							this.position[j].x,
							this.position[j].y,
							40,
							40
						);
					}
				}
				break;
			case "b":
			case "B":
				for (let j = 0; j <= 63; j++) {
					if (
						this.bishop({ prevIndex, nextIndex: j, Pname }) &&
						this.position[prevIndex].color !==
							this.position[j].color &&
						!(
							this.position[j].pName === "k" ||
							this.position[j].pName === "K"
						)
					) {
						this.infoCtx.strokeStyle = "red";
						this.infoCtx.beginPath();
						this.infoCtx.strokeRect(
							this.position[j].x,
							this.position[j].y,
							40,
							40
						);
					}
				}
				break;

			case "q":
			case "Q":
				for (let j = 0; j <= 63; j++) {
					//  if ( i >= 63 ) return;
					if (
						this.queen({ prevIndex, nextIndex: j, Pname }) &&
						this.position[prevIndex].color !==
							this.position[j].color &&
						!(
							this.position[j].pName === "k" ||
							this.position[j].pName === "K"
						)
					) {
						this.infoCtx.strokeStyle = "red";
						this.infoCtx.beginPath();
						this.infoCtx.strokeRect(
							this.position[j].x,
							this.position[j].y,
							40,
							40
						);
					}
				}
				break;
			case "k":
			case "K":
				for (let j = 0; j <= 63; j++) {
					//  if ( i >= 63 ) return;
					if (
						this.king({ prevIndex, nextIndex: j, Pname }) &&
						!(
							this.position[j].pName === "k" ||
							this.position[j].pName === "K"
						)
					) {
						this.infoCtx.strokeStyle = "red";
						this.infoCtx.beginPath();
						this.infoCtx.strokeRect(
							this.position[j].x,
							this.position[j].y,
							40,
							40
						);
					}
				}
				break;
			default:
				break;
		}
	}
	castle({ prevIndex, nextIndex, 
	//@ts-ignore
	Pname }: CheckingMoves): boolean {
		if (
			this.position[prevIndex].countMoves == 0 &&
			this.position[nextIndex].countMoves == 0 &&
			((this.position[nextIndex].pName == "r" && this.turn == "#000") ||
				(this.position[nextIndex].pName == "R" &&
					this.turn == "#fff")) &&
			Math.abs(nextIndex - prevIndex) <= 4
		) {
			const step: number = nextIndex < prevIndex ? 1 : -1;
			for (let i = nextIndex + step; i !== prevIndex; i += step) {
				if (this.position[i].pName) return false;
			}
			this.canCastle = true;
			return true;
		}
		return false;
	}
	checkSquare(nextIndex: number): boolean {
		let whatCatch: number = this.catch.pName?.match(/k/i)
			? nextIndex
			: this.kingPosition[this.turn];
		console.log(
			`%c${"-".repeat(26)}`,
			"color:red;background-color:black;font:italic small-caps bolder 30px sans-serif;"
		);
		//change king position on castle
		if (this.canCastle) {
			if ([0, 56].includes(nextIndex)) whatCatch = nextIndex + 2;
			if ([7, 63].includes(nextIndex)) whatCatch = nextIndex - 1;
		}
		const rook: string = this.turn === "#fff" ? "r" : "R",
			king: string = this.turn === "#fff" ? "k" : "K",
			queen: string = this.turn === "#fff" ? "q" : "Q",
			bishop: string = this.turn === "#fff" ? "b" : "B",
			knight: string = this.turn === "#fff" ? "n" : "N",
			pawn: string = this.turn === "#fff" ? "p" : "P",
			row: number = Math.floor(whatCatch / 8),
			col: number = whatCatch % 8;

		//check rook and queen moves
		let stepLR: number = -1;
		//if piece on square 0 of left move right
		if (col == 0) stepLR = 1;
		leftAndRight: for (let i: number = whatCatch; ; ) {
			//debugger;
			i += stepLR;
			//defind nisted row and col
			let nistedCol = i % 8;
			/*
			 *if nisted col equales 0 and no rook or queen anime
			 *or
			 * if moving to left and
			 * on next square foind piece dose not equale amime rook or queen or
			 * that piece dose equales the square that i want to move piece un king to it
			 * move to right from orign square + 1 and ressign nisted col and stepLr = 1
			 */
			if (
				(nistedCol == 0 &&
					!(
						this.position[i]?.pName == rook ||
						this.position[i]?.pName == queen
					)) ||
				(stepLR == -1 &&
					((this.position[i].pName &&
						!(
							this.position[i].pName == rook ||
							this.position[i].pName == queen
						)) ||
						this.position[i].index == nextIndex))
			) {
				if (col == 7) break leftAndRight;
				i = whatCatch + 1;
				nistedCol = i % 8;
				stepLR = 1;
			}
			/**
			 * if square become 7 and the piece dosen't equale rook or queen anime
			 * or
			 * if move to right and the piece dosen't equale rook or queen anime or
			 * that piece dose equales the square that i want to move piece un king to it
			 * stop the loop
			 */
			if (
				(nistedCol == 7 &&
					!(
						this.position[i]?.pName == rook ||
						this.position[i]?.pName == queen
					)) ||
				(stepLR == 1 &&
					((this.position[i].pName &&
						!(
							this.position[i]?.pName == rook ||
							this.position[i]?.pName == queen
						)) ||
						this.position[i].index == nextIndex))
			)
				break leftAndRight;

			this.kingStream({
				prevIndex: whatCatch,
				Pname: "gray",
				x: this.position[i].x,
				y: this.position[i].y
			});

			if (
				this.position[i].pName == rook ||
				this.position[i].pName == queen
			) {
				this.checked = true;
				return false;
			}
		}
		//top bottom
		let stepTB: number = -8;
		if (row == 0) stepTB = 8;
		topAndBottom: for (let i: number = whatCatch; ; ) {
			i += stepTB;
			let nistedRow = Math.floor(i / 8);

			if (
				(nistedRow == 0 &&
					!(
						this.position[i]?.pName == rook ||
						this.position[i]?.pName == queen
					)) ||
				(stepTB == -8 &&
					((this.position[i].pName &&
						!(
							this.position[i].pName == rook ||
							this.position[i].pName == queen
						)) ||
						this.position[i].index == nextIndex))
			) {
				if (row == 7) break topAndBottom;
				i = whatCatch + 8;
				nistedRow = Math.floor(i / 8);
				stepTB = 8;
			}

			if (
				(nistedRow == 7 &&
					!(
						this.position[i]?.pName == rook ||
						this.position[i]?.pName == queen
					)) ||
				(stepTB == 8 &&
					((this.position[i].pName &&
						!(
							this.position[i]?.pName == rook ||
							this.position[i]?.pName == queen
						)) ||
						this.position[i].index == nextIndex))
			)
				break topAndBottom;
			this.kingStream({
				prevIndex: whatCatch,
				Pname: "gray",
				x: this.position[i].x,
				y: this.position[i].y
			});
			if (
				this.position[i].pName == rook ||
				this.position[i].pName == queen
			) {
				this.checked = true;
				return false;
			}
		}
		//chexk bishop and queen moves
		let stepTLBR: number = -9;
		if (col == 0 && row != 7) stepTLBR = 9;
		if (row == 0 && col != 7) stepTLBR = 9;
		TLAndRB: for (let i: number = whatCatch; ; ) {
			if ((col == 0 && row == 7) || (col == 7 && row == 0)) break TLAndRB;
			i += stepTLBR;
			let nistedCol = i % 8;
			let nistedRow = Math.floor(i / 8);
			if (
				((nistedCol == 0 || nistedRow == 0) &&
					!(
						this.position[i]?.pName == bishop ||
						this.position[i]?.pName == queen
					)) ||
				(stepTLBR == -9 &&
					((this.position[i].pName &&
						!(
							this.position[i].pName == bishop ||
							this.position[i].pName == queen
						)) ||
						this.position[i].index == nextIndex))
			) {
				if (col == 7 || row == 7) break TLAndRB;
				i = whatCatch + 9;
				nistedCol = i % 8;
				nistedRow = Math.floor(i / 8);
				stepTLBR = 9;
			}

			if (
				((nistedCol == 7 || nistedRow == 7) &&
					!(
						this.position[i]?.pName == bishop ||
						this.position[i]?.pName == queen
					)) ||
				(stepTLBR == 9 &&
					((this.position[i].pName &&
						!(
							this.position[i]?.pName == bishop ||
							this.position[i]?.pName == queen
						)) ||
						this.position[i].index == nextIndex))
			)
				break TLAndRB;

			this.kingStream({
				prevIndex: whatCatch,
				Pname: "green",
				x: this.position[i].x,
				y: this.position[i].y
			});

			if (
				this.position[i].pName == bishop ||
				this.position[i].pName == queen
			) {
				this.checked = true;
				return false;
			}
		}
		let stepTRBL: number = -7;
		if (col == 7 && row != 7) stepTRBL = 7;
		if (row == 0 && col != 0) stepTRBL = 7;
		TRAndBL: for (let i: number = whatCatch; ; ) {
			if (
				(col == 7 && row == 7) ||
				(col == 0 && row == 0) ||
				(col == 0 && row == 7 && stepTRBL == 7)
			)
				break TRAndBL;
			i += stepTRBL;
			let nistedCol = i % 8;
			let nistedRow = Math.floor(i / 8);
			if (
				((nistedCol == 7 || nistedRow == 0) &&
					!(
						this.position[i]?.pName == bishop ||
						this.position[i]?.pName == queen
					)) ||
				(stepTRBL == -7 &&
					((this.position[i].pName &&
						!(
							this.position[i].pName == bishop ||
							this.position[i].pName == queen
						)) ||
						this.position[i].index == nextIndex))
			) {
				if (col == 0 || row == 7) break TRAndBL;
				i = whatCatch + 7;
				nistedCol = i % 8;
				nistedRow = Math.floor(i / 8);
				stepTRBL = 7;
			}

			if (
				((nistedCol == 0 || nistedRow == 7) &&
					!(
						this.position[i]?.pName == bishop ||
						this.position[i]?.pName == queen
					)) ||
				(stepTRBL == 7 &&
					((this.position[i].pName &&
						!(
							this.position[i]?.pName == bishop ||
							this.position[i]?.pName == queen
						)) ||
						this.position[i].index == nextIndex))
			)
				break TRAndBL;

			this.kingStream({
				prevIndex: whatCatch,
				Pname: "green",
				x: this.position[i].x,
				y: this.position[i].y
			});

			if (
				this.position[i].pName == bishop ||
				this.position[i].pName == queen
			) {
				this.checked = true;
				return false;
			}
		}
		// Check knight moves
		for (let i of [6, 10, 15, 17, -6, -10, -15, -17]) {
			if (whatCatch + i >= 0 && whatCatch + i < 64) {
				const knightCol = (whatCatch + i) % 8;
				this.kingStream({
					prevIndex: whatCatch,
					Pname: "red",
					x: this.position[whatCatch + i].x,
					y: this.position[whatCatch + i].y
				});

				if (
					this.position[whatCatch + i].pName == knight &&
					(Math.abs(col - knightCol) == 2 ||
						Math.abs(col - knightCol) == 1) &&
					whatCatch + i != nextIndex
				) {
					this.checked = true;
					return false;
				}
			}
		}

		// Check pawn moves

		for (let i of [7, 9, -7, -9]) {
			if (whatCatch + i >= 0 && whatCatch + i < 64) {
				const pawnCol = (whatCatch + i) % 8;
				this.kingStream({
					prevIndex: whatCatch,
					Pname: "yellow",
					x: this.position[whatCatch + i].x,
					y: this.position[whatCatch + i].y
				});

				if (
					whatCatch + i != nextIndex &&
					this.turn === "#fff" &&
					i < 0 &&
					this.position[whatCatch + i].pName === pawn &&
					Math.abs(col - pawnCol) === 1
				) {
					{
						this.checked = true;
						return false;
					}
				}

				if (
					whatCatch + i != nextIndex &&
					this.turn === "#000" &&
					i > 0 &&
					this.position[whatCatch + i].pName === pawn &&
					Math.abs(col - pawnCol) === 1
				) {
					{
						this.checked = true;
						return false;
					}
				}
			}
		}

		//check king moves
		for (const i of [1, 7, 8, 9, -1, -7, -8, -9]) {
			if (whatCatch + i >= 0 && whatCatch + i < 64) {
				const kingCol = (whatCatch + i) % 8;
				this.kingStream({
					prevIndex: whatCatch,
					Pname: "blue",
					x: this.position[whatCatch + i].x,
					y: this.position[whatCatch + i].y
				});

				if (
					this.position[whatCatch + i].pName == king &&
					(col - kingCol == 0 || Math.abs(col - kingCol) == 1)
				) {
					this.checked = true;
					return false;
				}
			}
		}
		this.checked = false;
		return true;
	}
	checkMate(nextIndex: number): boolean {
		let whatCatch: number = this.catch.pName?.match(/k/i)
				? nextIndex
				: this.kingPosition[this.turn],
			countCheckMate: boolean[] = [];
		for (const i of [-1, 1, -7, 7, -8, 8, -9, 9]) {
			if (whatCatch + i >= 0 && whatCatch + i < 64) {
				if (this.position[whatCatch + i].pName == null)
					countCheckMate.push(this.checkSquare(whatCatch + i));
				// ^?
				else countCheckMate.push(false);
			}
		}
		console.log(countCheckMate);
		if (countCheckMate.every(ch => ch == false)) {
			console.log(
				"%ccheck mate",
				"font:32 sans-serif;background-color:red;"
			);
			return true;
		}
		return false;
	}
	kingStream({
		//@ts-ignore
		prevIndex,
		Pname,
		x,
		y
	}: Omit<CheckingMoves, "nextIndex"> & { x: number; y: number }): void {
		this.boardCtx.beginPath();
		this.boardCtx.arc(x + 20, y + 20, 10, 0, Math.PI * 2);
		this.boardCtx.fillStyle = Pname;
		this.boardCtx.fill();
		this.boardCtx.save();
		this.boardCtx.closePath();
	}
}
const game = new ChessApp();
game.init();

//rook, to color pawn, bishop, knight, king, queen;
//on castel change position to check if the square is not checked
