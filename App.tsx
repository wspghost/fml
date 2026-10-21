import {useCallback,useEffect,useRef,useState} from 'react'
import {ArrowLeft,ArrowRight, X, Volume2, VolumeX} from 'lucide-react'
import World,{type Clue} from './World'
import './style.css'

type Overlay='home'|'instructions'|'about'|'cabinet'|'song'|'pause'|'portfolio'|null
type Song={name:string,sector:string,art:string,description:string,color:string,tempo:number,pattern:number[]}
const SONGS:Song[]=[
 {name:'RESIDENTIAL',sector:'01 / THE DWELLING',art:'/art/itsy-bitsy-spider.jpg',description:'Residential design — concept, site response, spatial planning, drawings and final presentation.',color:'#fb6b82',tempo:700,pattern:[0,1,2,3,1,0,3,2,0,2,1,3]},
 {name:'AURA',sector:'02 / THE EXPERIMENT',art:'/art/arcade.jpg',description:'Inclusive assistive-technology retail — research, accessible environments and design development.',color:'#38eee2',tempo:570,pattern:[1,2,1,3,0,2,3,1,0,3,2,1]},
 {name:'VOLCANA',sector:'03 / THE IGNITION',art:'/art/matchbox.jpg',description:'Volcanic-inspired Napoleon product design — materials, technical drawings and final design.',color:'#ff994b',tempo:480,pattern:[3,2,0,1,3,1,0,2,3,2,1,0]}
]
const ARROWS=['←','↑','→','↓']
export default function App(){
 const [overlay,setOverlay]=useState<Overlay>('home')
 const [entered,setEntered]=useState(false)
 const [locked,setLocked]=useState(false)
 const [near,setNear]=useState<Clue|null>(null)
 const [selected,setSelected]=useState(0)
 const [playing,setPlaying]=useState(false)
 const [step,setStep]=useState(0)
 const [score,setScore]=useState(0)
 const [misses,setMisses]=useState(0)
 const [completed,setCompleted]=useState<number[]>(()=>{try{return JSON.parse(localStorage.getItem('invitation-songs')||'[]')}catch{return []}})
 const [sound,setSound]=useState(false)
 const tick=useRef<number|null>(null)
 const state=useRef({playing:false,step:0,selected:0,hit:false})
 const open=useCallback((o:Overlay)=>{if(document.pointerLockElement)document.exitPointerLock();setOverlay(o)},[])
 const start=()=>{setEntered(true);setOverlay('instructions')}
 const resume=()=>{setOverlay(null);document.querySelector('canvas')?.requestPointerLock?.()}
 const interaction=useCallback((id:Clue)=>{if(id==='cabinet'){setSelected(0);open('cabinet')}else if(id==='door')open('instructions');else open('about')},[open])
 const stop=()=>{if(tick.current!==null)window.clearInterval(tick.current);tick.current=null;state.current.playing=false;setPlaying(false)}
 const finish=()=>{stop();setCompleted(old=>{const next=[...new Set([...old,state.current.selected])];try{localStorage.setItem('invitation-songs',JSON.stringify(next))}catch{}return next})}
 const launch=()=>{
  stop();setStep(0);setScore(0);setMisses(0);setPlaying(true);state.current={playing:true,step:0,selected,hit:false}
  tick.current=window.setInterval(()=>{
   if(!state.current.playing)return
   if(!state.current.hit && state.current.step>0)setMisses(n=>n+1)
   const next=state.current.step+1
   if(next>=SONGS[state.current.selected].pattern.length){finish();return}
   state.current.step=next;state.current.hit=false;setStep(next)
  },SONGS[selected].tempo)
 }
 const input=useCallback((direction:number)=>{
  if(!state.current.playing||state.current.hit)return
  const correct=SONGS[state.current.selected].pattern[state.current.step]===direction
  state.current.hit=true
  if(correct)setScore(s=>s+100);else setMisses(m=>m+1)
 },[])
 useEffect(()=>{
  const handler=(e:KeyboardEvent)=>{
   if(overlay==='song'&&playing){const map:Record<string,number>={ArrowLeft:0,ArrowUp:1,ArrowRight:2,ArrowDown:3,KeyA:0,KeyW:1,KeyD:2,KeyS:3};if(map[e.code]!==undefined){e.preventDefault();input(map[e.code])}return}
   if(e.code==='Escape'&&entered){if(overlay===null)open('pause');else if(overlay!=='home')open('pause')}
  }
  window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler)
 },[overlay,playing,entered,input,open])
 useEffect(()=>()=>{if(tick.current!==null)window.clearInterval(tick.current)},[])
 const choose=(index:number)=>{stop();setSelected((index+3)%3);setStep(0);setScore(0);setMisses(0)}
 const gameView=overlay==='cabinet'||overlay==='song'
 return <div className="app">
  <World active={entered} paused={overlay!==null} onLock={setLocked} onNear={setNear} onInteract={interaction}/>
  {entered&&overlay===null&&<div className="game-hud">
   <div className="top-label">THE INVITATION <span> / SIGNAL LOST /</span> ENTER THE BUILDING</div>
   <div className="crosshair">+</div>
   {locked&&near&&<div className="interact"><kbd>E</kbd> {near==='cabinet'?'PLAY THE ARCADE':near==='door'?'ENTER THE BUILDING':'EXAMINE'}</div>}
   {!locked&&<button className="relock" onClick={resume}>CLICK TO CONTINUE</button>}
   <div className="bottom-bar"><span>WASD MOVE · MOUSE LOOK · SHIFT SPRINT · E INTERACT</span><button onClick={()=>open('pause')}>ESC / MENU</button></div>
  </div>}
  {overlay==='home'&&<main className="new-home" aria-label="Video game home screen">
   <img src="/scene/home-original.jpg" alt="Original physical painting used as the home screen"/>
   <svg className="home-hotspots" viewBox="0 0 1024 768" preserveAspectRatio="xMidYMid slice" aria-label="Home screen interactive areas">
    <g className="star-hotspot" role="button" tabIndex={0} aria-label="Start game" onClick={start} onKeyDown={e=>{if(e.key==='Enter'||e.key===' ')start()}}>
     <path d="M176 357 L199 399 L246 407 L211 441 L219 490 L176 466 L132 490 L140 441 L106 407 L153 399 Z" fill="#f7e2b5" stroke="#ee513d" strokeWidth="8" strokeLinejoin="round"/>
     <path d="M176 370 L194 410 L230 413 L203 442 L210 475 L176 455 L144 475 L150 441 L123 414 L159 410 Z" fill="#141318"/>
     <text x="176" y="436" textAnchor="middle" className="star-word">START</text>
    </g>
    <g className="lady-hotspot" role="button" tabIndex={0} aria-label="About me: select illustrated woman" onClick={()=>open('about')} onKeyDown={e=>{if(e.key==='Enter'||e.key===' ')open('about')}}>
     <path d="M565 89 L557 98 L552 110 L554 125 L547 137 L543 151 L547 162 L540 180 L537 196 L541 212 L538 229 L543 246 L539 263 L544 280 L550 299 L553 320 L568 328 L584 329 L589 320 L591 303 L593 284 L588 263 L591 243 L587 221 L594 201 L589 182 L583 167 L581 152 L587 139 L581 122 L583 108 L577 95 Z"/>
     <text x="578" y="356" textAnchor="middle" className="lady-label">ABOUT ME</text>
    </g>
   </svg>
   <div className="home-footer">THE INVITATION <span>—</span> SELECT YOUR PATH</div>
  </main>}
  {overlay&&overlay!=='home'&&<div className="screen-overlay"><section className={'ui-panel '+(gameView?'wide':'')}>
   <button className="close" aria-label="Close" onClick={()=>{stop();entered?resume():open('home')}}><X size={21}/></button>
   {overlay==='instructions'&&<><div className="eyebrow">LEVEL 01 / THE ENTRY</div><h1>ENTER THE BUILDING</h1><p>You're outside on a deserted street. Walk toward the painted building and enter through its dark doorway. Inside, follow the red string to the arcade machine.</p><div className="control-grid"><span>W A S D</span><span>WALK</span><span>MOUSE</span><span>LOOK</span><span>SHIFT</span><span>SPRINT</span><span>E</span><span>INTERACT</span><span>ESC</span><span>PAUSE</span></div><button className="action" onClick={resume}>ENTER THE WORLD <ArrowRight size={18}/></button></>}
   {overlay==='about'&&<><div className="eyebrow">THE PERSON BEHIND THE WORK</div><h1>ABOUT ME</h1><div className="about-layout"><img src="/art/reflection.jpg" alt="Original figurative artwork"/><div><p>An emerging interior designer whose practice explores how artwork, technology and spatial experience can intersect.</p><p className="placeholder">PERSONAL BIO PLACEHOLDER — Replace with your own introduction and résumé details.</p><button className="action" onClick={()=>{setSelected(0);open('portfolio')}}>VIEW MY WORK</button></div></div></>}
   {overlay==='cabinet'&&<><div className="eyebrow">THE ARCADE / THREE TRACKS AVAILABLE</div><h1>CHOOSE YOUR TRACK</h1><p>Each song is a different design project. Play the sequence to unlock a project reveal — or open the project immediately.</p><div className="track-select"><button aria-label="Previous track" onClick={()=>choose(selected-1)}><ArrowLeft/></button><div className="track-art" style={{borderColor:SONGS[selected].color}}><img src={SONGS[selected].art} alt="Original artwork for selected track"/></div><button aria-label="Next track" onClick={()=>choose(selected+1)}><ArrowRight/></button></div><div className="track-title" style={{color:SONGS[selected].color}}>{SONGS[selected].name}</div><div className="eyebrow">{SONGS[selected].sector} {completed.includes(selected)?' / CLEARED':''}</div><div className="menu-actions"><button className="action" onClick={()=>open('song')}>PLAY TRACK <ArrowRight size={17}/></button><button className="outline-action" onClick={()=>open('portfolio')}>VIEW PROJECT</button></div></>}
   {overlay==='song'&&<><div className="eyebrow">NOW PLAYING / {SONGS[selected].sector}</div><h1 style={{color:SONGS[selected].color}}>{SONGS[selected].name}</h1><div className="rhythm-board"><div className="beat-counter">BEAT {Math.min(step+1,SONGS[selected].pattern.length)} / {SONGS[selected].pattern.length}</div><div className="beat-arrow">{ARROWS[SONGS[selected].pattern[step]]}</div><div className="arrow-keys">{ARROWS.map((a,i)=><button key={a} onClick={()=>input(i)} disabled={!playing}>{a}</button>)}</div><div className="beat-score">SCORE {score.toString().padStart(4,'0')} <span>MISSES {misses}</span></div></div><p>Press the matching arrow key when it appears. This first version is a playable input-sequence prototype; music and precise beat timing can be added with your own audio.</p><div className="menu-actions">{!playing?<button className="action" onClick={launch}>{step===0?'START SEQUENCE':'REPLAY TRACK'}</button>:<button className="outline-action" onClick={stop}>STOP</button>}<button className="outline-action" onClick={()=>{stop();open('cabinet')}}>SONG SELECT</button><button className="outline-action" onClick={()=>{stop();open('portfolio')}}>VIEW PROJECT</button></div>{completed.includes(selected)&&!playing&&<div className="cleared">TRACK CLEARED — PROJECT FILE AVAILABLE</div>}</>}
   {overlay==='portfolio'&&<><div className="eyebrow">PROJECT FILE / {SONGS[selected].sector}</div><h1>{SONGS[selected].name}</h1><div className="about-layout"><img src={SONGS[selected].art} alt={`Original art for ${SONGS[selected].name}`}/><div><p>{SONGS[selected].description}</p><p className="placeholder">PROJECT CONTENT PLACEHOLDER — Add drawings, renders, specifications and descriptions here.</p><button className="outline-action" onClick={()=>open('cabinet')}>BACK TO TRACK SELECT</button></div></div></>}
   {overlay==='pause'&&<><div className="eyebrow">GAME PAUSED</div><h1>THE INVITATION</h1><div className="menu-actions vertical"><button className="action" onClick={resume}>RESUME</button><button className="outline-action" onClick={()=>open('cabinet')}>SONG SELECT</button><button className="outline-action" onClick={()=>setSound(s=>!s)}>{sound?<Volume2 size={17}/>:<VolumeX size={17}/>} AUDIO {sound?'ON (TRACKS NOT LOADED)':'OFF'}</button><button className="outline-action" onClick={()=>{setEntered(false);open('home')}}>HOME SCREEN</button></div></>}
  </section></div>}
 </div>
}
