const fs = require('fs');
const {EOL} = require('os');



let init = ()=>{
	if(process.argv.length !== 5) return usage();
	if(process.argv[2][0] === 'e'){
		encode();
	} else {
		decode();
	}
}
let decode =()=>{
	let input = fs.readFileSync(process.argv[3]).toString('utf-8');
	let output = process.argv[4];
	fs.writeFileSync(output,locate(input));

}

let encode = ()=>{
	let data = fs.readFileSync(process.argv[3]).toString('utf-8');
	let toHide = fs.readFileSync(process.argv[4]).toString('utf-8').split(EOL);
	data = dataToWhite(data);
	let hider;
	toHide = trimHider(toHide);
	fs.writeFileSync('secret',hide(toHide,data));
}


let locate = (data) => {
	let output = Buffer.from([]);
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
		if(character) output = Buffer.concat([output,Buffer.from([(parseInt([...character].reverse().map(m=>m ==='\t'?'0':'1').join(''),2))])]);
	});
	return output;
}

let hide = (data,secret)=>{
	return data = data.map((d,i)=>{
		return d + (secret[i]?secret[i]:'');
	}).join(EOL);
}

let padBinary = bin=>{
	while(bin.length < 8){
		bin = '0'+bin;
	}
	return bin;
}



let trimHider = hider =>{
	return hider.map(l=>{
		return trimLine(l);
	});
}


let trimLine = line=>{
	line = [...line];
	let newLine = []
	let foundEnd = false;
	for(let i = line.length-1;i>=0;i--){
		if((line[i] === ' ' || line[i] === '\t') && !foundEnd)
			continue;
		else foundEnd = true;
		newLine.push( line[i]);
	}
	return newLine.reverse().join('');


}




let dataToWhite = data=>{
	return [...data].map(m=>{
		return [...padBinary(m.charCodeAt(0).toString(2))].map(b=>{
			return (b === '0')?'\t':' ';
		}).join('');
	});

}

let usage = ()=>{
	console.log('Must be passed a source file to encode and a file to hide it in.');
}
init();
