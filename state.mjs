import {LEVELS,MAX_ROUNDS,newPond,restorePond,pondPoints} from './engine.mjs?v=1';
export const STORAGE_KEY='koi-pond-v1';
export function emptyDay(){return{results:[],active:null};}
export function createStore(){return{version:1,days:{}};}
export function dayData(store,day){return store.days[day]||emptyDay();}
export function dailyTotal(store,day){return dayData(store,day).results.reduce((sum,r)=>sum+r.points,0);}
export function currentPond(store,day){const data=dayData(store,day);return data.results.length<3?restorePond(data.active,day,data.results.length):null;}
export function checkpoint(store,pond){if(!pond)return store;const data=dayData(store,pond.day);if(data.results.length!==pond.level)return store;return{version:1,days:{...store.days,[pond.day]:{...data,active:pond}}};}
export function finishPond(store,pond){const data=dayData(store,pond.day);if(pond.phase!=='finished'||data.results.length!==pond.level||pond.level>=3)throw Error('Pond not finished or already scored');const row={level:pond.level,completed:pond.completed,reason:pond.reason,points:pondPoints(pond.level,pond.completed)};return{version:1,days:{...store.days,[pond.day]:{results:[...data.results,row],active:null}}};}
export function restoreStore(raw){const store=createStore();if(raw?.version!==1||!raw.days||typeof raw.days!=='object')return store;for(const [day,value]of Object.entries(raw.days)){if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||!Array.isArray(value?.results)||value.results.length>3)continue;const data=emptyDay();for(const [level,r]of value.results.entries()){if(r.level!==level||!Number.isInteger(r.completed)||r.completed<0||r.completed>MAX_ROUNDS||!['repeat','time','mastered'].includes(r.reason)||(r.reason==='mastered')!==(r.completed===MAX_ROUNDS))break;data.results.push({level,completed:r.completed,reason:r.reason,points:pondPoints(level,r.completed)});}if(data.results.length<3&&value.active)data.active=restorePond(value.active,day,data.results.length);store.days[day]=data;}return store;}
