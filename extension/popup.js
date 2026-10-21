const $=id=>document.getElementById(id);let currentSelection={text:'',title:'Browser selection',url:''};
const DEFAULT_STUDIO=UNDERTONE_DEFAULT_STUDIO;let currentWindowId;
function setStatus(text){$('status').textContent=text;}
function updateCount(){$('count').textContent=$('selection').value.length.toLocaleString()+' characters';}
async function capture(){
  try{
    const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
    const result=await chrome.scripting.executeScript({target:{tabId:tab.id},func:()=>window.getSelection()?.toString()||''});
    const text=result[0]?.result?.trim();if(text?.length>20000){setStatus('Select up to 20,000 characters, or paste a smaller passage.');return;}if(!text){setStatus('Select text on this page first, or paste it above.');return;}
    currentSelection={text,title:tab.title||'Browser selection',url:tab.url||'',tabId:tab.id};$('selection').value=currentSelection.text;$('source').textContent=new URL(currentSelection.url).hostname;updateCount();await chrome.storage.session.set({lastSelection:currentSelection});setStatus('Selection captured. Ready when you are.');
  }catch{setStatus('This page does not allow text capture. Copy and paste the text above instead.');}
}
async function send(action){
  const text=$('selection').value.trim();if(!text){setStatus('Add or capture some text first.');return;}
  try{const result=await chrome.runtime.sendMessage({target:'background',action,selection:{...currentSelection,text}});if(!result?.ok)setStatus(result?.error||'Could not complete this action.');else if(action==='studio')setStatus('Your selection is open in the studio.');}catch{setStatus('Could not contact the extension. Reload it and try again.');}
}
$('selection').addEventListener('input',()=>{updateCount();chrome.storage.session.set({lastSelection:{...currentSelection,text:$('selection').value}}).catch(()=>setStatus('Could not save the draft.'));});
$('translate').addEventListener('click',()=>{if(!Number.isInteger(currentWindowId)){setStatus('The browser window is still loading. Try Translate again.');return;}const opening=chrome.sidePanel.open({windowId:currentWindowId});chrome.storage.session.set({lastSelection:{...currentSelection,text:$('selection').value}}).catch(()=>setStatus('Could not save the selection.'));opening.catch(()=>setStatus('Could not open the translation panel.'));});$('capture').addEventListener('click',capture);$('listen').addEventListener('click',()=>send('listen'));$('studio').addEventListener('click',()=>send('studio'));$('stop').addEventListener('click',()=>chrome.runtime.sendMessage({target:'background',action:'stop'}));
$('voice').addEventListener('change',()=>{$('custom-voice').hidden=$('voice').value!=='custom';});
$('save').addEventListener('click',async()=>{
  const key=$('key').value.trim(),voiceId=$('voice').value==='custom'?$('custom-voice').value.trim():$('voice').value;
  if(!/^[a-zA-Z0-9_-]{8,100}$/.test(voiceId)){setStatus('Enter a valid Fish Audio voice ID.');return;}
  let url;try{url=new URL($('studio-url').value.trim()||DEFAULT_STUDIO);if(url.protocol!=='https:'&&!(url.protocol==='http:'&&['localhost','127.0.0.1'].includes(url.hostname)))throw new Error();}catch{setStatus('Enter an HTTPS studio URL, or localhost for development.');return;}
  try{await chrome.storage.local.set({studioUrl:url.origin+(url.pathname==='/'?'/studio':url.pathname),voiceId,model:$('model').value,speed:Number($('speed').value)});if(key)await saveConnectionKey(key,$('remember-key').checked);setStatus('Settings saved. Ready to listen.');$('settings').open=false;}catch{setStatus('Your browser could not save these settings. Check extension storage and try again.');}
});
$('disconnect').addEventListener('click',async()=>{try{await forgetConnectionKey();$('key').value='';await chrome.runtime.sendMessage({target:'background',action:'stop'});setStatus('Disconnected. The saved API key was removed.');}catch{setStatus('Could not remove the key. Check browser storage settings.');}});
chrome.storage.onChanged.addListener((changes,area)=>{if(area==='session'&&changes.playbackStatus)setStatus(changes.playbackStatus.newValue);});
(async()=>{
  currentWindowId=(await chrome.windows.getCurrent()).id;
  const settings=await chrome.storage.local.get(['studioUrl','voiceId','model','speed','rememberKey','theme']);const session=await chrome.storage.session.get(['apiKey','lastSelection','playbackStatus']);
  $('studio-url').value=settings.studioUrl||DEFAULT_STUDIO;$('key').value=await getConnectionKey();$('remember-key').checked=settings.rememberKey!==false;applyTheme(settings.theme||'system');
  const voiceId=settings.voiceId||'c70cfb98867a4bfb9ae20d2401257b92';const builtIn=[...$('voice').options].some(o=>o.value===voiceId);$('voice').value=builtIn?voiceId:'custom';$('custom-voice').hidden=builtIn;$('custom-voice').value=builtIn?'':voiceId;$('model').value=settings.model||'drama-3';$('speed').value=String(settings.speed||1);
  if(session.lastSelection){currentSelection=session.lastSelection;$('selection').value=currentSelection.text;try{$('source').textContent=new URL(currentSelection.url).hostname;}catch{}updateCount();}
  if(!$('key').value)setStatus('Translation works without a key. Connect Fish Audio when you want to listen.');if(session.playbackStatus)setStatus(session.playbackStatus);chrome.action.setBadgeText({text:''});
})().catch(()=>setStatus('Your browser could not load saved settings. Check extension storage.'));

let chosenTheme='system';
const systemTheme=matchMedia('(prefers-color-scheme: dark)');
function applyTheme(theme){chosenTheme=theme;document.documentElement.dataset.theme=theme==='system'?(systemTheme.matches?'dark':'light'):theme;$('theme-toggle').setAttribute('aria-label','Switch to '+(document.documentElement.dataset.theme==='dark'?'light':'dark')+' mode');}
$('theme-toggle').addEventListener('click',async()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';applyTheme(next);try{await chrome.storage.local.set({theme:next});}catch{setStatus('Theme changed for this popup. Browser storage could not save the preference.');}});
systemTheme.addEventListener('change',()=>{if(chosenTheme==='system')applyTheme('system');});
