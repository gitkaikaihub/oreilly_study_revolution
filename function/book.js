const moment = require("moment");
module.exports = Book;


function Book(book) {
	this.book = book;
	
	// Region basic
	
	// ! Region about time
	this.getSecondsFromHourMin = timeStr => parseInt(timeStr.split('h')[0]) * 3600 + parseInt(timeStr.split('h')[1].split('m')[0]) * 60
	
	// ! Region about word
	this.getTotalWordsPerBook = book => {
		let sum = 0;
		for (let chapter in book['chapters']) {
			sum += book['chapters'][chapter]['totalWords'];
		}
		return sum;
	}
	
	// ! Region about date
	this.transformTime = dateStr => moment(dateStr, 'YYYY年MM月DD日 HH点mm分').toDate()
	
	// ! Region about speed
	
	// * transform
	this.getSpeed = speedStr => parseInt(speedStr.split('%')[0]) / 100
	
	
	// * standard speed
	this.getStandardSpeedPerBook = book => {
		let totalWords = this.getTotalWordsPerBook(book);
		let timeToComplete = this.getSecondsFromHourMin(book['timeToComplete']);
		let standardPeriodSeconds = this.getStandardPeriodSeconds();
		return Math.ceil(totalWords / timeToComplete * standardPeriodSeconds);
	}
	
	// ! Region about standard period seconds
	this.getStandardPeriodSeconds = () => {
		const minutesPerPeriod = 25;
		const secondsPerMinute = 60;
		return minutesPerPeriod * secondsPerMinute;
	}
	
	//  End basic
	
	// Region period
	
	// !	Region about effective
	this.getReadWordsPerPeriod = period => {
		let startWords = period.readWordsAtStart;
		let endWords = period.readWordsAtEnd;
		return endWords - startWords;
	}
	
	// !	Region about spend
	this.getSpendSecondsPerPeriod = period => {
		let startTime = this.transformTime(period['startTime']);
		let endTime = this.transformTime(period['endTime']);
		return (endTime - startTime) / 1000;
	}
	
	// ! Region about speed
	
	// * absolute
	this.getAbsoluteSpeedPerPeriod = period => {
		let readWordsPerPeriod = this.getReadWordsPerPeriod(period);
		let spendSeconds = this.getSpendSecondsPerPeriod(period);
		let standardPeriodSeconds = this.getStandardPeriodSeconds();
		return Math.floor(readWordsPerPeriod / spendSeconds * standardPeriodSeconds)
	}
	
	// * relative
	this.getRelativeSpeedPerPeriod = (book, period) => {
		let absoluteSpeedPerPeriod = this.getAbsoluteSpeedPerPeriod(period);
		let standardSpeedPerBook = this.getStandardSpeedPerBook(book);
		return `${Math.floor(absoluteSpeedPerPeriod / standardSpeedPerBook * 100)}%`
	}
	
	// End period
	
	// Region chapter
	
	// ! Region about total
	this.getTotalWordsPerChapter = chapter => chapter['totalWords'];
	
	// ! Region about effective
	this.getLastPeriodReadWords = chapter => {
		if (chapter.hasOwnProperty('wordsPerPeriod') === false) {
			return 0;
		}
		let lastPeriod = chapter['wordsPerPeriod'].slice(-1)[0];
		return lastPeriod['readWordsAtEnd'];
	}
	
	// ! Region about spend
	this.getSumSpendSecondsPerChapter = chapter => {
		let totalSpendSeconds = 0;
		if (chapter.hasOwnProperty('wordsPerPeriod') === true) {
			totalSpendSeconds += chapter['wordsPerPeriod'].map(period => this.getSpendSecondsPerPeriod(period)).reduce((a, b) => a + b, 0);
		}
		return totalSpendSeconds;
	}
	
	// ! Region about speed
	
	// * absolute
	this.getAbsoluteSpeedPerChapter = chapter => {
		let readWordsPerChapter = this.getLastPeriodReadWords(chapter);
		let spendSeconds = this.getSumSpendSecondsPerChapter(chapter);
		let standardPeriodSeconds = this.getStandardPeriodSeconds();
		return Math.floor(readWordsPerChapter / spendSeconds * standardPeriodSeconds);
	}
	
	// * relative
	this.getRelativeSpeedPerChapter = (book, chapter) => {
		let absoluteSpeedPerChapter = this.getAbsoluteSpeedPerChapter(chapter);
		let standardSpeedPerBook = this.getStandardSpeedPerBook(book);
		return `${Math.floor(absoluteSpeedPerChapter / standardSpeedPerBook * 100)}%`
	}
	
	
	// ! Region about remain
	
	// * remain words
	this.getRemainWordsPerChapter = chapter => {
		let totalWords = this.getTotalWordsPerChapter(chapter);
		let readWords = this.getLastPeriodReadWords(chapter);
		return totalWords - readWords;
	}
	
	// * remain periods
	this.getRemainPeriodsPerChapter = chapter => {
		let remainWords = this.getRemainWordsPerChapter(chapter);
		let speedPerChapter = this.getAbsoluteSpeedPerChapter(chapter);
		return Math.ceil(remainWords / speedPerChapter);
	}
	
	// 	End chapter
	
	// 	Region book
	
	// ! Region about effective
	this.getSumEffectiveReadWordsPerBook = book => {
		let sum = 0;
		for (let chapter in book['chapters']) {
			sum += this.getLastPeriodReadWords(book['chapters'][chapter]);
		}
		return sum;
	}
	
	// ! Region about spend
	this.getSumSpendSecondsPerBook = book => {
		let sum = 0;
		for (let chapter in book['chapters']) {
			sum += this.getSumSpendSecondsPerChapter(book['chapters'][chapter]);
		}
		return sum;
	}
	
	// ! Region about speed
	
	// * absolute
	this.getAbsoluteSpeedPerBook = book => {
		let readWordsPerBook = this.getSumEffectiveReadWordsPerBook(book);
		let spendSeconds = this.getSumSpendSecondsPerBook(book);
		let standardPeriodSeconds = this.getStandardPeriodSeconds();
		return Math.floor(readWordsPerBook / spendSeconds * standardPeriodSeconds);
	}
	
	// * relative
	this.getRelativeSpeedPerBook = book => {
		let absoluteSpeedPerBook = this.getAbsoluteSpeedPerBook(book);
		let standardSpeedPerBook = this.getStandardSpeedPerBook(book);
		return `${Math.floor(absoluteSpeedPerBook / standardSpeedPerBook * 100)}%`
	}
	
	// ! Region about remain
	
	// * remain words
	this.getRemainWordsPerBook = book => {
		let totalWords = this.getTotalWordsPerBook(book);
		let readWords = this.getSumEffectiveReadWordsPerBook(book);
		return totalWords - readWords;
	}
	
	// * remain periods
	this.getRemainPeriodsPerBook = book => {
		let remainWords = this.getRemainWordsPerBook(book);
		let speedPerBook = this.getAbsoluteSpeedPerBook(book);
		return Math.ceil(remainWords / speedPerBook);
	}
	
	// 	End book
	
}
