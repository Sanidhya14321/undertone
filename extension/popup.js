const $=id=>document.getElementById(id);let currentSelection={text:'',title:'Browser selection',url:''};
const DEFAULT_STUDIO='https://owl-excuses-fish-lab.pearlymug1.chatgpt.site';
function setStatus(text){$('status').textContent=text;}
function updateCount(){$('count').textContent=$('selection').value.length.toLocaleString()+' characters';}
async function capture(){
  try{
    const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
    const result=await chrome.scripting.executeScript({target:{tabId:tab.id},func:()=>window.getSelection()?.toString()||''});
    const text=result[0]?.result?.trim();if(!text){setStatus('Select text on this page first, or paste it above.');return;}
    currentSelection={text:text.slice(0,20000),title:tab.title||'Browser selection',url:tab.url||''};$('selection').value=currentSelection.text;$('source').textContent=new URL(currentSelection.url).hostname;updateCount();await chrome.storage.session.set({lastSelection:currentSelection});setStatus('Selection captured. Ready when you are.');
  }catch{setStatus('This page does not allow text capture. Copy and paste the text above instead.');}
}
async function send(action){
  const text=$('selection').value.trim();if(!text){setStatus('Add or capture some text first.');return;}
  try{const result=await chrome.runtime.sendMessage({target:'background',action,selection:{...currentSelection,text}});if(!result?.ok)setStatus(result?.error||'Could not complete this action.');else if(action==='studio')setStatus('Your selection is open in the studio.');}catch{setStatus('Could not contact the extension. Reload it and try again.');}
}
$('selection').addEventListener('input',updateCount);$('capture').addEventListener('click',capture);$('listen').addEventListener('click',()=>send('listen'));$('studio').addEventListener('click',()=>send('studio'));$('stop').addEventListener('click',()=>chrome.runtime.sendMessage({target:'background',action:'stop'}));
$('voice').addEventListener('change',()=>{$('custom-voice').hidden=$('voice').value!=='custom';});
$('save').addEventListener('click',async()=>{
  const key=$('key').value.trim(),voiceId=$('voice').value==='custom'?$('custom-voice').value.trim():$('voice').value;
  if(!key){setStatus('Enter your Fish Audio API key first.');return;}if(!/^[a-zA-Z0-9_-]{8,100}$/.test(voiceId)){setStatus('Enter a valid Fish Audio voice ID.');return;}
  try{const url=new URL($('studio-url').value.trim()||DEFAULT_STUDIO);if(url.protocol!=='https:'&&!(url.protocol==='http:'&&['localhost','127.0.0.1'].includes(url.hostname)))throw new Error();await chrome.storage.local.set({studioUrl:url.origin,voiceId,model:$('model').value,speed:Number($('speed').value)});await chrome.storage.session.set({apiKey:key});setStatus('Settings saved. Ready to listen.');$('settings').open=false;}catch{setStatus('Enter an HTTPS studio URL, or localhost for development.');}
});
$('disconnect').addEventListener('click',async()=>{await chrome.storage.session.remove('apiKey');$('key').value='';await chrome.runtime.sendMessage({target:'background',action:'stop'});setStatus('Disconnected. Your API key was removed.');});
chrome.storage.onChanged.addListener((changes,area)=>{if(area==='session'&&changes.playbackStatus)setStatus(changes.playbackStatus.newValue);});
(async()=>{
  const settings=await chrome.storage.local.get(['studioUrl','voiceId','model','speed']);const session=await chrome.storage.session.get(['apiKey','lastSelection','playbackStatus']);
  $('studio-url').value=settings.studioUrl||DEFAULT_STUDIO;$('key').value=session.apiKey||'';
  const voiceId=settings.voiceId||'c70cfb98867a4bfb9ae20d2401257b92';const builtIn=[...$('voice').options].some(o=>o.value===voiceId);$('voice').value=builtIn?voiceId:'custom';$('custom-voice').hidden=builtIn;$('custom-voice').value=builtIn?'':voiceId;$('model').value=settings.model||'drama-3';$('speed').value=String(settings.speed||1);
  if(session.lastSelection){currentSelection=session.lastSelection;$('selection').value=currentSelection.text;try{$('source').textContent=new URL(currentSelection.url).hostname;}catch{}updateCount();}
  if(!session.apiKey)$('settings').open=true;if(session.playbackStatus)setStatus(session.playbackStatus);chrome.action.setBadgeText({text:''});
})();
