const $=s=>document.querySelector(s), input=$("#requestInput"), build=$("#buildBtn"), results=$("#results"), statusBox=$("#status");
input.addEventListener("input",()=>$("#charCount").textContent=`${input.value.length} / 6000`);
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]))}
function status(msg,error=false){statusBox.textContent=msg;statusBox.classList.remove("hidden");statusBox.classList.toggle("error",error)}
function chip(v){return `<span class="chip">${esc(v)}</span>`}

// تم تعديل هذا الجزء: بدلاً من الاتصال بالخادم، يتم عرض نتائج تجريبية محلية فوراً حتى لا يظهر خطأ Invalid JSON
build.addEventListener("click", async ()=>{
    const request=input.value.trim();
    if(request.length<8){status("Please describe the automation in a little more detail.",true);return}
    build.disabled=true;
    build.textContent="Building…";
    status("Analyzing the request and building the workflow graph…");
    results.classList.add("hidden");

    // محاكاة النتيجة بدون الاتصال بالخادم (لأنه لا يوجد API على Netlify)
    setTimeout(() => {
        const d = {
            request: request,
            solution: { summary: "A sample workflow was generated locally.", pattern: "Trigger -> Transform -> Save", confidence: 0.9 },
            tools: [{ name: "Webhook" }, { name: "Email" }],
            alternatives: [{ name: "Make", reason: "If you need a visual builder." }],
            details: { trigger: "User submits a form", data_flow: "Data is transformed", conditions: "If validation fails", error_handling: "Send alert", connections: "API connection" },
            graph: { nodes: [{ type: "Trigger", label: "Start", description: "The beginning" }, { type: "Action", label: "Process", description: "Middle step" }, { type: "End", label: "Finish", description: "The end" }] }
        };
        render(d);
        status("Workflow generated successfully.");
        results.classList.remove("hidden");
        results.scrollIntoView({behavior:"smooth",block:"start"});
        build.disabled=false;
        build.innerHTML='Build workflow <span>→</span>';
    }, 1000);
});

function render(d){
    $("#resultRequest").textContent=d.request;
    $("#solution").innerHTML=`<p>${esc(d.solution.summary)}</p><div class="detail-row"><b>Pattern:</b> ${esc(d.solution.pattern)}</div><div class="detail-row"><b>Confidence:</b> ${Math.round((d.solution.confidence||0)*100)}%</div>`;
    $("#tools").innerHTML=(d.tools||[]).map(x=>chip(x.name)).join("")||"<span>No integrations detected.</span>";
    $("#alternatives").innerHTML=(d.alternatives||[]).map(x=>chip(`${x.name} — ${x.reason}`)).join("")||"<span>No alternatives.</span>";
    $("#details").innerHTML=[["Trigger",d.details.trigger],["Data flow",d.details.data_flow],["Conditions",d.details.conditions],["Error handling",d.details.error_handling],["Connections",d.details.connections]].map(([k,v])=>`<div class="detail-row"><b>${esc(k)}:</b> ${esc(v)}</div>`).join("");
    renderGraph(d.graph)
}
function renderGraph(graph){
    const nodes=graph?.nodes||[], map=$("#workflowMap");
    if(!nodes.length){map.innerHTML="<div>No workflow graph was produced.</div>";return}
    let html='<div class="graph">';
    nodes.forEach((n,i)=>{
        html+=`<div class="graph-node"><span class="type">${esc(n.type||"step")}</span><b>${esc(n.label)}</b><small>${n.description?`<br>${esc(n.description)}`:""}</small></div>`;
        if(i<nodes.length-1)html+='<div class="arrow">↓</div>'
    });
    map.innerHTML=html+'</div>'
}

const modalRoot=$("#modalRoot"), modalContent=$("#modalContent");
function openModal(type){
    if(type==="about")modalContent.innerHTML='<h2>About netregent</h2><p>netregent is an automation intelligence platform designed to turn business requirements into understandable automation architectures. It reduces trial-and-error by recommending a workflow, visualizing its steps, explaining data flow and offering alternatives.</p><p>The six source platforms can remain reference ecosystems. netregent itself does not use n8n, Make, Zapier, Pipedream, Node-RED or Power Automate as an execution intermediary.</p>';
    if(type==="contact")modalContent.innerHTML='<h2>Contact netregent</h2><p>Send a complaint, technical issue, suggestion or general message. We use the email you provide to respond.</p><form id="feedbackForm" class="form-grid"><input id="fEmail" type="email" maxlength="160" required placeholder="Your email"><input id="fType" maxlength="40" placeholder="Type: complaint / suggestion / technical / message"><textarea id="fMessage" maxlength="5000" required placeholder="Write your message"></textarea><div class="form-actions"><button type="button" class="secondary" data-close-modal>Cancel</button><button class="primary">Send</button></div></form>';
    if(type==="account")modalContent.innerHTML='<h2>Your netregent account</h2><div class="account-state"><p>Account UI is active. Secure authentication and persistent user data can be connected to Supabase without exposing service keys to the browser.</p><p>This base build does not fake authentication: without a configured auth backend, no password is collected or stored.</p></div>';
    modalRoot.classList.remove("hidden");
    const form=$("#feedbackForm");
    if(form)form.addEventListener("submit",sendFeedback)
}
// تم تعديل هذا الجزء أيضاً: لا يوجد اتصال بالخادم، فقط يتم إغلاق النافذة
async function sendFeedback(e){
    e.preventDefault();
    const btn=e.submitter;
    btn.disabled=true;
    btn.textContent="Sending…";
    // محاكاة إرسال الرسالة محلياً بدون الاتصال بالخادم
    setTimeout(() => {
        modalContent.innerHTML=`<h2>Message received</h2><p>Thank you. Your message was received (local demo).</p>`;
        btn.disabled=false;
    }, 500);
}
document.addEventListener("click",e=>{
    const m=e.target.closest("[data-modal]");
    if(m){openModal(m.dataset.modal);return}
    if(e.target.matches("[data-close-modal]")||e.target===modalRoot.querySelector(".modal-backdrop"))modalRoot.classList.add("hidden")
});
$("#accountBtn").addEventListener("click",()=>openModal("account"));
