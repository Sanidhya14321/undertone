import test from 'node:test';
import assert from 'node:assert/strict';
import { newProject,buildRequest,subtitleText,safeName } from '../lib/studio.ts';
import { proxyFish } from '../lib/fish-proxy.mjs';
const request=(path='v1/tts',options={})=>new Request(`https://studio.example/api/fish/${path}`,{method:'POST',headers:{'x-fish-key':'test-secret','model':'drama-3','content-type':'application/json',origin:'https://studio.example',...options.headers},body:'{"text":"Hello"}',...options});
test('single voice request preserves performance directions and output settings',()=>{
 const p=newProject();p.direction='quiet, intimate';p.text='[pause] Hello.';p.language='ja';p.format='wav';p.speed=1.25;p.pronunciation='Undertone = under tone';
 const r=buildRequest(p);assert.equal(r.text,'[quiet, intimate]\n[pause] Hello.');assert.equal(r.language,'ja');assert.equal(r.format,'wav');assert.deepEqual(r.prosody,{speed:1.25,volume:0});assert.deepEqual(r.pronunciation_dictionary,[{items:[{key:'Undertone',value:'under tone'}]}]);
});
test('dialogue keeps speaker tags aligned with the voice array',()=>{
 const p=newProject();p.mode='dialogue';p.speakers=['first','second'];p.lines=[{id:'a',speaker:1,text:'Hello'},{id:'b',speaker:0,text:'Hi'}];const r=buildRequest(p);assert.equal(r.text,'<|speaker:1|>Hello\n<|speaker:0|>Hi');assert.deepEqual(r.reference_id,['first','second']);delete p.speakers[1];assert.throws(()=>buildRequest(p),/Assign a voice/);
});
test('empty scripts, missing voices and invalid pronunciation rules cannot generate',()=>{
 const p=newProject();p.text=' ';assert.throws(()=>buildRequest(p),/Add some words/);p.text='hello';p.pronunciation='broken rule';assert.throws(()=>buildRequest(p),/word = spoken/);p.text='x'.repeat(20001);assert.throws(()=>buildRequest(p),/20,000/);
});
test('subtitle exports handle time boundaries and invalid timestamp segments',()=>{
 const segments=[{start:59.9996,end:61.101,text:'Hello'},{start:61.2,end:62,text:'world'},{start:NaN,end:1,text:'bad'}];
 assert.match(subtitleText(segments,'srt'),/00:01:00,000 --> 00:01:02,000\nHello world/);assert.match(subtitleText(segments,'vtt'),/^WEBVTT\n\n00:01:00.000/);assert.equal(subtitleText([],'srt'),'');assert.equal(safeName('../../hello!'),'hello');
});
test('proxy rejects missing credentials, arbitrary routes, bad models and cross-origin calls',async()=>{
 const missing=await proxyFish(new Request('https://studio.example/api/fish/v1/tts',{method:'POST'}),'v1/tts');assert.equal(missing.status,401);
 assert.equal((await proxyFish(request(),'evil')).status,404);
 assert.equal((await proxyFish(request('v1/tts',{headers:{'x-fish-key':'test-secret',model:'misspelled'}}),'v1/tts')).status,400);
 assert.equal((await proxyFish(request('v1/tts',{headers:{'x-fish-key':'test-secret',model:'drama-3',origin:'https://other.example'}}),'v1/tts')).status,403);
});
test('proxy forwards explicit model header and binary audio without leaking credentials',async()=>{
 let input;const fake=async(url,options)=>{input={url,options};return new Response(new Uint8Array([1,2,3]),{headers:{'content-type':'audio/mpeg'}});};
 const response=await proxyFish(request(),'v1/tts',fake);assert.equal(input.url.toString(),'https://api.fish.audio/v1/tts');assert.equal(input.options.headers.get('model'),'drama-3');assert.equal(input.options.headers.get('authorization'),'Bearer test-secret');assert.equal(input.options.headers.get('x-fish-key'),null);assert.equal(response.headers.get('cache-control'),'no-store');assert.deepEqual([...new Uint8Array(await response.arrayBuffer())],[1,2,3]);
});
test('proxy preserves multipart boundary and limits voice search parameters',async()=>{
 const form=new FormData();form.set('audio',new Blob(['audio'],{type:'audio/wav'}),'test.wav');let received;
 const fake=async(url,options)=>{received={url,options};return Response.json({text:'hello'});};
 const req=new Request('https://studio.example/api/fish/v1/asr',{method:'POST',headers:{'x-fish-key':'test-secret',model:'transcribe-1-pro'},body:form});await proxyFish(req,'v1/asr',fake);assert.match(received.options.headers.get('content-type'),/multipart\/form-data; boundary=/);assert.match(new TextDecoder().decode(received.options.body),/test.wav/);
 await proxyFish(new Request('https://studio.example/api/fish/model?self=true&page_size=18&malicious=1',{headers:{'x-fish-key':'test-secret'}}),'model',fake);assert.equal(received.url.searchParams.get('self'),'true');assert.equal(received.url.searchParams.has('malicious'),false);
});
test('provider errors are actionable, secrets are redacted, and network failures are controlled',async()=>{
 assert.equal((await proxyFish(request(),'v1/tts',async()=>Response.json({message:'out of money'},{status:402}))).status,402);
 const redacted=await proxyFish(request(),'v1/tts',async()=>Response.json({message:'problem test-secret'},{status:400}));assert.equal((await redacted.json()).message,'problem [redacted]');
 assert.equal((await proxyFish(request(),'v1/tts',async()=>{throw new Error('network');})).status,502);
 const big=new Request('https://studio.example/api/fish/v1/tts',{method:'POST',headers:{'x-fish-key':'test-secret',model:'drama-3','content-length':String(26*1024*1024)},body:'x'});assert.equal((await proxyFish(big,'v1/tts')).status,413);
});
