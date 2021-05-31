const navslide=()=>{
	const burger=document.querySelector('.burger');
	const linki=document.querySelector('.links');
	const navlinks=document.querySelectorAll('.links li');
	burger.addEventListener('click',()=>{
     linki.classList.toggle('nav-active');
	
	navlinks.forEach((link,index)=>{
		if(link.style.animation){
			link.style.animation='';
		}
		else{
			link.style.animation=`navLinkFade 0.5s ease forwards ${index/7+0.3}s`;
		}
	});
	burger.classList.toggle('toggle');
	});
}
navslide();