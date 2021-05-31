const addButton=document.querySelector('#add');
//const mode=document.getElementById('mode');
const updatelsData=()=>{
	const textAreaData=document.querySelectorAll('textarea');
	const notes=[];
	textAreaData.forEach((note)=>{
		return notes.push(note.value);
	})
	localStorage.setItem('notes',JSON.stringify(notes));
}

const addNewNote=(text=' ' )=>{
	const note=document.createElement('div');
	note.classList.add('note');
	const htmlData=`<div class="operation">
	               <button class="edit"><i class="fa fa-pencil" aria-hidden="true"></i></button>
	               <button class="delete"><i class="fa fa-trash" aria-hidden="true"></i></button>
	               <button class="leaf"><i class="fa fa-leaf"></i></button>
	               </div>
	               <div class="main${text?" ":"hidden"}"></div>
	               <textarea class="${text?"hidden":" "}"></textarea>
	               </div>`;
	note.insertAdjacentHTML('afterbegin',htmlData);
	const editButton=note.querySelector('.edit');
	const delButton= note.querySelector('.delete');
	const col=note.querySelector('.leaf');
	const mainDiv=note.querySelector('.main');
	const textArea=note.querySelector('textarea');
	textArea.textContent=text;
	mainDiv.innerHTML=text;
	editButton.addEventListener('click',()=>{
		mainDiv.classList.toggle('hidden');
		textArea.classList.toggle('hidden');
	})
	delButton.addEventListener('click',()=>{
		note.remove();
		updatelsData();
	})
	col.addEventListener('click',()=>{
		const colors=['#cc9b6d','#d5ecc2','#4b778d','#f8a1d1','#f8a1d1','#f0e4d7','#f0e4d7','#f6dfeb','#ffc93c','#dbf6e9','#fefecc'];
		let i=Math.floor(Math.random()*colors.length-1);
		note.style.backgroundColor=colors[i];
	})   

	textArea.addEventListener('change',(event)=>{
		const value=event.target.value;
		mainDiv.innerHTML=value;
		updatelsData();
	})           
	document.body.appendChild(note);
}
const notes=JSON.parse(localStorage.getItem('notes'));
if(notes){
	notes.forEach((note)=>addNewNote(note))
}
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
addButton.addEventListener('click',()=>addNewNote());
const search=document.getElementById('search-txt');
search.addEventListener('input',function(){
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
});