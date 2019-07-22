import React, { Component } from 'react';
import WordCloudVisualization from './WordCloudVisualization';
import './WordCloud.css';

class WordCloud extends Component {
	constructor(props) {
		super(props);

		this.state = {
			text: '',
			wordFreq: {"": 1},
			sortedWords: [""],
			canvasWidth: 0,
			canvasHeight: 0
		}		
		this.updateCanvasSize.bind(this);
		this.handleTextChange.bind(this);
	}

	handleTextChange = (event) => {
		var wordFreq = {};
		var sortedWords = [];
		if (event.target.value) {
			var words = event.target.value.toLowerCase().match(/\b(\w+)\b/g)
			if (words) {
				words.forEach(function(element) {
					if (element !== "and"
						&& element !== "the"
						&& element !== "a"
						&& element !== "to"
						&& element !== "of") {
						wordFreq[element] = wordFreq[element] + 1 || 1;
					}
				});
			}

			sortedWords = Object.keys(wordFreq).sort(function(a, b){
				return wordFreq[b]-wordFreq[a];
			});

			// Unsorted version, can sometimes be more aesthetic than sorted version
			//sortedWords = Object.keys(wordFreq);
		}

		this.setState({ 
			text: event.target.value,
			wordFreq: wordFreq,
			sortedWords: sortedWords
		});
	};

	updateCanvasSize = (event) => {
		this.setState({
			canvasWidth: window.innerWidth,
			canvasHeight: window.innerHeight - 200
		});
	};

	componentDidMount() {
		this.updateCanvasSize();
		window.addEventListener('resize', this.updateCanvasSize);
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.updateCanvasSize);
	}

	render() {
		return (
			<div>
				<div className="title-container">
					<span className="title">Word Cloud Generator</span>
				</div>
				<div className="textarea-container">
					<textarea 
						type="text" 
						value={this.state.text}
						placeholder="Start typing..."
						maxlength="9000"
						onChange={this.handleTextChange}
					/>
				</div>
				<WordCloudVisualization 
					wordFreq={this.state.wordFreq}
					sortedWords={this.state.sortedWords}
					canvasWidth={this.state.canvasWidth}
					canvasHeight={this.state.canvasHeight}
				/>
			</div>
		);
	}
}

export default WordCloud;