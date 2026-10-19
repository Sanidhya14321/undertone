'use strict';
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const DURATION = 30;
const beats = [
  {start:0,end:5,lang:'en-US',code:'EN',name:'ENGLISH',excuse:'“Maybe it won’t understand Spanish.”',line:'You skipped your lesson.',translation:'And the owl noticed.',guilt:15,state:'POLITE CONCERN',comment:'Just checking in.\nFor now.',note:'your move.',color:'#c9ed7c',speechAt:1.1},
  {start:5,end:11,lang:'es-ES',code:'ES',name:'ESPAÑOL',excuse:'“Quizá no entienda español.”',line:'Eso lo he entendido.',translation:'I understood that.',guilt:35,state:'PERSONALLY INVESTED',comment:'Nice try.\nIt speaks Spanish.',note:'nice try.',color:'#dfdf82',speechAt:6.3},
  {start:11,end:17,lang:'fr-FR',code:'FR',name:'FRANÇAIS',excuse:'“Je suis très occupé.”',line:'Bien sûr. C’est ta dix-neuvième vidéo.',translation:'Of course. This is your nineteenth video.',guilt:65,state:'CAUGHT IN THE SCROLL',comment:'Very busy.\nVery well documented.',note:'19 videos. really?',color:'#edc880',speechAt:12.0},
  {start:17,end:23,lang:'ja-JP',code:'JA',name:'日本語',excuse:'“あと5分だけ。”',line:'レッスンも、たった5分だよ。',translation:'That’s all the lesson takes, too.',guilt:85,state:'QUIET CHECKMATE',comment:'Five minutes.\nFunny you should say that.',note:'checkmate.',color:'#e9aa7f',speechAt:18.4},
  {start:23,end:27.5,lang:'en-US',code:'EN',name:'ENGLISH',excuse:'“Fine. You win.”',line:'Your excuses translate beautifully.',translation:'Four languages. Still the same excuse.',guilt:100,state:'FLUENT IN DISAPPOINTMENT',comment:'No more excuses.\nJust a very patient smile.',note:'there you are.',color:'#ed9b7f',speechAt:23.5},
  {start:27.5,end:30,lang:'en-US',code:'EN',name:'ENGLISH',excuse:'“Fine. You win.”',line:'',translation:'',guilt:100,state:'FLUENT IN DISAPPOINTMENT',comment:'Lesson learned.\nIn every language.',note:'',color:'#d1ed86',speechAt:30}
];
let time=0, playing=false, muted=false, captions=true, lastFrame=0, beatIndex=-1, spokenBeat=-1;
let customAudio=null, customUrl=null, voices=[], audioContext=null, toastTimer, lessonTimer;
const speechSupported = 'speechSynthesis' in window;
const film=$('#film'), scene=$('.scene'), owl=$('#owl');
function getBeat(t){ return beats.findIndex(b=>t>=b.start&&t<b.end); }
function pad(n){ return String(n).padStart(2,'0'); }
function notify(message){ $('#toast').textContent=message; $('#toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3500); }
function cancelSpeech(){if(speechSupported) speechSynthesis.cancel(); owl.classList.remove('speaking');}
function updateVoices(){voices=speechSupported?speechSynthesis.getVoices():[];updateSourceLabel();}
function updateSourceLabel(){
  const available=voices.length>0;
  $('#audio-source').textContent=customAudio?'Your voice take':available?'Browser voice preview':'Caption preview · add audio';
  $('#voice-status').textContent=customAudio?'Your voice take is loaded':available?'Browser voice preview':'No browser voices available';
  $('#voice-description').textContent=customAudio?'Your local audio is the master clock for this short. Reload the page to remove it. No files are uploaded.':available?'Preview speech uses the voices available on your device. It is not a Fish Audio generation and may use a different voice for each language.':'This browser has no speech voices installed. The animation and captions still work. Load a finished voice take below to hear it with the short.';
}
function speak(b){
  if(muted||customAudio||!speechSupported||!voices.length||!b.line)return;
  speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance(b.line);
  const matching=voices.filter(v=>v.lang.toLowerCase().startsWith(b.lang.split('-')[0]));
  // Do not pronounce other languages using an unrelated default voice.
  if(!matching.length)return;
  utterance.voice=matching.find(v=>/female|samantha|karen|google|natural|premium/i.test(v.name))||matching[0];
  utterance.lang=b.lang;utterance.rate=b.code==='JA'?.94:.96;utterance.pitch=1.12;utterance.volume=.9;
  utterance.onstart=()=>{if(playing)owl.classList.add('speaking');};
  utterance.onend=()=>owl.classList.remove('speaking');
  utterance.onerror=()=>owl.classList.remove('speaking');
  speechSynthesis.speak(utterance);
}
function ding(){
  if(muted||customAudio)return;
  try{
    const Context=window.AudioContext||window.webkitAudioContext;if(!Context)return;
    audioContext ||= new Context();audioContext.resume();
    const osc=audioContext.createOscillator(),gain=audioContext.createGain();
    osc.type='sine';osc.frequency.setValueAtTime(880,audioContext.currentTime);osc.frequency.setValueAtTime(1320,audioContext.currentTime+.1);
    gain.gain.setValueAtTime(.025,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime+.45);
    osc.connect(gain);gain.connect(audioContext.destination);osc.start();osc.stop(audioContext.currentTime+.45);
  }catch{/* Sound is optional; the caption-led experience remains available. */}
}
function render(force=false){
  const index=getBeat(Math.min(time,29.999));
  const b=beats[index];
  if(index!==beatIndex||force){
    beatIndex=index;film.dataset.beat=index;
    $('#excuse-number').textContent=pad(Math.min(index+1,5));
    $('#language-pill').replaceChildren();const code=document.createElement('b');code.textContent=b.code;$('#language-pill').append(code,document.createTextNode(b.name));
    $('#excuse-text').textContent=b.excuse;$('#caption-language').textContent=b.name;$('#caption').textContent=`“${b.line}”`;$('#translation').textContent=b.translation;
    $('#guilt-value').textContent=b.guilt;$('#guilt-state').textContent=b.state;$('#guilt-comment').textContent=b.comment;$('#hand-note').textContent=b.note;
    $('#guilt-comment').style.whiteSpace='pre-line';$('#meter-fill').style.height=`${b.guilt}%`;film.style.setProperty('--meter',b.color);
    $('#end-card').hidden=index!==5;
    $('#caption-area').setAttribute('aria-hidden',String(index===5||!captions));
    $('#excuse').setAttribute('aria-hidden',String(index===5));
    if(index!==5){$('#end-card').classList.remove('lesson-view');resetLessonCard();}
    scene.classList.remove('switching');void scene.offsetWidth;scene.classList.add('switching');
    $$('.chapter').forEach((el,i)=>{const active=i===Math.min(index,3);el.classList.toggle('active',active);if(active)el.setAttribute('aria-current','true');else el.removeAttribute('aria-current');});
  }
  $('#current-time').textContent=`00:${pad(Math.floor(time))}`;$('#progress').value=time;$('#progress').style.setProperty('--progress',`${time/DURATION*100}%`);
  if(customAudio&&playing&&!muted)owl.classList.toggle('speaking',index<5&&time>b.speechAt&&time<b.end-.6);
  if(playing&&time>=b.speechAt&&spokenBeat!==index){spokenBeat=index;speak(b);}
}
function updatePlaybackControls(){
  $('#play use').setAttribute('href',playing?'#i-pause':'#i-play');$('#play').setAttribute('aria-label',playing?'Pause':'Play');$('#play').setAttribute('aria-pressed',String(playing));
  $('#play-overlay').hidden=playing||time>0;$('#play-overlay').style.opacity='1';
}
async function play(){
  if(time>=DURATION)seek(0);
  if(customAudio){try{customAudio.currentTime=time;await customAudio.play();}catch{notify('This audio could not be played. Try another file.');return;}}
  if(time===0)ding();playing=true;lastFrame=performance.now();spokenBeat=-1;updatePlaybackControls();render();
}
function pause(){playing=false;if(customAudio)customAudio.pause();cancelSpeech();updatePlaybackControls();}
function seek(value){
  time=Math.max(0,Math.min(DURATION,Number(value)));cancelSpeech();spokenBeat=-1;
  if(customAudio)customAudio.currentTime=time;
  clearTimeout(lessonTimer);render(true);updatePlaybackControls();lastFrame=performance.now();
}
function togglePlayback(){playing?pause():play();}
function frame(now){
  if(playing){
    time=customAudio?Math.min(DURATION,customAudio.currentTime):Math.min(DURATION,time+Math.min((now-lastFrame)/1000,.15));
    if(time>=DURATION){time=DURATION;pause();}
    render();
  }
  lastFrame=now;requestAnimationFrame(frame);
}
$('#play').addEventListener('click',togglePlayback);$('#play-overlay').addEventListener('click',play);
$('#replay').addEventListener('click',()=>{seek(0);play();});
$('#progress').addEventListener('input',e=>seek(e.target.value));
$('#mute').addEventListener('click',()=>{
  muted=!muted;if(customAudio)customAudio.muted=muted;
  $('#mute use').setAttribute('href',muted?'#i-mute':'#i-volume');$('#mute').setAttribute('aria-label',muted?'Unmute audio':'Mute audio');$('#mute').setAttribute('aria-pressed',String(muted));
  if(muted)cancelSpeech();else if(playing){spokenBeat=-1;render();}
});
$('#captions-toggle').addEventListener('click',()=>{
  captions=!captions;$('#caption-area').style.visibility=captions?'visible':'hidden';$('#caption-area').setAttribute('aria-hidden',String(!captions||beatIndex===5));$('#captions-toggle').setAttribute('aria-pressed',String(captions));$('#captions-toggle').setAttribute('aria-label',captions?'Hide captions':'Show captions');
});
$('#fullscreen').addEventListener('click',async()=>{
  try{if(document.fullscreenElement)await document.exitFullscreen();else if($('#player').requestFullscreen)await $('#player').requestFullscreen();else notify('Fullscreen is unavailable in this browser.');}catch{notify('Fullscreen is unavailable in this preview.');}
});
document.addEventListener('fullscreenchange',()=>$('#fullscreen').setAttribute('aria-label',document.fullscreenElement?'Exit fullscreen':'Enter fullscreen'));
$$('.chapter').forEach(chapter=>chapter.addEventListener('click',()=>{seek(chapter.dataset.time);play();}));
function openAudio(){pause();$('#audio-dialog').showModal();}
$$('.about-trigger').forEach(el=>el.addEventListener('click',openAudio));$('#audio-source').addEventListener('click',openAudio);
function closeAudio(){$('#audio-dialog').close();}
$('#close-audio').addEventListener('click',closeAudio);$('#dialog-done').addEventListener('click',closeAudio);
$('#audio-dialog').addEventListener('click',e=>{if(e.target===$('#audio-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeAudio();}});
$('#audio-file').addEventListener('change',async e=>{
  const file=e.target.files[0];if(!file)return;
  if(file.size>100*1024*1024){$('#upload-error').textContent='Please choose an audio file smaller than 100 MB.';e.target.value='';return;}
  pause();const candidateUrl=URL.createObjectURL(file),candidate=new Audio(candidateUrl);
  try{
    await new Promise((resolve,reject)=>{candidate.addEventListener('loadedmetadata',resolve,{once:true});candidate.addEventListener('error',reject,{once:true});candidate.load();});
    if(!Number.isFinite(candidate.duration)||candidate.duration<29.5||candidate.duration>30.5)throw new Error('duration');
    if(customUrl)URL.revokeObjectURL(customUrl);customUrl=candidateUrl;customAudio=candidate;customAudio.muted=muted;
    customAudio.addEventListener('ended',()=>{time=DURATION;pause();render();});
    customAudio.addEventListener('error',()=>{pause();notify('Audio playback failed. Please load another take.');});
    $('#reset-audio').hidden=false;$('#upload-error').textContent='Loaded. Your audio stays on this device.';updateSourceLabel();seek(0);notify('Voice take loaded. Ready when you are.');
  }catch(error){URL.revokeObjectURL(candidateUrl);$('#upload-error').textContent=error?.message==='duration'?'Please use a 30-second take (29.5–30.5 seconds) to match the timeline.':'That file could not be read. Try an MP3, WAV, or M4A.';e.target.value='';}
});
$('#reset-audio').addEventListener('click',()=>{pause();if(customUrl)URL.revokeObjectURL(customUrl);customUrl=null;customAudio=null;$('#audio-file').value='';$('#reset-audio').hidden=true;$('#upload-error').textContent='';updateSourceLabel();seek(0);});
const script=beats.slice(0,5).map((b,i)=>`${pad(Math.floor(b.start))}s — ${b.name}\nYOU: ${b.excuse}\nOWL: ${b.line}\n${b.translation}\n`).join('\n');
$('#script-lines').replaceChildren(...beats.slice(0,5).map(b=>{
  const row=document.createElement('div');row.className='script-line';
  const timestamp=document.createElement('span');timestamp.textContent=`00:${pad(Math.floor(b.start))}`;
  const you=document.createElement('div'),speaker=document.createElement('strong'),excuse=document.createElement('p');speaker.textContent='YOU';excuse.textContent=b.excuse;you.append(speaker,excuse);
  const owlLine=document.createElement('div'),owlLabel=document.createElement('strong'),line=document.createElement('p'),translation=document.createElement('small');owlLabel.textContent=`OWL / ${b.name}`;line.textContent=b.line;translation.textContent=b.translation;owlLine.append(owlLabel,line,translation);row.append(timestamp,you,owlLine);return row;
}));
function openScript(){$('#script-section').hidden=false;$('#script-section').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
$('#nav-script').addEventListener('click',openScript);$('#read-script').addEventListener('click',openScript);$('#close-script').addEventListener('click',()=>{$('#script-section').hidden=true;$('#read-script').focus();});
$('#download-script').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([`YOUR EXCUSES TRANSLATE BEAUTIFULLY\nAn independent Fish Audio concept\n\n${script}\n27.5s — END CARD\nYour excuses translate beautifully.\n`],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='your-excuses-script.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
function resetLessonCard(){
  $('#end-card .end-eyebrow').textContent='SOME THINGS NEED NO TRANSLATION.';
  $('#end-card h2').replaceChildren(document.createTextNode('Your excuses'),document.createElement('br'),document.createTextNode('translate beautifully.'));
  $('#lesson-button').innerHTML='Fine. Let’s do the lesson. <svg><use href="#i-arrow"/></svg>';
}
$('#lesson-button').addEventListener('click',()=>{
  if($('#end-card').classList.contains('lesson-view')){seek(0);play();return;}
  pause();$('#end-card').classList.add('lesson-view');$('#end-card .end-eyebrow').textContent='YOUR FIRST LESSON';
  $('#end-card h2').replaceChildren(document.createTextNode('“I have no excuses.”'),document.createElement('br'),document.createTextNode('No tengo excusas.'));
  $('#lesson-button').innerHTML='Lesson learned. Play again <svg><use href="#i-replay"/></svg>';
  notify('The owl knew you had it in you.');
});
document.addEventListener('keydown',e=>{
  if($('#audio-dialog').open||/INPUT|TEXTAREA|BUTTON|A/.test(document.activeElement.tagName))return;
  if(e.code==='Space'){e.preventDefault();togglePlayback();}
  if(e.code==='ArrowRight'){e.preventDefault();seek(time+5);}
  if(e.code==='ArrowLeft'){e.preventDefault();seek(time-5);}
});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&playing)pause();});
window.addEventListener('pagehide',()=>{cancelSpeech();if(customUrl)URL.revokeObjectURL(customUrl);});
if(speechSupported){speechSynthesis.addEventListener('voiceschanged',updateVoices);updateVoices();}else updateSourceLabel();
render(true);updatePlaybackControls();requestAnimationFrame(frame);
