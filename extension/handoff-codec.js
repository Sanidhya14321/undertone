globalThis.UndertoneHandoff = (()=>{
const isTarget=code=>['en','hi','es','fr','de','ja','zh','ko','it','pt','ar'].includes(code);
function validateText(text){if(typeof text!=='string'||!text.trim()||text.length>20000)throw new Error('Use between 1 and 20,000 characters.');}
const MAX_IMPORT=384000;
function sanitizeSource(value){try{const url=new URL(value);return ['https:','http:'].includes(url.protocol)?url.origin+url.pathname:'';}catch{return '';}}
function validateImport(value){
 if(!value||typeof value!=='object')throw new Error('Invalid browser selection.');
 validateText(value.text);
 const data={text:value.text,title:typeof value.title==='string'?value.title.slice(0,100):'From your browser',url:sanitizeSource(value.url)};
 if(value.version!==undefined&&value.version!==2)throw new Error('Unsupported selection version.');
 if(value.translation!==undefined){const t=value.translation;if(!t||typeof t!=='object'||!isTarget(t.targetLanguage))throw new Error('Invalid translation metadata.');validateText(t.sourceText);data.version=2;data.translation={sourceText:t.sourceText,targetLanguage:t.targetLanguage};}
 return data;
}
function encodeImport(value){const data=validateImport(value);const bytes=new TextEncoder().encode(JSON.stringify(data));let binary='';for(let i=0;i<bytes.length;i+=4096)binary+=String.fromCharCode(...bytes.subarray(i,i+4096));const encoded=btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');if(encoded.length>MAX_IMPORT)throw new Error('This selection is too large to open in the studio. Download the text and import it instead.');return encoded;}
function decodeImport(encoded){if(encoded.length>MAX_IMPORT)throw new Error('Browser selection is too large.');return validateImport(JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(atob(encoded.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0)))));}

return {MAX_IMPORT,sanitizeSource,validateImport,encodeImport,decodeImport};
})();
