const data = require('./headFirstJava3rd/bookData');
const Book = require('../../function/book');
const printStars = require("../../function/print");

const book = new Book(data);
const template = {
	lastChapter: 'chapter01',
	currentChapter: 'chapter01'
}

const standardSpeed = book.getStandardSpeedPerBook(data);

const averageAbsoluteSpeed = book.getAbsoluteSpeedPerBook(data);
const averageRelativeSpeed = book.getRelativeSpeedPerBook(data);

const lastChapterAbsoluteSpeed = book.getAbsoluteSpeedPerChapter(data['chapters'][template['lastChapter']]);
const lastChapterRelativeSpeed = book.getRelativeSpeedPerChapter(data, data['chapters'][template['lastChapter']]);

const currentChapterAbsoluteSpeed = book.getAbsoluteSpeedPerChapter(data['chapters'][template['currentChapter']]);
const currentChapterRelativeSpeed = book.getRelativeSpeedPerChapter(data, data['chapters'][template['currentChapter']]);

const lastPeriodAbsoluteSpeed = book.getAbsoluteSpeedPerPeriod(data['chapters'][template['currentChapter']]['wordsPerPeriod'].slice(-1)[0]);
const lastPeriodRelativeSpeed = book.getRelativeSpeedPerPeriod(data, data['chapters'][template['currentChapter']]['wordsPerPeriod'].slice(-1)[0]);


const remainPeriodsCurrentChapter = book.getRemainPeriodsPerChapter(data['chapters'][template['currentChapter']]);
const remainPeriodsCurrentBook = book.getRemainPeriodsPerBook(data);

console.log(`标准学习速度为 ${standardSpeed}字/学习周期`);
console.log(printStars('100%'))
console.log()

console.log(`整本书的绝对平均学习速度为 ${averageAbsoluteSpeed}字/学习周期`);
console.log(`整本书的相对平均学习速度为 ${averageRelativeSpeed}`);
console.log(printStars(averageRelativeSpeed));
console.log()

console.log(`上一章的绝对平均学习速度为 ${lastChapterAbsoluteSpeed}字/学习周期`);
console.log(`上一章的相对平均学习速度为 ${lastChapterRelativeSpeed}`);
console.log(printStars(lastChapterRelativeSpeed));
console.log()

console.log(`当前章的绝对平均学习速度为 ${currentChapterAbsoluteSpeed}字/学习周期`);
console.log(`当前章的相对平均学习速度为 ${currentChapterRelativeSpeed}`);
console.log(printStars(currentChapterRelativeSpeed));
console.log()

console.log(`最近一个学习周期的绝对平均学习速度为 ${lastPeriodAbsoluteSpeed}字/学习周期`);
console.log(`最近一个学习周期的相对平均学习速度为 ${lastPeriodRelativeSpeed}`);
console.log(printStars(lastPeriodRelativeSpeed));
console.log()

console.log(`完成整本书,预计仍需学习周期的数量为 ${remainPeriodsCurrentBook}`);
console.log(`完成当前章,预计仍需学习周期的数量为 ${remainPeriodsCurrentChapter}`)
