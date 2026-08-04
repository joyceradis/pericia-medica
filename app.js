
const STEPS = ["Elegibilidade","Descrição","AIPE 1","AIPE 2","AIPE 3","AIPE 4","Síntese"];

const Q1 = [
 {key:"visual",title:"Nível de comprovação",question:"Até que ponto se vê ou se percebe a alteração da imagem da pessoa?",options:["Não se vê ou praticamente não se vê","Vê-se","Vê-se claramente"]},
 {key:"gaze",title:"Tendência do olhar",question:"O olhar ou os outros sentidos tendem a se fixar especificamente nessa alteração?",options:["Não tende a fixar o olhar ou os outros sentidos","Tende a se fixar ou fixa","Tende a evitar o olhar"]},
 {key:"memory",title:"Lembrança da imagem",question:"Ao lembrar da pessoa, ela é descrita a partir da alteração da imagem?",options:["Não se lembra","Lembra","Protagoniza a lembrança e serve para descrever e identificar"]},
 {key:"emotion",title:"Emoção provocada",question:"A pessoa lesionada provoca algum tipo de emoção, como tristeza ou emoção semelhante?",options:["Não provoca resposta emocional","Provoca ligeira resposta emocional","Provoca resposta emocional intensa"]},
 {key:"relation",title:"Possível alteração relacional",question:"Se fôssemos familiares ou pessoas próximas, a imagem poderia afetar nossa relação com ela?",options:["Não","Sim, mas não muito","Sim, muito"]}
];

const CATEGORIES = [
 {id:"none",label:"Não relevante",range:[0,0],profile:{visual:0}},
 {id:"light",label:"Leve",range:[1,6],profile:{visual:1,gaze:0}},
 {id:"moderate",label:"Moderado",range:[7,12],profile:{visual:2,gaze:1,memory:0}},
 {id:"medium",label:"Médio",range:[13,18],profile:{visual:2,gaze:2,memory:1,emotion:0}},
 {id:"important",label:"Importante",range:[19,24],profile:{visual:2,gaze:2,memory:2,emotion:1,relation:0}},
 {id:"veryImportant",label:"Bastante importante",range:[25,30],profile:{visual:2,gaze:2,memory:2,emotion:2,relation:1}},
 {id:"extreme",label:"Importantíssimo",range:[31,50],profile:{visual:2,gaze:2,memory:2,emotion:2,relation:2}}
];

const Q3 = {
 light:{question:"Vê-se ou identifica-se quando se olha, ou ainda se percebe por outro sentido?",levels:[
  ["Muito pouco","1 ponto"],["Um pouco","2 pontos"],["Moderado","3 a 4 pontos"],["Severo","5 pontos"],["Muito intenso","6 pontos"]]},
 moderate:{question:"Uma vez percebida a alteração da imagem, tende-se a fixar nela e a lembrar?",levels:[
  ["Muito pouco","7 pontos"],["Um pouco","8 pontos"],["Moderado","9 a 10 pontos"],["Severo","11 pontos"],["Muito intenso","12 pontos"]]},
 medium:{question:"A alteração da imagem do corpo é parte da descrição da pessoa porque protagoniza seu aspecto?",levels:[
  ["Muito pouco","13 pontos"],["Um pouco","14 pontos"],["Moderado","15 a 16 pontos"],["Severo","17 pontos"],["Muito intenso","18 pontos"]]},
 important:{question:"A alteração da imagem provoca reações emocionais?",levels:[
  ["Muito pouco","19 pontos"],["Um pouco","20 pontos"],["Moderado","21 a 22 pontos"],["Severo","23 pontos"],["Muito intenso","24 pontos"]]},
 veryImportant:{question:"O nível de emoção provocado poderia afetar superficialmente a relação?",levels:[
  ["Muito pouco","25 pontos"],["Um pouco","26 pontos"],["Moderado","27 a 28 pontos"],["Severo","29 pontos"],["Muito intenso","30 pontos"]]},
 extreme:{question:"Se eu tivesse que conviver com essa pessoa, a deformidade afetaria profundamente a minha relação com ela?",levels:[
  ["Muito pouco","31 a 32 pontos"],["Um pouco","33 a 35 pontos"],["Moderado","36 a 40 pontos"],["Severo","41 a 48 pontos"],["Muito intenso","49 a 50 pontos"]]}
};

const Q4 = [
 ["communication","Focos da relação com a comunicação","Objetivos visuais convencionais em diálogo direto: rosto, especialmente olhos e boca, e mãos como complemento da expressão oral."],
 ["sexual","Focos de atenção na relação sexual","Zonas sexuais primárias e secundárias e mãos, no aspecto visual, de contato ou de uso sexual."],
 ["transient","Focos transitórios especiais","Partes habitualmente não expostas, mas visíveis em situações específicas, como banho de sol ou traje de banho."],
 ["work","Focos de especial transcendência no trabalho","Dependem da atividade profissional e da exposição específica da região."],
 ["other","Outros focos especiais","Outros contextos relevantes não abrangidos acima."]
];

let current = 0;
let state = {
 eligibility:{damage:false,nexus:false,consolidated:false,permanent:false,visible:false},
 description:{location:"",dimensions:"",morphology:"",dynamic:"",previous:"",repair:"",subjective:"",observation:""},
 aipe:{q1:{},category:"",categoryRationale:"",impactLevel:"",score:"",contexts:{},adjustment:"",adjustmentRationale:"",finalScore:""}
};

function getPath(obj,path){return path.split(".").reduce((o,k)=>o?.[k],obj)}
function setPath(obj,path,val){const parts=path.split(".");let o=obj;parts.slice(0,-1).forEach(k=>o=o[k]??=( {} ));o[parts.at(-1)]=val}
function esc(s=""){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

function renderNav(){
 const nav=document.getElementById("stepNav");
 nav.innerHTML=STEPS.map((s,i)=>`<button class="step-link ${i===current?"active":""}" data-go="${i}"><span class="num">${i+1}</span><span>${s}</span></button>`).join("");
 nav.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(Number(b.dataset.go)));
}
function go(n){
 syncForm();
 current=Math.max(0,Math.min(STEPS.length-1,n));
 document.querySelectorAll(".screen").forEach(s=>s.classList.toggle("active",Number(s.dataset.step)===current));
 renderNav();
 document.getElementById("progressBar").style.width=`${(current/(STEPS.length-1))*100}%`;
 document.getElementById("prevBtn").disabled=current===0;
 document.getElementById("nextBtn").textContent=current===STEPS.length-1?"Revisar":"Próximo";
 if(current===3) renderQ2();
 if(current===4) renderQ3();
 if(current===5) renderQ4();
 if(current===6) renderSummary();
 window.scrollTo({top:0,behavior:"smooth"});
}
function syncForm(){
 document.querySelectorAll("[data-path]").forEach(el=>{
  const path=el.dataset.path;
  if(el.type==="checkbox") setPath(state,path,el.checked);
  else setPath(state,path,el.value);
 });
 const adj=document.querySelector('input[name="adjustment"]:checked');
 if(adj) state.aipe.adjustment=adj.value;
}
function bindForm(){
 document.querySelectorAll("[data-path]").forEach(el=>{
  const v=getPath(state,el.dataset.path);
  if(el.type==="checkbox") el.checked=Boolean(v); else el.value=v??"";
  el.addEventListener("input",()=>{syncForm();updateEligibility()});
 });
}
function updateEligibility(){
 const vals=Object.values(state.eligibility);
 document.getElementById("eligibilityWarning").className=`notice ${vals.every(Boolean)?"success":"warning"}`;
 document.getElementById("eligibilityWarning").textContent=vals.every(Boolean)
  ?"Pré-requisitos registrados como presentes."
  :"Há pré-requisitos não confirmados. A valoração permanente deve ser interpretada com cautela.";
}
function renderQ1(){
 const c=document.getElementById("q1Container");
 c.innerHTML=Q1.map((q,idx)=>`<div class="question-block">
  <div class="question-title">${idx+1}. ${q.title}</div>
  <div class="question-help">${q.question}</div>
  <div class="option-list">${q.options.map((o,i)=>`<label class="option"><input type="radio" name="q1_${q.key}" value="${i}" ${Number(state.aipe.q1[q.key])===i?"checked":""}>${o}</label>`).join("")}</div>
 </div>`).join("");
 c.querySelectorAll("input").forEach(el=>el.onchange=()=>{state.aipe.q1[el.name.replace("q1_","")]=Number(el.value)});
}
function compatibility(cat){
 const entries=Object.entries(cat.profile);
 const answered=entries.filter(([k])=>state.aipe.q1[k]!==undefined);
 const matches=answered.filter(([k,v])=>state.aipe.q1[k]===v).length;
 return {matches,total:entries.length,ratio:entries.length?matches/entries.length:0};
}
function renderQ2(){
 const head=["Categoria / pontos","Comprovação visual","Tendência do olhar","Lembrança","Emoção","Relação interpessoal","Compatibilidade"];
 const t=document.getElementById("q2Table");
 t.innerHTML=`<thead><tr>${head.map(x=>`<th>${x}</th>`).join("")}</tr></thead><tbody>`+
 CATEGORIES.map(cat=>{
  const comp=compatibility(cat);
  const vals=["visual","gaze","memory","emotion","relation"].map(k=>{
   if(cat.profile[k]===undefined)return "<td>—</td>";
   const chosen=state.aipe.q1[k];
   const isMatch=chosen===cat.profile[k];
   return `<td class="${isMatch?"cell-match":""}">${Q1.find(q=>q.key===k).options[cat.profile[k]]}</td>`;
  }).join("");
  return `<tr class="${comp.ratio===1?"compatible":""}"><td><b>${cat.label}</b><br>${cat.range[0]===cat.range[1]?cat.range[0]:cat.range.join("–")} pontos</td>${vals}<td><span class="score-chip">${comp.matches}/${comp.total}</span></td></tr>`;
 }).join("")+"</tbody>";

 const scores=CATEGORIES.map(c=>({...c,...compatibility(c)}));
 const exact=scores.filter(x=>x.ratio===1);
 document.getElementById("profileSummary").innerHTML=exact.length
  ? `<div class="notice success">Linhas integralmente compatíveis com as respostas registradas: <b>${exact.map(x=>x.label).join(", ")}</b>. A categoria ainda deve ser confirmada pelo perito.</div>`
  : `<div class="notice warning">Nenhuma linha foi integralmente satisfeita. Trata-se de perfil não linear. Revise as respostas e fundamente expressamente a categoria adotada.</div>`;
 document.getElementById("profileSummary").innerHTML+=`<div class="profile-bars">${
  scores.map(s=>`<div class="profile-row"><span>${s.label}</span><div class="bar"><span style="width:${s.ratio*100}%"></span></div><b>${Math.round(s.ratio*100)}%</b></div>`).join("")
 }</div><p class="lead">Os percentuais acima são apenas visualização de compatibilidade interna do formulário; não constituem escore validado do AIPE.</p>`;

 const opts=document.getElementById("categoryOptions");
 opts.className="category-list";
 opts.innerHTML=CATEGORIES.map(c=>`<label class="category-card ${state.aipe.category===c.id?"selected":""}"><input type="radio" name="category" value="${c.id}" ${state.aipe.category===c.id?"checked":""}><span><b>${c.label}</b><small>${c.range[0]===c.range[1]?c.range[0]:c.range.join("–")} pontos</small></span></label>`).join("");
 opts.querySelectorAll("input").forEach(el=>el.onchange=()=>{
  state.aipe.category=el.value;state.aipe.impactLevel="";state.aipe.score="";state.aipe.finalScore="";
  renderQ2();
 });
 document.getElementById("categoryRationale").value=state.aipe.categoryRationale||"";
}

function rangeValues(text){
 const nums=[...text.matchAll(/\d+/g)].map(m=>Number(m[0]));
 return nums.length===1?[nums[0],nums[0]]:[nums[0],nums[1]];
}
function renderQ3(){
 const box=document.getElementById("q3Content");
 const cat=CATEGORIES.find(c=>c.id===state.aipe.category);
 if(!cat){box.innerHTML='<div class="notice warning">Retorne ao Quadro 2 e escolha a categoria.</div>';return}
 if(cat.id==="none"){
  state.aipe.impactLevel="Não aplicável";state.aipe.score=0;
  box.innerHTML='<div class="notice success"><b>Não relevante:</b> pontuação 0.</div>';return
 }
 const q=Q3[cat.id];
 box.innerHTML=`<div class="notice info"><b>Categoria: ${cat.label} (${cat.range.join("–")} pontos)</b><br>${q.question}</div>
 <div class="q3-grid">${q.levels.map(([name,pts],i)=>`<label class="q3-option ${state.aipe.impactLevel===name?"selected":""}"><input type="radio" name="impact" value="${name}" data-points="${pts}" ${state.aipe.impactLevel===name?"checked":""}><b>${name}</b><small>${pts}</small></label>`).join("")}</div>
 <div id="scoreChoice"></div>`;
 box.querySelectorAll('input[name="impact"]').forEach(el=>el.onchange=()=>{
  state.aipe.impactLevel=el.value;
  const [min,max]=rangeValues(el.dataset.points);
  if(min===max) state.aipe.score=min;
  else if(!(Number(state.aipe.score)>=min&&Number(state.aipe.score)<=max)) state.aipe.score=min;
  renderQ3();
 });
 const selected=q.levels.find(x=>x[0]===state.aipe.impactLevel);
 if(selected){
  const [min,max]=rangeValues(selected[1]);
  document.getElementById("scoreChoice").innerHTML=min===max
   ? `<div class="notice success">Pontuação definida: <b>${min}</b>.</div>`
   : `<label style="margin-top:14px">Escolha o ponto dentro do intervalo ${min}–${max}<input type="number" min="${min}" max="${max}" id="scoreInput" value="${state.aipe.score||min}"></label>`;
  const input=document.getElementById("scoreInput");
  if(input) input.oninput=()=>state.aipe.score=Number(input.value);
 }
}
function renderQ4(){
 const c=document.getElementById("q4Container");
 c.innerHTML=Q4.map(([key,title,desc])=>`<div class="context-row"><b>${title}</b><p class="question-help">${desc}</p><div class="context-options">
  ${[["none","Não se percebe ou praticamente não"],["perceived","Percebe-se"],["clear","Percebe-se claramente"],["na","Não aplicável"]].map(([v,l])=>`<label><input type="radio" name="ctx_${key}" value="${v}" ${state.aipe.contexts[key]===v?"checked":""}>${l}</label>`).join("")}
 </div></div>`).join("");
 c.querySelectorAll("input").forEach(el=>el.onchange=()=>state.aipe.contexts[el.name.replace("ctx_","")]=el.value);
 document.querySelectorAll('input[name="adjustment"]').forEach(el=>el.checked=state.aipe.adjustment===el.value);
 document.getElementById("finalScore").value=state.aipe.finalScore!==""?state.aipe.finalScore:state.aipe.score;
 if(state.aipe.finalScore==="")state.aipe.finalScore=state.aipe.score;
}
function contextLabel(v){return {none:"não se percebe ou praticamente não",perceived:"percebe-se",clear:"percebe-se claramente",na:"não aplicável"}[v]||"não registrado"}
function renderSummary(){
 syncForm();
 const cat=CATEGORIES.find(c=>c.id===state.aipe.category);
 const pending=[];
 if(!Object.values(state.eligibility).every(Boolean))pending.push("Há pré-requisitos médico-legais não confirmados.");
 if(Q1.some(q=>state.aipe.q1[q.key]===undefined))pending.push("Quadro 1 incompleto.");
 if(!cat)pending.push("Categoria do Quadro 2 não definida.");
 if(cat&&cat.id!=="none"&&!state.aipe.impactLevel)pending.push("Nível de impacto do Quadro 3 não definido.");
 if(!state.aipe.categoryRationale)pending.push("Categoria sem fundamentação textual.");
 if(!state.aipe.adjustment)pending.push("Efeito dos critérios complementares não definido.");
 document.getElementById("validationBox").innerHTML=pending.length
  ? `<div class="notice warning"><b>Pendências:</b><br>${pending.map(x=>"• "+x).join("<br>")}</div>`
  : `<div class="notice success">Preenchimento estrutural completo. Revise o conteúdo clínico antes do uso pericial.</div>`;

 const q1lines=Q1.map(q=>`${q.title}: ${state.aipe.q1[q.key]===undefined?"não respondido":q.options[state.aipe.q1[q.key]]}`).join("\n");
 const ctx=Q4.map(([k,t])=>`${t}: ${contextLabel(state.aipe.contexts[k])}`).join("\n");
 const adj={decrease:"diminuir",maintain:"manter",increase:"aumentar"}[state.aipe.adjustment]||"não definido";
 const txt=`AVALIAÇÃO GUIADA DO PREJUÍZO ESTÉTICO — AIPE

1. PRÉ-REQUISITOS
Existência do dano: ${state.eligibility.damage?"confirmada":"não confirmada"}
Nexo causal: ${state.eligibility.nexus?"confirmado":"não confirmado"}
Consolidação médico-legal: ${state.eligibility.consolidated?"confirmada":"não confirmada"}
Permanência: ${state.eligibility.permanent?"confirmada":"não confirmada"}
Alteração perceptível: ${state.eligibility.visible?"confirmada":"não confirmada"}

2. DESCRIÇÃO TÉCNICA
Localização: ${state.description.location||"não registrada"}
Dimensões/extensão: ${state.description.dimensions||"não registradas"}
Morfologia: ${state.description.morphology||"não registrada"}
Componente dinâmico: ${state.description.dynamic||"não registrado"}
Estado anterior/comparação: ${state.description.previous||"não registrado"}
Possibilidade de reparação: ${state.description.repair||"não registrada"}
Repercussão referida: ${state.description.subjective||"não registrada"}
Condições de observação: ${state.description.observation||"não registradas"}

3. QUADRO AIPE/BRASIL 1
${q1lines}

4. QUADRO AIPE/BRASIL 2
Categoria adotada: ${cat?cat.label+" ("+(cat.range[0]===cat.range[1]?cat.range[0]:cat.range.join("–"))+" pontos)":"não definida"}
Fundamentação: ${state.aipe.categoryRationale||"não registrada"}

5. QUADRO AIPE/BRASIL 3
Nível de impacto: ${state.aipe.impactLevel||"não definido"}
Pontuação inicial: ${state.aipe.score!==""?state.aipe.score:"não definida"}

6. QUADRO AIPE/BRASIL 4
${ctx}
Decisão complementar: ${adj}
Fundamentação: ${state.aipe.adjustmentRationale||"não registrada"}
Pontuação final: ${state.aipe.finalScore!==""?state.aipe.finalScore:"não definida"}

OBSERVAÇÃO METODOLÓGICA
O resultado numérico deve ser interpretado em conjunto com o exame objetivo, a descrição pormenorizada, o estado anterior, o nexo causal, a consolidação médico-legal e a individualização do caso.`;
 document.getElementById("summaryText").textContent=txt;
}
function save(){syncForm();localStorage.setItem("aipe_mvp_state",JSON.stringify(state));alert("Avaliação salva neste navegador.")}
function load(){const s=localStorage.getItem("aipe_mvp_state");if(!s)return alert("Nenhum registro salvo.");state=JSON.parse(s);bindForm();renderQ1();go(current)}
function reset(){if(!confirm("Limpar todos os dados?"))return;localStorage.removeItem("aipe_mvp_state");location.reload()}
function downloadJSON(){syncForm();const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="avaliacao-aipe.json";a.click();URL.revokeObjectURL(a.href)}

document.getElementById("prevBtn").onclick=()=>go(current-1);
document.getElementById("nextBtn").onclick=()=>current===STEPS.length-1?go(0):go(current+1);
document.getElementById("btnSave").onclick=save;
document.getElementById("btnLoad").onclick=load;
document.getElementById("btnReset").onclick=reset;
document.getElementById("btnCopy").onclick=()=>navigator.clipboard.writeText(document.getElementById("summaryText").textContent).then(()=>alert("Síntese copiada."));
document.getElementById("btnPrint").onclick=()=>window.print();
document.getElementById("btnJSON").onclick=downloadJSON;

renderQ1();renderNav();bindForm();updateEligibility();go(0);
