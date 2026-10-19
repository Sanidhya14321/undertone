export type Voice = { _id: string; title: string; description?: string; languages?: string[]; tags?: string[]; samples?: { audio?: string; text?: string }[]; };
export type DialogueLine = { id: string; speaker: number; text: string };
export type Project = { id: string; title: string; text: string; mode: 'speech'|'dialogue'; voiceId: string; speakers: string[]; lines: DialogueLine[]; model: string; speed: number; temperature: number; topP: number; format: string; language: string; direction: string; pronunciation: string; updated: number; };
export type Take = { id:string; projectId:string; title:string; voice:string; model:string; format:string; created:number; blob:Blob; text:string; duration?:number; };
export const PUBLIC_VOICES:Voice[] = [
  {_id:'c70cfb98867a4bfb9ae20d2401257b92',title:'Delia',description:'English · Female',languages:['en'],tags:['EN-US','Female']},
  {_id:'bf322df2096a46f18c579d0baa36f41d',title:'Adrian',description:'English · Male',languages:['en'],tags:['EN-US','Male']},
  {_id:'f3a2b90078d54a65af4b95f63bc7798e',title:'Sheila',description:'English · Female',languages:['en'],tags:['EN-US','Female']},
];
export const TEMPLATES = [
  {title:'A little more human',kind:'Narration',text:'[warm, thoughtful, like you’re telling a friend something that matters]\n\nThe best stories don’t just tell you something. They make you feel something.\n\n[pause] A familiar voice. A moment of quiet. The right words, at just the right time.\n\n[gentle smile] Let’s make something worth listening to.'},
  {title:'The owl has no excuses',kind:'Multilingual',text:'[bright, sweet, quietly persistent] You skipped your lesson.\n\n<spanish>Eso lo he entendido.</spanish>\n\n[french, politely skeptical] <french>Bien sûr. C’est ta dix-neuvième vidéo.</french>\n\n[soft, patient] <japanese>レッスンも、たった5分だよ。</japanese>\n\n[delighted] Your excuses translate beautifully.'},
  {title:'A new way to start',kind:'Product launch',text:'[confident, inviting, clear studio delivery]\nMeet a simpler way to do your best work.\n\nNot more tabs. Not more noise. Just a little more room for what matters.\n\n[slight emphasis] Your next chapter starts here.'},
];
export function newProject(template=TEMPLATES[0]):Project {
  return {id:crypto.randomUUID(),title:template.title,text:template.text,mode:'speech',voiceId:PUBLIC_VOICES[0]._id,speakers:PUBLIC_VOICES.slice(0,2).map(v=>v._id),lines:[{id:crypto.randomUUID(),speaker:0,text:'[curious] What makes a voice feel human?'},{id:crypto.randomUUID(),speaker:1,text:'[thoughtful, smiling] Maybe it’s the things you don’t say. [pause] And how you say everything else.'}],model:'drama-3',speed:1,temperature:.8,topP:.9,format:'mp3',language:'auto',direction:'',pronunciation:'',updated:Date.now()};
}
export function buildRequest(project:Project) {
  if (project.mode==='dialogue' && project.lines.some(l=>!project.speakers[l.speaker])) throw new Error('Assign a voice to every speaker first.');
  let text=project.mode==='dialogue'?project.lines.filter(l=>l.text.trim()).map(l=>`<|speaker:${l.speaker}|>${l.text}`).join('\n'):project.text;
  if (!text.trim()) throw new Error('Add some words to your script first.');
  if (text.length>20000) throw new Error('Keep each generation under 20,000 characters.');
  if (project.direction.trim()) text=`[${project.direction.trim()}]\n${text}`;
  const request: Record<string,unknown> = {text,reference_id:project.mode==='dialogue'?project.speakers:project.voiceId,format:project.format,temperature:project.temperature,top_p:project.topP,prosody:{speed:project.speed,volume:0}};
  if(project.language!=='auto')request.language=project.language;
  const items=project.pronunciation.split('\n').filter(l=>l.trim()).map(l=>{const i=l.indexOf('=');if(i<1||!l.slice(i+1).trim())throw new Error('Write pronunciations as word = spoken form, one per line.');return {key:l.slice(0,i).trim(),value:l.slice(i+1).trim()};});
  if(items.length)request.pronunciation_dictionary=[{items}];
  return request;
}
export function subtitleText(segments:{start:number;end:number;text:string}[],format:'srt'|'vtt') {
  const valid=segments.filter(s=>Number.isFinite(s.start)&&Number.isFinite(s.end)&&s.end>=s.start&&typeof s.text==='string');
  const cues:{start:number;end:number;text:string}[]=[];
  for (let i=0;i<valid.length;i+=8){const group=valid.slice(i,i+8);cues.push({start:group[0].start,end:Math.max(...group.map(s=>s.end)),text:group.map(s=>s.text).join(' ')});}
  const stamp=(value:number)=>{const ms=Math.round(Math.max(0,value)*1000);return `${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}${format==='srt'?',':'.'}${String(ms%1000).padStart(3,'0')}`;};
  return (format==='vtt'?'WEBVTT\n\n':'')+cues.map((c,i)=>`${format==='srt'?`${i+1}\n`:''}${stamp(c.start)} --> ${stamp(c.end)}\n${c.text}`).join('\n\n');
}
export function download(blob:Blob,name:string){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
export function safeName(name:string){return name.replace(/[^\p{L}\p{N}\-_ ]/gu,'').trim().slice(0,70)||'audio';}
let database:Promise<IDBDatabase>|null=null;
function db(){return database ||= new Promise((resolve,reject)=>{const request=indexedDB.open('undertone-takes',1);request.onupgradeneeded=()=>request.result.createObjectStore('takes',{keyPath:'id'});request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});}
export async function takeStore(action:'list'|'put'|'delete',value?:Take|string):Promise<Take[]>{
  const database=await db();return new Promise((resolve,reject)=>{const tx=database.transaction('takes',action==='list'?'readonly':'readwrite');const store=tx.objectStore('takes');const request=action==='list'?store.getAll():action==='put'?store.put(value):store.delete(value as string);let result:Take[]=[];request.onsuccess=()=>{if(action==='list')result=request.result as Take[];};tx.oncomplete=()=>resolve(result);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});
}
