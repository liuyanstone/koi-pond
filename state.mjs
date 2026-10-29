import {LEVELS,MAX_ROUNDS,newPond,restorePond,pondPoints} from './engine.mjs?v=gentle-3';
export const STORAGE_KEY='koi-pond-v1';
export function emptyDay(){return{results:[],active:null,extras:[]};}
export function createStore(){return{version:2,days:{}};}
export function dayData(store,day){return store.days[day]||emptyDay();}
export function bestByLevel(store,day){const data=dayData(store,day),best=[null,null,null];for(const row of [...data.results,...(data.extras||[])])if(!best[row.level]||row.points>best[row.level].points)best[row.level]=row;return best;}
export function dailyTotal(store,day){return bestByLevel(store,day).reduce((sum,r)=>sum+(r?.points||0),0);}
export function currentPond(store,day){const data=dayData(store,day);if(data.results.length<3)return restorePond(data.active,day,data.results.length);return data.active?restorePond(data.active,day,data.active.level):null;}
export function beginReplay(store,day,level){const data=dayData(store,day);if(data.results.length!==3||data.active)throw Error('Finish the current pond before replaying');if(!Number.isInteger(level)||!LEVELS[level])throw Error('Invalid difficulty');const pond=newPond(day,level,(data.extras||[]).length+1);return{version:2,days:{...store.days,[day]:{...data,active:pond}}};}
export function checkpoint(store,pond){if(!pond||pond.rules!==2)return store;const data=dayData(store,pond.day);const valid=pond.attempt>0?data.results.length===3&&data.active?.attempt===pond.attempt&&data.active?.level===pond.level:data.results.length===pond.level;if(!valid)return store;return{version:2,days:{...store.days,[pond.day]:{...data,active:pond}}};}
export function finishPond(store,pond){const data=dayData(store,pond.day),extra=pond.attempt>0;const valid=extra?data.results.length===3&&data.active?.attempt===pond.attempt&&data.active?.level===pond.level&&pond.attempt===(data.extras||[]).length+1:data.results.length===pond.level;if(pond.rules!==2||pond.phase!=='finished'||!valid||!LEVELS[pond.level])throw Error('Pond not finished or already scored');const row={rules:2,level:pond.level,completed:pond.completed,reason:pond.reason,points:pondPoints(pond.level,pond.completed)};return{version:2,days:{...store.days,[pond.day]:extra?{...data,extras:[...(data.extras||[]),{...row,attempt:pond.attempt}],active:null}:{...data,results:[...data.results,row],active:null}}};}
const EARLIER_COUNTS=[4,6,8],BONUSES=[50,100,200];
export function resultRoundLimit(row){return row?.rules===1?6:MAX_ROUNDS;}
function resultPoints(level,completed,rules){if(rules===2)return pondPoints(level,completed);const count=EARLIER_COUNTS[level];return completed*10*count*(count+1)/2+BONUSES[level]*completed*(completed+1)/2;}
function validResult(r,rules){const limit=rules===1?6:MAX_ROUNDS;return r&&[1,2].includes(rules)&&Number.isInteger(r.level)&&!!LEVELS[r.level]&&Number.isInteger(r.completed)&&r.completed>=0&&r.completed<=limit&&['repeat','time','mastered'].includes(r.reason)&&(r.reason==='mastered')===(r.completed===limit);}
function result(r,rules){return{rules,level:r.level,completed:r.completed,reason:r.reason,points:resultPoints(r.level,r.completed,rules)};}
export function restoreStore(raw){
 const store=createStore();if(![1,2].includes(raw?.version)||!raw.days||typeof raw.days!=='object')return store;
 for(const[day,value]of Object.entries(raw.days)){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||!Array.isArray(value?.results)||value.results.length>3)continue;
  const data=emptyDay();
  for(const[level,r]of value.results.entries()){const rules=raw.version===1?1:r?.rules;if(!validResult(r,rules)||r.level!==level)break;data.results.push(result(r,rules));}
  if(data.results.length<3&&value.active&&!(value.active.attempt>0))data.active=restorePond(value.active,day,data.results.length);
  if(data.results.length===3){
   for(const[i,r]of(Array.isArray(value.extras)?value.extras:[]).entries()){const rules=raw.version===1?1:r?.rules;if(!validResult(r,rules)||r.attempt!==i+1)break;data.extras.push({...result(r,rules),attempt:r.attempt});}
   const a=value.active;if(a&&Number.isInteger(a.level)&&LEVELS[a.level]&&a.attempt===data.extras.length+1)data.active=restorePond(a,day,a.level);
  }
  store.days[day]=data;
 }
 return store;
}
