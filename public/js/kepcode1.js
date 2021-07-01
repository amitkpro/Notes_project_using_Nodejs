const addButton=document.querySelector('#add');
const plus=document.querySelector('#plus');
var i = 0;
//const mode=document.getElementById('mode');
const updatelsData=()=>{
	const textAreaData=document.querySelectorAll('textarea');
	const notes=[];
	textAreaData.forEach((note)=>{
		return notes.push(note.value);
	})
	//const textAreaData1=document.querySelectorAll('.title');
	//const head=[];
	/*textAreaData1.forEach((el)=>{
		return notes.push(el.value);
	})*/
	localStorage.setItem('notes',JSON.stringify(notes));
}


/*const updatelsData1=()=>{
	const textAreaData1=document.querySelectorAll('.title');
	const head=[];
	textAreaData1.forEach((el)=>{
		return head.push(el.value);
	})
	localStorage.setItem('head',JSON.stringify(head));
}*/

const addNewNote=(text=' ')=>{
    i = i+1 ;
    if( i < 7){
	const note=document.createElement('div');
	note.classList.add('note');
	const htmlData=`<div class="operation">
	               
	               <button class="max"><i class="fas fa-search-plus"></i></button>
	               <button class="close"><i class="fas fa-compress-arrows-alt"></i></button>
	               <button class="leaf"><i class="fa fa-leaf"></i></button>
	               </div>
	               
	               
	               <h3  class="title${text?" ":"hidden"}"  > YOUR Content:  </h3>
	               <div class="main${text?" ":"hidden"}"></div>
	               <textarea class="${text?"hidden":" "}"></textarea>
	               <hr >
	               <div class="operation">
	               <button class="edit"><i class="fas fa-pencil" aria-hidden="true"></i></button>
	               <button class="delete"><i class="fa fa-trash" aria-hidden="true"></i></button>
	               </div>
	               </div>`;
	note.insertAdjacentHTML('afterbegin',htmlData);
	let max=note.querySelector('.max');
	let close=note.querySelector('.close');
	const editButton=note.querySelector('.edit');
	const delButton= note.querySelector('.delete');
	const col=note.querySelector('.leaf');
	const mainDiv=note.querySelector('.main');
	const textArea=note.querySelector('textarea');
	const titl=note.querySelector('.title');
	textArea.textContent=text;
	mainDiv.innerText=text;
	editButton.addEventListener('click',()=>{
		mainDiv.classList.toggle('hidden');
		textArea.classList.toggle('hidden');
		titl.classList.toggle('hidden');
	})
	delButton.addEventListener('click',()=>{
		note.remove();
		updatelsData();
		//updatelsData1();
	})
	col.addEventListener('click',()=>{
		const colors=['#cc9b6d','#d5ecc2','#4b778d','#f8a1d1','#f8a1d1','#f0e4d7','#f0e4d7','#f6dfeb','#ffc93c','#dbf6e9','#fefecc'];
		let i=Math.floor(Math.random()*colors.length-1);
		note.style.backgroundColor=colors[i];
	})   
    max.addEventListener('click',()=>{
    	note.classList.toggle('note1');
    })
   close.addEventListener('click',()=>{
    	note.classList.toggle('note2');
    })
	textArea.addEventListener('change',(event)=>{
		const value=event.target.value;
		mainDiv.innerText=value;
		updatelsData();
	
	})           
	/*titl.addEventListener('change',()=>{
		updatelsData1();
	})*/           
	document.body.appendChild(note);
    } else{
        alert( ' You have to login for add more notes ')
        
        }
}
const notes=JSON.parse(localStorage.getItem('notes'));
//const head=JSON.parse(localStorage.getItem('head'));
if(notes){
	
	
		//notes.forEach((note)=>addNewNote(note,head));
	    
	    notes.forEach((note)=>{
  
          addNewNote(note)});
}
/*if(head){
	
	
		//notes.forEach((note)=>addNewNote(note,head));
	    
	    head.forEach((hval)=>{
  
          addNewNote(hval)});
}*/
/*const colormode=()=>{
if(mode.textContent==='Dark-mode')
{
 document.body.style.backgroundColor="black";
 mode.innerHTML="Light-mode";	
}
else{
 document.body.style.backgroundColor="#f4f7f8";
 mode.innerHTML="Dark-mode";		
}
}
mode.addEventListener('click',()=>colormode());*/
plus.addEventListener('click',()=>addNewNote());
addButton.addEventListener('click',()=>addNewNote());
const search=document.querySelector('#search-txt');
const searching=document.querySelector('.search-box');
const micro=document.querySelector('#micro');
var SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
var recognition= new SpeechRecognition();
recognition.onstart=function(){
	alert('---Start Speaking Press enter to search---');
	console.log('start speaking');
} 
recognition.onresult=function(event){
	var resulttext=event.results[0][0].transcript;
	console.log(resulttext);
	//search.textContent=resulttext;
	search.value=resulttext;
}
micro.addEventListener('click',function(){
	recognition.start();
})
search.addEventListener('keypress',function(e){
 if (e.keyCode === 13){	
let inputval=search.value;
let val=document.getElementsByClassName('note');
Array.from(val).forEach(function(element){
	let txt=element.getElementsByClassName('main')[0].innerText;
	if(txt.includes(inputval)){
     element.style.display="block";
	}
	else{
     element.style.display="none";
	}
})
}
});