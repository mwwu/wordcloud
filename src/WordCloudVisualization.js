import React, { Component } from 'react';
import './WordCloudVisualization.css';

class WordCloudVisualization extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			wordFreq: this.props.wordFreq,
			sortedWords: this.props.sortedWords,
			canvasWidth: this.props.innerWidth,
			canvasHeight: this.props.innerHeight
		};

		this.fillRectangle.bind(this)
	}

	/*
	When component first mounts, save a reference to the canvas.
	*/
	componentDidMount() {
		var ctx = this.refs.canvas.getContext("2d");
		this.setState({ctx: ctx});
	}
	
	/*
	When the input changes, the component will be updated. Then, we
	process the words and update the state.
	*/
	componentDidUpdate(prevProps) {		
		if (this.props.wordFreq !== prevProps.wordFreq
			|| this.props.canvasWidth !== prevProps.canvasWidth 
			|| this.props.canvasHeight !== prevProps.canvasHeight) {
			const wordFreq = this.props.wordFreq;
			
			let max = parseFloat(0);
			for (let word in wordFreq) 
				max = Math.max(max, wordFreq[word]);
			
			let wordFreqCopy = {};
			let multiplier = Math.max(90, (this.props.canvasHeight * this.props.canvasWidth)/3500);
			console.log(multiplier)
			for (let word in wordFreq) 
				wordFreqCopy[word] = Math.min(.3, (Math.log((wordFreq[word]/max)+1)))*multiplier;

			this.setState({
				wordFreq: wordFreqCopy,
				sortedWords: this.props.sortedWords,
				remainingWords: [...this.props.sortedWords],
				canvasWidth: this.props.canvasWidth,
				canvasHeight: this.props.canvasHeight
			}, () => {
				const outer = {
					x: 0,
					y: 0,
					width: this.state.canvasWidth,
					height: this.state.canvasHeight
				}		
				this.state.ctx.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);
				this.state.ctx.translate(0.5, 0.5)
				this.fillRectangle(outer);
				this.state.ctx.translate(-0.5, -0.5)
			});
		}

	}

	/*
	Recursively fill an empty rectangle, until nothing else fits in
	the "outer" rectangle, or we run out of words.
	*/
	fillRectangle(outer) {		
		if (this.state.remainingWords.length === 0)
			return;
		
		let ctx = this.state.ctx;
		for (let i=0; i<this.state.remainingWords.length; i++) {
			let key = this.state.remainingWords[i];
			ctx.globalAlpha = this.state.wordFreq[key] / 50
			ctx.font = this.state.wordFreq[key] + "px NutanixSoft";

			let flipped = Math.random() < .5;
			let width, height;

			if (flipped) {
				width = this.state.wordFreq[key];
				height = ctx.measureText(key).width * 1.2;
			}
			else {
				width = ctx.measureText(key).width * 1.2;
				height = this.state.wordFreq[key];
			}

			if (width <= outer.width && height <= outer.height
				&& width > 0 && height > 0) {
				const newInner = {
					x: outer.x + (outer.width/2) - (width/2),
					y: outer.y + (outer.height/2) - (height/2),
					width: width,
					height: height
				}

				this.drawText(key, newInner.x, newInner.y, width, height, flipped);
				
				let deleted = this.state.remainingWords.splice(i, 1)[0];
				this.expandRectangle(newInner, outer);
				return;
			}
		}
	}

	/*
	Recursively expand the inner rectangle, until the outer rectangle
	is filled up, or we run out of words. Choose a random direction 
	to add the next word.
	*/
	expandRectangle(inner, outer) {
		if (this.state.remainingWords.length === 0) 
			return;
	
		const ctx = this.state.ctx;
		for (var i=0; i<this.state.remainingWords.length; i++) {
			const key = this.state.remainingWords[i]
			ctx.globalAlpha = this.state.wordFreq[key] / 50
			ctx.font = this.state.wordFreq[key] + "px NutanixSoft-Thin";
			
			var flipped = Math.random() < .5;
			var width = ctx.measureText(key).width * 1.2;
			var height = this.state.wordFreq[key];

			if (flipped) {
				width = this.state.wordFreq[key];
				height = ctx.measureText(key).width * 1.2;
			}

			let x, y, newInner, leftoverSpace;
			const random = Math.floor((Math.random() * 8));

			if (random === 0) 
				[x, y, newInner, leftoverSpace] = this.stackOnTop(width, height, inner)
			else if (random === 1) 
				[x, y, newInner, leftoverSpace] = this.stackOnBottom(width, height, inner)
			else if (random === 2) 
				[x, y, newInner, leftoverSpace] = this.stackOnRight(width, height, inner)
			else 
				[x, y, newInner, leftoverSpace] = this.stackOnLeft(width, height, inner)
			
			if (this.fitsInsideRectangle(newInner, outer)) {	
				this.drawText(key, x, y, width, height, flipped);
				let deleted = this.state.remainingWords.splice(i, 1)[0];
				this.fillRectangle(leftoverSpace);
				this.expandRectangle(newInner, outer);
				return;
			}
		}
	}

	/*
	Put the text on the canvas. If the word is flipped, rotate the canvas
	so we can draw vertically.
	*/
	drawText(key, x, y, width, height, flipped) {
		let ctx = this.state.ctx;
		if (flipped) {
			ctx.save()
			ctx.translate(x, y)
			ctx.rotate(Math.PI/2);
			ctx.fillText(key, (height * .1), -width/5)
			ctx.restore()
		}
		else {
			ctx.fillText(key, x + (width * .1), y + (height * .8));
		}
	}

	/*
	Return the calculation for stacking a new word on top (left aligned)
	of the existing rectangle.
	*/
	stackOnTop(width, height, inner) {
		let x = inner.x;
		let y = inner.y - height;
		let newInner = {
			x: x,
			y: y,
			width: Math.max(width, inner.width),
			height: height + inner.height
		}
		let leftoverSpace = {
			x: x + Math.min(width, inner.width),
			y: width < inner.width ? y : inner.y,
			width: Math.abs(width - inner.width),
			height: width < inner.width ? height : inner.height
		}
		return [x, y, newInner, leftoverSpace]
	}

	/*
	Return the calculation for stacking a new word under (right aligned)
	of the existing rectangle.
	*/
	stackOnBottom(width, height, inner) {
		let x = inner.x + inner.width - width;
		let y = inner.y + inner.height;
		let newInner = {
			x: Math.min(x, inner.x),
			y: inner.y,
			width: Math.max(width, inner.width),
			height: height + inner.height
		}
		let leftoverSpace = {
			x: width < inner.width ? inner.x : x,
			y: width < inner.width ? y : inner.y,
			width: Math.abs(width - inner.width),
			height: width < inner.width ? height : inner.height
		}
		return [x, y, newInner, leftoverSpace]
	}

	/*
	Return the calculation for stacking a new word to the right (top aligned)
	of the existing rectangle.
	*/
	stackOnRight(width, height, inner) {
		let x = inner.x + inner.width;
		let y = inner.y;
		let newInner = {
			x: inner.x,
			y: inner.y,
			width: width + inner.width,
			height: Math.max(height, inner.height)
		}
		let leftoverSpace = {
			x: height < inner.height ? x : inner.x,
			y: y + Math.min(height, inner.height),
			width: height < inner.height ? width : inner.width,
			height: Math.abs(inner.height - height)
		}
		return [x, y, newInner, leftoverSpace]
	}

	/*
	Return the calculation for stacking a new word to the left (bottom aligned)
	of the existing rectangle.
	*/
	stackOnLeft(width, height, inner) {
		let x = inner.x - width;
		let y = inner.y + inner.height - height;
		let newInner = {
			x: x,
			y: Math.min(y, inner.y),
			width: width + inner.width,
			height: Math.max(height, inner.height)
		}
		let leftoverSpace = {
			x: height < inner.height ? x : inner.x,
			y: Math.min(y, inner.y),
			width: height < inner.height ? width : inner.width,
			height: Math.abs(inner.height - height)
		}
		return [x, y, newInner, leftoverSpace]
	}

	/*
	Return true if adding the new word will fit in the outer boundaries.
	*/
	fitsInsideRectangle(inner, outer) {
		return inner.x >= outer.x 
			&& inner.y >= outer.y
			&& (inner.x + inner.width) <= (outer.x + outer.width)
			&& (inner.y + inner.height) <= (outer.y + outer.height);
	}

	render() {
		return (
			<div>
				<canvas 
					ref="canvas" 
					width={this.state.canvasWidth} 
					height={this.state.canvasHeight} 
				/>
			</div>
		);
	}
}

export default WordCloudVisualization;