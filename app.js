(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const STORE = "strawhat-pirate-web-v1";
  let state = loadState();
  let currentFiles = [];
  let currentIndex = 0;
  let objectUrls = [];
  let readerUrl = null;

  function loadState() {
    try { return JSON.parse(localStorage.getItem(STORE)) || {library:[],history:[],direction:"ltr",fit:true}; }
    catch { return {library:[],history:[],direction:"ltr",fit:true}; }
  }
  function saveState() { localStorage.setItem(STORE, JSON.stringify(state)); }
  function navigate(page) {
    $$(".page").forEach(el => el.classList.toggle("active", el.id === "page-" + page));
    $$(".nav-item").forEach(el => el.classList.toggle("active", el.dataset.page === page));
    $("#pageName").textContent = page.toUpperCase();
    $("#sidebar").classList.remove("open");
    render();
  }
  $$(".nav-item").forEach(btn => btn.addEventListener("click", () => navigate(btn.dataset.page)));
  $$("[data-go]").forEach(btn => btn.addEventListener("click", () => navigate(btn.dataset.go)));
  $("#mobileMenu").addEventListener("click", () => $("#sidebar").classList.toggle("open"));

  function addToLibrary(file) {
    const key = file.name + ":" + file.size;
    if (!state.library.some(item => item.key === key)) {
      state.library.unshift({key,title:file.name.replace(/\.[^.]+$/,""),status:"planned",cover:""});
      saveState();
    }
  }
  function renderLibrary() {
    const grid = $("#libraryGrid"), empty = $("#libraryEmpty");
    grid.innerHTML = "";
    empty.hidden = state.library.length > 0;
    state.library.forEach(item => {
      const card = document.createElement("article");
      card.className = "library-card";
      const image = document.createElement("div");
      image.style.height = "115px";
      image.style.display = "grid";
      image.style.placeItems = "center";
      image.style.background = "linear-gradient(140deg,#3a3020,#202328)";
      image.style.color = "#e8bd65";
      image.style.fontSize = "30px";
      image.textContent = "▤";
      const body = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = item.title;
      const select = document.createElement("select");
      [["reading","Reading"],["planned","Planned"],["completed","Completed"]].forEach(([value,label]) => {
        const option = document.createElement("option"); option.value=value; option.textContent=label; select.append(option);
      });
      select.value = item.status;
      select.addEventListener("change", () => { item.status=select.value; saveState(); });
      body.append(title,select); card.append(image,body); grid.append(card);
    });
  }
  function renderHistory() {
    const list=$("#historyList"), empty=$("#historyEmpty");
    list.innerHTML="";
    empty.hidden=state.history.length>0;
    state.history.slice(0,30).forEach(entry=>{
      const row=document.createElement("div"); row.className="history-item";
      const icon=document.createElement("div"); icon.textContent="▧"; icon.style.cssText="width:44px;height:55px;display:grid;place-items:center;background:#302819;color:#e9bc60;border-radius:5px;font-size:20px";
      const text=document.createElement("div"), title=document.createElement("strong"), meta=document.createElement("small");
      title.textContent=entry.title; meta.textContent=entry.pages+" pages · "+new Date(entry.time).toLocaleString();
      text.append(title,meta); row.append(icon,text); list.append(row);
    });
  }
  function render() { renderLibrary(); renderHistory(); }
  $$(".filter").forEach(btn=>btn.addEventListener("click",()=>{
    $$(".filter").forEach(x=>x.classList.toggle("active",x===btn));
    const filter=btn.dataset.filter;
    $$(".library-card").forEach((card,i)=>{card.hidden=filter!=="all"&&state.library[i]?.status!==filter});
  }));

  $("#fileInput").addEventListener("change", event=>{
    const files=[...event.target.files].filter(file=>file.type.startsWith("image/"));
    if(!files.length) return;
    currentFiles=files.sort((a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true,sensitivity:"base"}));
    currentFiles.forEach(addToLibrary);
    render();
    $("#localPreview").innerHTML="";
    currentFiles.forEach((file,index)=>{
      const card=document.createElement("button"); card.className="local-thumb"; card.type="button";
      const img=document.createElement("img"); const url=URL.createObjectURL(file); objectUrls.push(url); img.src=url; img.alt=file.name;
      const name=document.createElement("span"); name.textContent=file.name;
      card.append(img,name); card.addEventListener("click",()=>openReader(index)); $("#localPreview").append(card);
    });
    openReader(0);
    event.target.value="";
  });

  function openReader(index) {
    if(!currentFiles.length) return;
    currentIndex=Math.max(0,Math.min(index,currentFiles.length-1));
    $("#reader").hidden=false;
    $("#readerTitle").textContent=currentFiles[0].name.replace(/\.[^.]+$/,"");
    $("#readerCount").textContent=currentFiles.length+" pages";
    updateReader();
    const title=currentFiles[0].name.replace(/\.[^.]+$/,"");
    state.history.unshift({title,pages:currentFiles.length,time:Date.now()});
    state.history=state.history.slice(0,30); saveState(); renderHistory();
  }
  function updateReader() {
    const stage=$("#readerStage"), file=currentFiles[currentIndex];
    stage.innerHTML="";
    stage.classList.toggle("vertical",state.direction==="vertical");
    const img=document.createElement("img");
    if(readerUrl) URL.revokeObjectURL(readerUrl);
    readerUrl=URL.createObjectURL(file); img.src=readerUrl; img.alt=file.name;
    img.style.maxHeight=state.fit&&state.direction!=="vertical"?"calc(100vh - 130px)":"none";
    img.style.maxWidth=state.fit?"100%":"none";
    stage.append(img);
    $("#pageCounter").textContent=(currentIndex+1)+" / "+currentFiles.length;
    $("#pageSlider").max=currentFiles.length; $("#pageSlider").value=currentIndex+1;
    $("#prevPage").disabled=currentIndex===0; $("#nextPage").disabled=currentIndex===currentFiles.length-1;
  }
  function step(amount) { if(!currentFiles.length)return; currentIndex=Math.max(0,Math.min(currentFiles.length-1,currentIndex+amount)); updateReader(); }
  $("#prevPage").addEventListener("click",()=>step(state.direction==="rtl"?1:-1));
  $("#nextPage").addEventListener("click",()=>step(state.direction==="rtl"?-1:1));
  $("#pageSlider").addEventListener("input",e=>{currentIndex=Number(e.target.value)-1;updateReader()});
  $("#closeReader").addEventListener("click",()=>$("#reader").hidden=true);
  document.addEventListener("keydown",e=>{
    if($("#reader").hidden)return;
    if(e.key==="Escape")$("#reader").hidden=true;
    if(e.key==="ArrowRight")step(state.direction==="rtl"?-1:1);
    if(e.key==="ArrowLeft")step(state.direction==="rtl"?1:-1);
  });
  $("#direction").value=state.direction;
  $("#direction").addEventListener("change",e=>{state.direction=e.target.value;saveState();if(!$("#reader").hidden)updateReader()});
  $("#fitPages").checked=state.fit;
  $("#fitPages").addEventListener("change",e=>{state.fit=e.target.checked;saveState();if(!$("#reader").hidden)updateReader()});
  $("#clearData").addEventListener("click",()=>{
    if(!confirm("Clear this browser's saved library and reading history? Local files on your device will not be deleted."))return;
    state.library=[];state.history=[];saveState();render();
  });
  $("#globalSearch").addEventListener("input",e=>{
    const query=e.target.value.trim().toLowerCase();
    if(!query)return;
    navigate("library");
    $$(".library-card").forEach(card=>card.hidden=!card.textContent.toLowerCase().includes(query));
  });
  render();
})();