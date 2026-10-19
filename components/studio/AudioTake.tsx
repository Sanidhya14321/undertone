'use client';
import { useEffect, useRef, useState } from 'react';
import { Download, Pause, Play, Volume2, VolumeX, AudioLines } from 'lucide-react';
import { download, safeName, type Take } from '../../lib/studio';
const clock=(n:number)=>`${Math.floor(n/60)}:${String(Math.floor(n%60)).padStart(2,'0')}`;
export default function AudioTake({take}:{take:Take|null}){
  const audio=useRef<HTMLAudioElement>(null);const [url,setUrl]=useState(''),[playing,setPlaying]=useState(false),[duration,setDuration]=useState(0),[time,setTime]=useState(0),[muted,setMuted]=useState(false),[peaks,setPeaks]=useState<number[]>([]);
  useEffect(()=>{
    setPlaying(false);setTime(0);setDuration(0);setPeaks([]);if(!take){setUrl('');return;}
    const url=URL.createObjectURL(take.blob);setUrl(url);let active=true;
    const context=new AudioContext();
    take.blob.arrayBuffer().then(data=>context.decodeAudioData(data)).then(buffer=>{
      if(!active)return;const data=buffer.getChannelData(0),count=100,step=Math.max(1,Math.floor(data.length/count)),values=[];
      for(let i=0;i<count;i++){let sum=0,samples=0;for(let j=i*step;j<Math.min((i+1)*step,data.length);j+=16){sum+=Math.abs(data[j]);samples++;}values.push(samples?sum/samples:0);}
      const max=Math.max(...values,.001);setPeaks(values.map(v=>v/max));
    }).catch(()=>{}).finally(()=>context.close().catch(()=>{}));
    return()=>{active=false;URL.revokeObjectURL(url);};
  },[take?.id]);
  async function toggle(){if(!audio.current)return;try{if(playing)audio.current.pause();else await audio.current.play();}catch{setPlaying(false);}}
  if(!take)return <div className="take-empty"><span className="empty-sound"><AudioLines size={25}/></span><div><strong>Your next great take starts here.</strong><p>Generate your script. Listen, refine, make it yours.</p></div><span className="empty-format">MP3 / WAV / OPUS</span></div>;
  return <div className="take-player"><audio ref={audio} src={url} muted={muted} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onEnded={()=>setPlaying(false)} onLoadedMetadata={e=>setDuration(Number.isFinite(e.currentTarget.duration)?e.currentTarget.duration:0)} onTimeUpdate={e=>setTime(e.currentTarget.currentTime)}/><button className="take-play" onClick={toggle} aria-label={playing?'Pause audio':'Play audio'}>{playing?<Pause size={18}/>:<Play size={18}/>}</button><div className="take-body"><div className="take-meta"><strong>{take.title}</strong><span>{take.voice} <i>·</i> {take.model} <i>·</i> {take.format.toUpperCase()}</span></div><div className="wave-track"><svg viewBox="0 0 500 35" preserveAspectRatio="none" aria-hidden="true">{peaks.length?peaks.map((v,i)=><rect key={i} x={i*5} y={17.5-Math.max(2,v*31)/2} width="2.4" height={Math.max(2,v*31)} rx="1" fill={i/100<time/(duration||1)?'#d97859':'#d5d8d6'}/>):<path d="M0 17h500" stroke="#d4d7d4" strokeWidth="2"/>}</svg><input type="range" min="0" max={duration||1} step="0.01" value={time} aria-label="Seek audio" onChange={e=>{if(audio.current)audio.current.currentTime=+e.target.value;setTime(+e.target.value);}}/></div></div><span className="audio-time">{clock(time)} / {clock(duration)}</span><button className="icon-button mute-take" onClick={()=>setMuted(!muted)} aria-label={muted?'Unmute playback':'Mute playback'}>{muted?<VolumeX size={17}/>:<Volume2 size={17}/>}</button><button className="icon-button download-take" aria-label="Download audio" onClick={()=>download(take.blob,`${safeName(take.title)}.${take.format}`)}><Download size={18}/></button></div>;
}
