const btn=document.getElementById('btncall');
const modal=document.getElementById('modal');
//const close=document.querySelector('.close');
btn.addEventListener('click',function(){
modal.style.display="block";
});
/*close.addEventListener('click',function(){
modal.style.display="none";
});*/
window.addEventListener('click',function(event){
if(event.target==modal)
{
	modal.style.display="none";
}
});