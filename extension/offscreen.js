const audio=document.querySelector('#audio');let controller=null,objectUrl=null;
const status=message=>chrome.runtime.sendMessage({target:'background',action:'playback-status',message});
function stop(){controller?.abort();controller=null;audio.pause();audio.removeAttribute('src');if(objectUrl)URL.revokeObjectURL(objectUrl);objectUrl=null;}
audio.addEventListener('ended',()=>status('Finished. Find something else worth hearing.'));
audio.addEventListener('error',()=>status('Error: The generated audio could not be played.'));
chrome.runtime.onMessage.addListener((message,sender,reply)=>{
  if(message.target!=='offscreen'||sender.id!==chrome.runtime.id)return;
  if(message.action==='stop'){stop();status('Playback stopped.');reply({ok:true});return;}
  if(message.action==='play'){
    stop();const active=new AbortController();controller=active;status('Generating speech…');
    (async()=>{
      try{
        const response=await fetch('https://api.fish.audio/v1/tts',{method:'POST',headers:{Authorization:'Bearer '+message.apiKey,'Content-Type':'application/json',model:message.model},body:JSON.stringify({text:message.text,...(message.language?{language:message.language}:{}),reference_id:message.voiceId,format:'mp3',prosody:{speed:message.speed,volume:0}}),signal:AbortSignal.any([active.signal,AbortSignal.timeout(180000)])});
        if(!response.ok){let detail;try{detail=await response.json();}catch{}throw new Error(response.status===402?'Add API credit to your Fish Audio account.':response.status===401?'Your API key was not accepted.':detail?.message||'Fish Audio returned '+response.status+'.');}
        const blob=await response.blob();if(active.signal.aborted)return;if(!blob.size)throw new Error('No audio was returned.');objectUrl=URL.createObjectURL(blob);audio.src=objectUrl;await audio.play();await status('Playing your selection.');
      }catch(error){if(active.signal.aborted)return;await status('Error: '+(error.message||'Could not generate speech.'));}
    })();reply({ok:true});
  }
});
