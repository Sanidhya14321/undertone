export type BrowserImport={text:string;title:string;url:string;version?:2;translation?:{sourceText:string;targetLanguage:string}};
export const MAX_IMPORT:number;
export function sanitizeSource(value:unknown):string;
export function validateImport(value:unknown):BrowserImport;
export function encodeImport(value:unknown):string;
export function decodeImport(encoded:string):BrowserImport;
