export type Guide = {
  title: string;
  description: string;
  category: string;
  summary: string;
  action: { label: string; href: string };
  sections: { id: string; title: string; paragraphs: string[]; example?: string }[];
  relatedFeature: { label: string; href: string };
};

export const guideUpdated = '2026-10-19';
export const guides: Record<string, Guide> = {
  'fish-audio-text-to-speech': {
    title: 'How to use Fish Audio for expressive text to speech',
    description: 'Connect Fish Audio to Undertone, choose a voice, direct a script with Drama 3 cues, and export MP3, WAV, or Opus audio.',
    category: 'VOICE STUDIO',
    summary: 'From a written script to a directed voice take, using your own Fish Audio account. Start with one short passage, then refine the delivery.',
    action: { label: 'Try it in the voice studio', href: '/studio' },
    sections: [
      { id: 'connect', title: '1. Connect your Fish Audio account', paragraphs: [
        'Open the voice studio and choose Connect Fish Audio. Paste an API key from your Fish Audio account. Undertone checks the connection by requesting your voice library; speech generation uses your provider API credit.',
        'The studio keeps the key in memory for that tab and sends requests through its same-origin API proxy. Reloading disconnects it. There is no shared key or included generation allowance.'
      ] },
      { id: 'voice', title: '2. Choose a voice and a model', paragraphs: [
        'Choose a voice from the picker, browse the connected voice library, or enter a voice ID you are authorized to use. You can also select a private voice you created in your Fish Audio account.',
        'Drama 3 is the studio’s default for directed performances. If you change models, check which controls that model supports. A voice/reference ID identifies the speaker; it is different from the API key and model name.'
      ] },
      { id: 'direction', title: '3. Write a short script with clear direction', paragraphs: [
        'Paste your script into the editor. Add a short natural-language cue before the line, such as [warm, conversational]. The direction buttons insert a starting point; you can edit those words to match your scene.',
        'Keep the first audition short. Try changing one direction at a time so you can hear what helped. Use the speed control for pace, and preview pronunciation before generating a longer piece.'
      ], example: '[warm, conversational]\nThere’s a story here. Let’s give it a voice.\n\n[pause]\n[gentle smile]\nStart with the words that matter.' },
      { id: 'export', title: '4. Generate, compare, and export a take', paragraphs: [
        'Choose MP3, WAV, or Opus before generating. After the request finishes, play the actual audio in Your takes. Adjust the script or delivery and generate another version when needed; each generation is a new provider request.',
        'Download the take you want to keep. Projects save in this browser and audio saves in IndexedDB on this device. Clearing site data, switching browsers, or moving to another domain does not carry that work with you.'
      ] },
      { id: 'languages', title: 'Working with more than one language', paragraphs: [
        'Write the actual words in the language you want spoken. Undertone does not translate a script. The language control guides normalization and number pronunciation, and phrase-level language switching remains experimental.',
        'For a conversation, switch to Dialogue, cast each speaker, and write their turns. Listen to a short sample with the chosen voices before producing the full scene.'
      ] }
    ],
    relatedFeature: { label: 'Explore text-to-speech controls', href: '/features/text-to-speech' }
  },
  'read-webpages-aloud': {
    title: 'Read selected webpage text aloud with Fish Audio',
    description: 'Install the Undertone Chrome or Edge extension, connect your Fish Audio key, and listen to selected text or send it to the voice studio.',
    category: 'BROWSER COMPANION',
    summary: 'Turn a passage you choose into speech, or bring it into the studio for editing. The companion works on explicit selections rather than continuously reading your tabs.',
    action: { label: 'Get the browser companion', href: '/extension' },
    sections: [
      { id: 'install', title: '1. Install the unpacked extension', paragraphs: [
        'Download the extension ZIP from Undertone’s extension page and extract it into a folder you will keep. In Chrome, open chrome://extensions; in Edge, open edge://extensions. Enable Developer mode, choose Load unpacked, and select the folder containing manifest.json.',
        'Use Chrome or Edge 124 or newer. This package is a developer installation, not a Chrome Web Store listing. If you move the extracted files later, you may need to load the folder again.'
      ] },
      { id: 'settings', title: '2. Set up the listening voice', paragraphs: [
        'Open the extension from your browser toolbar. Add your Fish Audio API key and choose a model, voice/reference ID, and speed. Save the settings before starting playback.',
        'The key stays in browser session storage. Listening sends the selected text directly to Fish Audio using your account’s API credit. The extension has its own connection; connecting the website does not automatically connect the extension.'
      ] },
      { id: 'selection', title: '3. Select a passage and listen', paragraphs: [
        'Highlight the words you want to hear on a normal webpage. Use the extension’s capture control, or right-click the selection and choose the Undertone listening action. You can also paste text into the popup when capture is unavailable.',
        'The companion uses an offscreen audio document for playback. Only text you explicitly capture is used. It does not need browsing-history access or permission to continuously read every page.'
      ] },
      { id: 'handoff', title: '4. Open the passage in your studio', paragraphs: [
        'Choose the studio handoff action to open the selection as an editable script. The downloaded package targets the public Undertone studio; self-hosted installations can set another studio URL in the popup.',
        'The handoff uses a URL fragment containing the selected text, page title, and source path. The API key is excluded, and source query strings and fragments are stripped. The studio reads the import and removes the fragment from its address.'
      ] },
      { id: 'troubleshooting', title: 'When capture or playback does not work', paragraphs: [
        'Browser settings pages, extension stores, and some PDF viewers restrict script injection. Copy and paste the passage instead. For a normal page, make a fresh selection before opening the capture control.',
        'If Fish Audio rejects playback, check the key, available API credit, selected model, and voice ID. The public site’s help page explains common connection and generation errors. Do not share a key or private text in a public bug report.'
      ] }
    ],
    relatedFeature: { label: 'Installation and extension permissions', href: '/extension' }
  },
  'audio-to-srt-subtitles': {
    title: 'Turn audio into SRT or VTT subtitles with Fish Audio',
    description: 'Transcribe a recording in Undertone, review speaker turns, and export timestamped SRT or WebVTT subtitles with your Fish Audio API key.',
    category: 'TRANSCRIPTION',
    summary: 'Use the same workspace for a recording, its transcript, and your next voice script. Subtitle exports use the timestamps returned by Fish Audio.',
    action: { label: 'Open transcription', href: '/studio?view=transcribe' },
    sections: [
      { id: 'prepare', title: '1. Prepare a short recording', paragraphs: [
        'Choose an audio file you are authorized to process. This Vercel deployment accepts uploads up to 4 MB. Compress or split larger recordings before uploading; do not rename a file extension to pretend it is another audio format.',
        'Clear speech and limited background noise make a recording easier to review. Keep a copy of the original audio for checking words and timing after transcription.'
      ] },
      { id: 'transcribe', title: '2. Request a timestamped transcript', paragraphs: [
        'Open Transcription in the studio and connect your Fish Audio key. Choose the recording and enable speaker identification when you need speaker turns. Start transcription to send the file to Fish Audio.',
        'Undertone requests word timestamps with transcribe-1-pro. The operation uses your provider API credit. Long requests can time out before the hosting limit; split a recording into shorter sections if that happens.'
      ] },
      { id: 'review', title: '3. Review words and speaker turns', paragraphs: [
        'Read the returned transcript alongside the recording. Speaker labels describe turns detected within that recording; they do not verify a person’s identity. Names, specialist vocabulary, and overlapping speech deserve a manual check.',
        'You can edit transcript text for a corrected TXT export. Those edits do not change the original word timestamps or automatically rewrite the subtitle exports. Review the exported SRT or VTT separately if you need corrected captions.'
      ] },
      { id: 'formats', title: '4. Choose SRT, VTT, or TXT', paragraphs: [
        'Choose SRT for a numbered sequence of timed subtitle cues, or VTT for a WebVTT caption file commonly used with web video. TXT contains the transcript without subtitle timing. Your video player or editing tool determines which caption format to use.',
        'Download the export and preview it with the original recording before publishing. Check names, line breaks, synchronization, and speaker changes. Automatic timestamps are a starting point for caption review, not a guarantee of publication-ready accessibility.'
      ], example: '1\n00:00:00,000 --> 00:00:02,400\nA short example of an SRT cue.' },
      { id: 'new-script', title: 'Turn a transcript into a new script', paragraphs: [
        'Use Open as script to bring transcript text into the voice studio. Rewrite it for the listener, choose a voice, and add delivery directions before generating speech.',
        'This creates a new performance. It does not replace the original audio or automatically align the new voice with an existing video. Keep original recordings and important exports outside browser storage.'
      ] }
    ],
    relatedFeature: { label: 'Explore transcription and export options', href: '/features/transcription' }
  }
};

export const guideSlugs = Object.keys(guides);

export function getGuide(slug: string): Guide | undefined {
  return Object.hasOwn(guides, slug) ? guides[slug] : undefined;
}
