// Only trusted extension pages can read saved credentials.
chrome.storage.local.setAccessLevel?.({accessLevel:'TRUSTED_CONTEXTS'})?.catch(()=>{});
async function getConnectionKey(){
  const session=await chrome.storage.session.get('apiKey');
  if(session.apiKey)return session.apiKey;
  const saved=await chrome.storage.local.get('savedApiKey');
  if(saved.savedApiKey){await chrome.storage.session.set({apiKey:saved.savedApiKey});return saved.savedApiKey;}
  return '';
}
async function saveConnectionKey(apiKey,remember){
  if(remember)await chrome.storage.local.set({savedApiKey:apiKey,rememberKey:true});
  else{await chrome.storage.local.remove('savedApiKey');await chrome.storage.local.set({rememberKey:false});}
  await chrome.storage.session.set({apiKey});
}
async function forgetConnectionKey(){
  await Promise.all([chrome.storage.local.remove('savedApiKey'),chrome.storage.session.remove('apiKey')]);
}
