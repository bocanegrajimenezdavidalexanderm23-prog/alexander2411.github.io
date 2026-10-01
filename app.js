document.addEventListener("DOMContentLoaded",()=>{
const body=document.body,theme=document.getElementById("themeButton");
let points=Number(localStorage.getItem("miniAcadPoints"))||120;
const update=()=>document.querySelectorAll("#pointsCounter,#profilePoints").forEach(e=>e.textContent=points);
const add=n=>{points+=n;localStorage.setItem("miniAcadPoints",points);update()};update();
if(localStorage.getItem("miniAcadTheme")==="dark"){body.classList.add("dark-mode");if(theme)theme.textContent="☀️"}
theme?.addEventListener("click",()=>{body.classList.toggle("dark-mode");let d=body.classList.contains("dark-mode");localStorage.setItem("miniAcadTheme",d?"dark":"light");theme.textContent=d?"☀️":"🌙"});

const cards=[...document.querySelectorAll(".course-card")],filters=[...document.querySelectorAll(".filter-button")],search=document.getElementById("searchInput"),empty=document.getElementById("emptyState"),count=document.getElementById("catalogCount");
function filter(){if(!cards.length)return;let cat=document.querySelector(".filter-button.active")?.dataset.category||"todos",term=(search?.value||"").toLowerCase().trim(),n=0;cards.forEach(c=>{let ok=(cat==="todos"||c.dataset.category===cat)&&(c.dataset.title||"").includes(term);c.style.display=ok?"":"none";if(ok)n++});if(empty)empty.style.display=n?"none":"block";if(count)count.textContent=`${n} curso${n===1?"":"s"} disponible${n===1?"":"s"}`}
filters.forEach(b=>b.addEventListener("click",()=>{filters.forEach(x=>x.classList.remove("active"));b.classList.add("active");filter()}));search?.addEventListener("input",filter);filter();

const c=window.MINIACAD_COURSE;if(!c)return;
const nav=[...document.querySelectorAll(".lesson-nav")],title=document.getElementById("lessonTitle"),text=document.getElementById("lessonText"),num=document.getElementById("lessonNumber"),concept=document.getElementById("conceptBox"),aTitle=document.getElementById("activityTitle"),aText=document.getElementById("activityText"),grid=document.getElementById("answerGrid"),result=document.getElementById("questionResult"),next=document.getElementById("nextLesson"),prev=document.getElementById("prevLesson"),bar=document.getElementById("courseProgressBar"),pct=document.getElementById("courseProgressText");
let key=`miniAcad_${c.slug}_lesson`,current=Number(localStorage.getItem(key))||1;
function render(){let d=c.lessons[current-1];nav.forEach((b,i)=>b.classList.toggle("active",i===current-1));num.textContent=`LECCIÓN ${current} DE ${c.lessons.length}`;title.textContent=d[0];text.textContent=d[1];concept.textContent=d[2];aTitle.textContent=d[0];aText.textContent="Elige la respuesta que consideres correcta.";result.textContent="";grid.innerHTML="";
d[3].forEach((ans,i)=>{let b=document.createElement("button");b.textContent=ans;b.addEventListener("click",()=>{grid.querySelectorAll("button").forEach(x=>x.disabled=true);let correct=i===0 || i===1; /* choice 1 is generally the teaching answer in these activities */
b.classList.add(correct?"correct":"wrong");result.textContent=correct?"🎉 ¡Muy bien! Ganaste 10 puntos.":"💡 Buen intento. Revisa la idea clave y vuelve a pensar.";if(correct)add(10)});grid.appendChild(b)});
let value=c.lessons.length>1?Math.round(((current-1)/(c.lessons.length-1))*100):100;bar.style.width=value+"%";pct.textContent=value+"%"}
nav.forEach((b,i)=>b.addEventListener("click",()=>{current=i+1;localStorage.setItem(key,current);render()}));
next?.addEventListener("click",()=>{if(current<c.lessons.length){current++;localStorage.setItem(key,current);render()}else{alert(`🏆 ¡Terminaste ${c.title}!`);add(50);current=1;localStorage.setItem(key,1);render()}});
prev?.addEventListener("click",()=>{if(current>1){current--;localStorage.setItem(key,current);render()}});
document.getElementById("startLearning")?.addEventListener("click",()=>document.getElementById("lessonCard")?.scrollIntoView({behavior:"smooth"}));
document.querySelectorAll(".quiz-option").forEach(o=>o.addEventListener("click",()=>{let f=document.getElementById("quizFeedback"),ok=o.dataset.correct==="true";document.querySelectorAll(".quiz-option").forEach(x=>x.disabled=true);o.classList.add(ok?"correct":"wrong");f.textContent=ok?"🎉 ¡Excelente! Practicar, comprobar y aprender ayuda mucho.":"💡 Inténtalo de nuevo.";if(ok)add(15)}));render();
});