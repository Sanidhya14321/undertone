/** Shared browser-local translation. No network translation or credentials. */
export const MAX_TEXT = 20000;
export const LANGUAGES = [['en','English'],['hi','Hindi'],['es','Spanish'],['fr','French'],['de','German'],['ja','Japanese'],['zh','Chinese'],['ko','Korean'],['it','Italian'],['pt','Portuguese'],['ar','Arabic']];
export const isTarget = code => LANGUAGES.some(([id]) => id === code);
export function validateText(text) {
  if(typeof text !== 'string' || !text.trim()) throw new Error('Add some text to translate.');
  if(text.length > MAX_TEXT) throw new Error('Keep text under 20,000 characters. Download or split longer passages first.');
  return text;
}
const languageTag=/<\/?(?:english|hindi|spanish|french|german|japanese|chinese|korean|italian|portuguese|arabic)(?:\s[^>]*)?>/gi;
// Preserve performance instructions, speaker markers, code and URLs separately from prose.
const protectedToken=/(\[[^\]\n]*\]|<\|speaker:\d+\|>|<\/?[a-z][^>]*>|```[\s\S]*?```|`[^`\n]+`|https?:\/\/[^\s<>]+)/gi;
export function segments(text) {
  const clean=text.replace(languageTag,'');
  return clean.split(protectedToken).filter(Boolean).flatMap(part=>{
    if(/^(?:\[[^\]\n]*\]|<[^>]*>|```[\s\S]*```|`[^`\n]+`|https?:\/\/\S+)$/.test(part)) return [{text:part,protected:true}];
    return part.split(/(\n+)/).filter(Boolean).flatMap(paragraph=>{
      if(!paragraph.trim()) return [{text:paragraph,protected:true}];
      const sentences=typeof Intl.Segmenter==='function'?[...new Intl.Segmenter(undefined,{granularity:'sentence'}).segment(paragraph)].map(s=>s.segment):[paragraph];
      return sentences.map(text=>({text,protected:!/[\p{L}]/u.test(text)}));
    });
  });
}
function check(signal){signal?.throwIfAborted();}
function error(message,code){return Object.assign(new Error(message),{code});}
export function createTranslationEngine(host=globalThis) {
  let detector=null,pendingRequest='';const translators=new Map(),pending=new Map();
  const supported=()=>!!host.Translator;
  function destroy(){detector?.destroy?.();detector=null;for(const value of translators.values())value.destroy?.();translators.clear();pending.clear();pendingRequest='';}
  async function translate(texts,options={}) {
    const {target='en',source='auto',signal,onProgress=()=>{}}=options;
    if(!supported())throw error('On-device translation is unavailable here. Use a supported desktop Chrome browser, or paste a translation into the editor. Existing speech tools still work.','unsupported');
    if(!isTarget(target))throw new Error('Choose a supported target language.');
    if(!Array.isArray(texts)||!texts.length)throw new Error('Add some text to translate.');
    if(!texts.some(text=>typeof text==='string'&&text.trim()))throw new Error('Add some text to translate.');
    for(const text of texts){if(typeof text!=='string')throw new Error('Use plain text to translate.');if(text.trim())validateText(text);}
    const request=JSON.stringify({texts,target,source});if(request!==pendingRequest)pending.clear();pendingRequest=request;
    if(texts.join('').length>MAX_TEXT)throw new Error('Translate up to 20,000 characters at a time.');
    check(signal);
    const monitor=m=>m.addEventListener('downloadprogress',e=>onProgress(`Downloading language resources… ${Math.round(e.loaded*100)}%`));
    try {
      // Start pending creates before the first await, inside the next explicit user gesture.
      const creates=[...pending].map(([key,pair])=>[key,host.Translator.create({...pair,monitor,signal}).catch(e=>{if(e.name==='NotAllowedError'||signal?.aborted)throw e;throw error('The browser could not prepare this language pair. Retry on supported desktop Chrome, choose another pair, or paste a translation manually. Your original is unchanged.','resources');})]);
      const detectPromise=source==='auto'&&!detector ? (host.LanguageDetector?host.LanguageDetector.create({monitor,signal}):Promise.reject(error('Choose a source language: automatic detection is unavailable in this browser.','source'))) : null;
      const detected=detectPromise?.then(value=>({value}),error=>({error}));
      const created=await Promise.allSettled(creates.map(async([key,promise])=>{const value=await promise;if(signal?.aborted){value.destroy?.();check(signal);}translators.set(key,value);pending.delete(key);}));
      if(detectPromise){try{const outcome=await detected;if(outcome.error)throw outcome.error;const value=outcome.value;if(signal?.aborted){value.destroy?.();check(signal);}detector=value;}catch(e){throw e;}}
      const failed=created.find(r=>r.status==='rejected');if(failed)throw failed.reason;
      check(signal);onProgress('Detecting source languages…');
      const plans=[];
      for(const text of texts){const plan=segments(text);for(const part of plan){
        check(signal);if(part.protected)continue;
        let lang=source;
        if(source==='auto'){
          const ranked=await detector.detect(part.text.trim(),{signal});check(signal);
          if(!ranked[0]||ranked[0].confidence<.6||ranked[0].detectedLanguage==='und')throw error('This passage is too short or ambiguous to detect reliably. Choose its source language and try again.','source');
          lang=ranked[0].detectedLanguage;
        }
        part.source=lang;
        if(lang===target)continue;
        const key=lang+'>'+target;
        if(!translators.has(key)&&!pending.has(key)){
          const pair={sourceLanguage:lang,targetLanguage:target};
          const availability=await host.Translator.availability(pair);check(signal);
          if(availability==='unavailable')throw error(`Translation from ${lang} to ${target} is unavailable on this device. Choose another language or paste your own translation.`,'pair');
          pending.set(key,pair);
        }
      }plans.push(plan);}
      if(pending.size)throw error('Language resources are ready to prepare. Select “Prepare & translate” to continue on this device.','prepare');
      const output=[];let completed=0,total=plans.flat().filter(p=>!p.protected&&p.source!==target).length;
      for(const plan of plans){let result='';for(const part of plan){
        check(signal);
        if(part.protected||part.source===target){result+=part.text;continue;}
        const leading=part.text.match(/^\s*/)[0],trailing=part.text.match(/\s*$/)[0];
        const translated=await translators.get(part.source+'>'+target).translate(part.text.trim(),{signal});check(signal);
        if(typeof translated!=='string'||!translated.trim())throw new Error('The browser returned an empty translation. Your original has been kept.');
        result+=leading+translated.trim()+trailing;onProgress(`Translating… ${++completed}/${total}`);
      }if(result.trim())validateText(result);output.push(result);}
      if(output.join('').length>MAX_TEXT)throw new Error('The translation exceeds 20,000 characters. Your original has been kept. Translate a smaller selection.');
      return {texts:output,target,sourceLanguages:[...new Set(plans.flat().map(p=>p.source).filter(Boolean))]};
    }catch(e){if(signal?.aborted)throw signal.reason||new DOMException('Cancelled','AbortError');if(e.name==='NotAllowedError')throw error('Click “Prepare & translate” again to allow the browser to prepare language resources.','prepare');throw e;}
  }
  return {supported,translate,destroy};
}
export function replaceSelection(text,start,end,replacement){if(!Number.isInteger(start)||!Number.isInteger(end)||start<0||end<start||end>text.length)throw new Error('That selection is no longer valid.');const result=text.slice(0,start)+replacement+text.slice(end);validateText(result);return result;}
