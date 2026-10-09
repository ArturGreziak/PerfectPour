(function(global){
'use strict';
class GameEngine{
 constructor(){this.phase='ready';this.level=1;this.score=0;this.fill=0;this.time=0;this.elapsed=0;this.spill=0;this.drops=[];this.holding=false;this.won=false;this.earned=0;this.bonus=false;this.emitted=0;}
 get target(){return .5+((this.level-1)%5)*.055} get tolerance(){return Math.max(.028,.065-this.level*.0012)+(this.bonus?.035:0)}
 get cupWidth(){return Math.max(76,116-this.level*1.2)} get cupX(){return 200+Math.sin(this.time*(.7+this.level*.055))*(62+this.level*1.2)}
 start(level=1,score=0){Object.assign(this,{level:Math.max(1,Math.min(30,level)),score:Math.max(0,score),fill:0,time:0,elapsed:0,spill:0,drops:[],holding:false,won:false,earned:0,phase:'play',emitted:0,bonus:false})}
 step(dt){if(this.phase!=='play')return;this.time+=dt;this.elapsed+=dt;if(this.holding){this.emitted+=dt*24;while(this.emitted>=1){this.emitted--;this.drops.push({x:200,y:130})}}
 this.drops=this.drops.filter(d=>{const old=d.y;d.y+=390*dt;if(old<440&&d.y>=440){if(Math.abs(d.x-this.cupX)<=this.cupWidth/2-5)this.fill+=.024;else this.spill++;return false}return true});
 if(this.fill>this.target+this.tolerance||this.spill>28||this.elapsed>=28)this.finish(false)}
 finish(won){this.holding=false;this.won=won;this.earned=won?Math.max(0,Math.trunc(1000*(1-Math.abs(this.fill-this.target)/this.tolerance*.4)+(28-this.elapsed)*10)):0;this.score+=this.earned;this.phase=won&&this.level===30?'finished':'result'}
 submit(){if(this.phase!=='play'||this.holding||this.drops.length)return false;this.finish(Math.abs(this.fill-this.target)<=this.tolerance);return true}
 next(){if(this.won&&this.level<30)this.start(this.level+1,this.score)} retry(){this.start(this.level,this.score)}
 snapshot(){return JSON.stringify({...this,holding:false})}
 restore(raw){try{const s=JSON.parse(raw);if(!s||!Number.isInteger(s.level)||s.level<1||s.level>30||!Number.isInteger(s.score)||s.score<0||s.score>1e6||!['play','result','finished'].includes(s.phase)||!Array.isArray(s.drops)||s.drops.length>50)throw Error();for(const k of ['fill','time','elapsed','emitted','spill','earned'])if(!Number.isFinite(s[k])||s[k]<0)throw Error();if(s.fill>2||s.time>30||s.elapsed>30||s.spill>29||s.emitted>=1||s.earned>2000)throw Error();for(const d of s.drops)if(d.x!==200||!Number.isFinite(d.y)||d.y<130||d.y>=440)throw Error();Object.assign(this,s,{holding:false,bonus:!!s.bonus});return true}catch{return false}}
}
if(typeof module!=='undefined')module.exports=GameEngine;global.GameEngine=GameEngine;
})(typeof window!=='undefined'?window:globalThis);
