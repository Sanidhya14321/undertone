import {replaceSelection,validateText,isTarget} from '../extension/translation-core.mjs';
export function applyProjectTranslation(project,review,texts,target){
 if(!isTarget(target))throw new Error('Choose a target language.');
 if(review.projectId!==project.id||review.revision!==JSON.stringify(project))throw new Error('The project changed. Translate the updated text.');
 if(!Array.isArray(texts)||texts.some(t=>typeof t!=='string')||texts.join('').length>20000)throw new Error('Keep translated text under 20,000 characters.');
 const dialogue=review.kind==='dialogue';
 if(dialogue&&(texts.length!==project.lines.length||texts.some((t,i)=>project.lines[i].text.trim()&&!t.trim())))throw new Error('Keep a translation for every dialogue turn.');
 return {...project,...(dialogue?{lines:project.lines.map((l,i)=>({...l,text:texts[i]}))}:{text:replaceSelection(project.text,review.start,review.end,texts[0])}),language:target,translation:{sourceText:project.text,sourceLines:dialogue?project.lines.map(l=>({...l})):undefined,originalLanguage:project.language,targetLanguage:target},updated:Date.now()};
}
export function restoreProjectTranslation(project){const t=project.translation;if(!t)return project;return {...project,text:t.sourceText,lines:t.sourceLines||project.lines,language:t.originalLanguage,translation:undefined,updated:Date.now()};}
export function translatedTranscriptProject(project,text,sourceText,target){validateText(text);validateText(sourceText);if(!isTarget(target))throw new Error('Choose a target language.');return {...project,text,mode:'speech',language:target,translation:{sourceText,originalLanguage:'auto',targetLanguage:target}};}
