import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync('extension/connection.js','utf8')+'\n'+fs.readFileSync('extension/background.js','utf8');
function harness(settings={},session={}){
 let onMessage;const created=[],messages=[];
 const chrome={runtime:{id:'extension-test',onInstalled:{addListener(){}},onMessage:{addListener(fn){onMessage=fn;}},getURL:p=>'chrome-extension://extension-test/'+p,getContexts:async()=>[{id:'offscreen'}],sendMessage:async m=>{messages.push(m);return {ok:true};}},storage:{local:{get:async()=>settings,set:async v=>Object.assign(settings,v),remove:async k=>{delete settings[k];}},session:{get:async()=>session,set:async v=>Object.assign(session,v)}},tabs:{create:async data=>created.push(data)},action:{setBadgeText(){},setBadgeBackgroundColor(){}},offscreen:{createDocument:async()=>{}},contextMenus:{onClicked:{addListener(){}},removeAll:async()=>{},create(){}}};
 vm.runInNewContext(source,{chrome,URL,TextEncoder,btoa,console,importScripts(){},UNDERTONE_DEFAULT_STUDIO:'https://studio.example/studio'});
 const send=(action,selection={text:'Hello 世界 👋',title:'A test page',url:'https://example.com/read'})=>new Promise(resolve=>onMessage({target:'background',action,selection},{id:'extension-test'},resolve));
 return {send,created,messages,session};
}
test('extension uses narrow permissions and packages all referenced scripts',()=>{
 const manifest=JSON.parse(fs.readFileSync('extension/manifest.json','utf8'));assert.equal(manifest.manifest_version,3);assert.deepEqual(manifest.host_permissions,['https://api.fish.audio/*']);assert(!manifest.permissions.includes('tabs'));assert(!manifest.permissions.includes('history'));
 for(const file of [manifest.background.service_worker,manifest.action.default_popup,'offscreen.js','popup.js','connection.js'])assert(fs.existsSync('extension/'+file));
});
test('extension studio handoff preserves Unicode and contains no API key',async()=>{
 const h=harness({studioUrl:'https://studio.example'},{apiKey:'private-key'});const result=await h.send('studio');assert(result.ok);const url=new URL(h.created[0].url);assert.equal(url.origin,'https://studio.example');const data=JSON.parse(Buffer.from(url.hash.slice(8).replace(/-/g,'+').replace(/_/g,'/'),'base64').toString());assert.equal(data.text,'Hello 世界 👋');assert.equal(data.url,'https://example.com/read');assert(!h.created[0].url.includes('private-key'));assert(!JSON.stringify(data).includes('private-key'));
});
test('extension rejects unsafe studio URLs and missing API credentials',async()=>{
 const h=harness({studioUrl:'javascript:alert(1)'});assert.equal((await h.send('studio')).ok,false);assert.equal(h.created.length,0);assert.equal((await h.send('listen')).ok,false);assert.match(h.session.playbackStatus,/API key/);
});
test('extension routes playback to its offscreen document with the selected settings',async()=>{
 const h=harness({model:'s2.1-pro',voiceId:'my-voice-id',speed:1.25},{apiKey:'test-key'});assert((await h.send('listen')).ok);assert.equal(h.messages[0].target,'offscreen');assert.equal(h.messages[0].model,'s2.1-pro');assert.equal(h.messages[0].voiceId,'my-voice-id');assert.equal(h.messages[0].speed,1.25);assert.equal(h.messages[0].text,'Hello 世界 👋');
});
test('offscreen document reports status through runtime, without unsupported storage APIs',async()=>{
 let listener;const messages=[];const audio={pause(){},removeAttribute(){},addEventListener(){},play:async()=>{}};
 const chrome={runtime:{id:'test',onMessage:{addListener(fn){listener=fn;}},sendMessage:async message=>messages.push(message)}};
 vm.runInNewContext(fs.readFileSync('extension/offscreen.js','utf8'),{chrome,document:{querySelector:()=>audio},URL,AbortController,AbortSignal,console});
 listener({target:'offscreen',action:'stop'},{id:'test'},()=>{});assert.equal(messages[0].target,'background');assert.equal(messages[0].action,'playback-status');assert.equal(messages[0].message,'Playback stopped.');
});

test('extension restores a remembered key after a browser session restart',async()=>{
 const h=harness({savedApiKey:'remembered-test-key'});assert((await h.send('listen')).ok);assert.equal(h.session.apiKey,'remembered-test-key');assert.equal(h.messages[0].apiKey,'remembered-test-key');
});
test('extension remember choice survives session resets and disconnect clears both stores',async()=>{
 const local={},session={};const area=data=>({get:async key=>({[key]:data[key]}),set:async value=>Object.assign(data,value),remove:async key=>{delete data[key];}});
 const context={chrome:{storage:{local:area(local),session:area(session)}}};vm.runInNewContext(fs.readFileSync('extension/connection.js','utf8'),context);
 await context.saveConnectionKey('synthetic-key',true);delete session.apiKey;assert.equal(await context.getConnectionKey(),'synthetic-key');
 await context.saveConnectionKey('session-key',false);assert.equal(local.savedApiKey,undefined);assert.equal(session.apiKey,'session-key');
 await context.saveConnectionKey('remembered-again',true);await context.forgetConnectionKey();assert.equal(local.savedApiKey,undefined);assert.equal(session.apiKey,undefined);
});
