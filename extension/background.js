importScripts('config.js','connection.js','handoff-codec.js');
const DEFAULT_STUDIO = UNDERTONE_DEFAULT_STUDIO;
chrome.runtime.onInstalled.addListener(async()=>{
  await chrome.contextMenus.removeAll();
  chrome.contextMenus.create({id:'undertone-listen',title:'Listen with Undertone',contexts:['selection']});
  chrome.contextMenus.create({id:'undertone-translate',title:'Translate selection with Undertone',contexts:['selection']});
  chrome.contextMenus.create({id:'undertone-studio',title:'Open selection in voice studio',contexts:['selection']});
  const settings=await chrome.storage.local.get('studioUrl');
  if(!settings.studioUrl)await chrome.storage.local.set({studioUrl:DEFAULT_STUDIO,voiceId:'c70cfb98867a4bfb9ae20d2401257b92',model:'drama-3',speed:1});
});
async function studio(selection){
  const {studioUrl=DEFAULT_STUDIO}=await chrome.storage.local.get('studioUrl');
  const target=new URL(studioUrl);
  if(target.protocol!=='https:'&&!(target.protocol==='http:'&&['localhost','127.0.0.1'].includes(target.hostname)))throw new Error('Use an HTTPS studio URL, or localhost for development.');
  const encoded=UndertoneHandoff.encodeImport(selection);
  target.hash='import='+encoded;await chrome.tabs.create({url:target.toString()});
}
async function offscreen(){
  const contexts=await chrome.runtime.getContexts({contextTypes:['OFFSCREEN_DOCUMENT'],documentUrls:[chrome.runtime.getURL('offscreen.html')]});
  if(!contexts.length)await chrome.offscreen.createDocument({url:'offscreen.html',reasons:['AUDIO_PLAYBACK','BLOBS'],justification:'Play speech generated from text the user explicitly selected.'});
}
let creatingOffscreen;
async function listen(selection){
  const apiKey=await getConnectionKey();if(!apiKey)throw new Error('Open Undertone and connect your Fish Audio API key first.');
  if(!selection.text?.trim())throw new Error('Select some text on the page first.');
  const settings=await chrome.storage.local.get(['voiceId','model','speed']);
  creatingOffscreen ||= offscreen().finally(()=>{creatingOffscreen=null;});await creatingOffscreen;
  await chrome.runtime.sendMessage({target:'offscreen',action:'play',text:UndertoneHandoff.validateImport(selection).text,apiKey,voiceId:settings.voiceId||'c70cfb98867a4bfb9ae20d2401257b92',model:settings.model||'drama-3',speed:settings.speed||1,language:selection.translation?.targetLanguage});
}
async function report(message){await chrome.storage.session.set({playbackStatus:message});chrome.action.setBadgeText({text:message.startsWith('Error:')?'!':''});chrome.action.setBadgeBackgroundColor({color:'#d97859'});}
chrome.contextMenus.onClicked.addListener(async(info,tab)=>{
  const selection={text:info.selectionText||'',title:tab?.title||'Browser selection',url:tab?.url||''};
  const opening=info.menuItemId==='undertone-translate'?chrome.sidePanel.open({windowId:tab.windowId}):null;
  await chrome.storage.session.set({lastSelection:{...selection,tabId:tab?.id}});
  if(opening){try{await opening;}catch(error){await report('Error: '+error.message);}return;}
  try{if(info.menuItemId==='undertone-studio')await studio(selection);else await listen(selection);}catch(error){await report('Error: '+error.message);}
});
chrome.runtime.onMessage.addListener((message,sender,reply)=>{
  if(message.target!=='background')return;
  if(sender.id!==chrome.runtime.id)return;
  (async()=>{
    try{
      if(message.action==='playback-status')await report(String(message.message||'').slice(0,500));
      else if(message.action==='studio')await studio(message.selection);
      else if(message.action==='listen')await listen(message.selection);
      else if(message.action==='stop'){await offscreen();await chrome.runtime.sendMessage({target:'offscreen',action:'stop'});}
      reply({ok:true});
    }catch(error){await report('Error: '+error.message);reply({ok:false,error:error.message});}
  })();return true;
});
