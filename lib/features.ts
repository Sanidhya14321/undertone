export const features = {
 'text-to-speech': {
  title:'Expressive text to speech with Fish Audio',
  description:'Turn scripts into expressive speech with Drama 3 delivery directions, pronunciation controls, multi-speaker dialogue, and downloadable audio.',
  eyebrow:'SPEECH, WITH A POINT OF VIEW.',
  headline:'The right words.\nThe right delivery.',
  intro:'A script is only half the story. Undertone gives you a place to direct how every line should feel, using your own Fish Audio account.',
  link:'/studio',action:'Open voice studio',
  steps:[['Write the moment.','Paste a script, import a text file, or capture a selection with the browser extension.'],['Direct the performance.','Choose a voice and add natural-language cues such as [warm, conversational], [pause], or [whispering].'],['Keep the take.','Generate MP3, WAV, or Opus audio. Listen, adjust your direction, and download the versions you want to keep.']],
  details:[['Dialogue that belongs together','Assign voices to speakers and write turns in one script. The studio sends the scene as one Fish Audio request with matching speaker tags.'],['Room for the details','Adjust pace and expressiveness, set pronunciation replacements, and apply delivery tags to selected words.'],['Multilingual scripts','Write in the languages you need. Experimental phrase-level language tags are available; pronunciation depends on the voice and language pair.']],
 },
 'voice-cloning': {
  title:'Private voice cloning and voice design',
  description:'Create a private Fish Audio voice from a permissioned recording, or audition new voices from a written brief. Bring your chosen voice into the studio.',
  eyebrow:'A VOICE THAT FEELS LIKE YOURS.',
  headline:'Start with a voice.\nGive it a character.',
  intro:'Build a reusable private voice from a clean reference recording, or describe a new voice and compare generated auditions. Undertone connects both workflows to your Fish Audio account.',
  link:'/studio?view=voices&tool=clone',action:'Explore voice cloning',
  steps:[['Bring a clear reference.','Use a recording of your own voice or a speaker who has given permission. A clean 10–30 second sample is a useful starting point.'],['Create a private voice.','Name the voice, optionally add an accurate transcript, and create a private fast voice model in Fish Audio.'],['Put it to work.','Choose the new voice in your studio and direct narration or dialogue with the same editing controls.']],
  details:[['Your account, your collection','Private voice creation uses your own Fish Audio key. The app does not make the voice public.'],['Or begin with a written brief','Voice design generates one to four WAV auditions from a description of texture, pace, accent, and character.'],['Permission comes first','Only clone your own voice or a voice you have permission to use. Reference recordings are sent to Fish Audio when you create the model.']],
 },
 'transcription': {
  title:'Audio transcription with speaker turns and subtitles',
  description:'Transcribe audio with Fish Audio, review speaker turns, and export TXT, SRT, or VTT. Turn your transcript into a new voice project.',
  eyebrow:'FROM SOUND TO SOMETHING USEFUL.',
  headline:'Every word.\nA little easier to find.',
  intro:'Turn a recording into an editable transcript, review speaker turns, and export subtitle files from the original timestamps. Keep the workflow close to your voice projects.',
  link:'/studio?view=transcribe',action:'Open transcription',
  steps:[['Choose your recording.','Upload an audio file up to 4 MB. The app uses Fish Audio transcribe-1-pro with word timestamps.'],['Read it back.','Review the transcript and optional speaker turns. Edit the transcript text where a correction is needed.'],['Take the next step.','Download TXT, SRT, or VTT, or open the transcript as a new script in the voice studio.']],
  details:[['Speaker turns when available','Request speaker identification for multi-speaker audio. Speaker labels describe turns in that recording, rather than verified identities.'],['Subtitles from actual timing','SRT and VTT use the original word timestamps. Text edits apply to TXT; they do not realign the recording.'],['No separate transcription account','The same Fish Audio key powers the request. The file is sent only when you choose to transcribe it.']],
 },
} as const;
export const featureSlugs=Object.keys(features) as (keyof typeof features)[];
