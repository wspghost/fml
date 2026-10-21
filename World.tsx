import {useEffect,useMemo,useRef} from 'react'
import {Canvas,useFrame,useThree} from '@react-three/fiber'
import {Text,useTexture} from '@react-three/drei'
import * as THREE from 'three'
export type Clue='cabinet'|'door'|'art'
type Props={active:boolean;paused:boolean;onInteract:(id:Clue)=>void;onLock:(v:boolean)=>void;onNear:(v:Clue|null)=>void}
const H=1.68
function canMove(x:number,z:number){
 const r=.28
 if(x<-7+r||x>7-r||z>10-r||z<-26+r)return false
 // The facade has an actual central opening; the rest is solid.
 if(z>-10.2&&z<-9.45&&Math.abs(x)>1.65-r)return false
 // Arcade cabinet and side obstacles.
 if(z<-20.7&&z>-22.4&&Math.abs(x)<1.55+r)return false
 if(z<-12&&z>-17&&Math.abs(x)>6.3-r)return false
 return true
}
function Controller({active,paused,onInteract,onLock,onNear}:Props){
 const {camera,gl}=useThree();const keys=useRef(new Set<string>()),locked=useRef(false),near=useRef<Clue|null>(null),yaw=useRef(0),pitch=useRef(0),callbacks=useRef({onInteract,onNear});callbacks.current={onInteract,onNear}
 useEffect(()=>{camera.position.set(0,H,7);camera.rotation.order='YXZ'},[camera])
 useEffect(()=>{
  const canvas=gl.domElement
  const change=()=>{locked.current=document.pointerLockElement===canvas;onLock(locked.current)}
  const mouse=(e:MouseEvent)=>{if(!locked.current||paused)return;yaw.current-=e.movementX*.002;pitch.current=THREE.MathUtils.clamp(pitch.current-e.movementY*.002,-1.25,1.25)}
  const down=(e:KeyboardEvent)=>{keys.current.add(e.code);if(['ArrowUp','ArrowDown','Space'].includes(e.code))e.preventDefault();if(e.code==='KeyE'&&!e.repeat&&locked.current&&near.current)callbacks.current.onInteract(near.current)}
  const up=(e:KeyboardEvent)=>keys.current.delete(e.code),blur=()=>keys.current.clear()
  document.addEventListener('pointerlockchange',change);document.addEventListener('mousemove',mouse);window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',blur)
  return()=>{document.removeEventListener('pointerlockchange',change);document.removeEventListener('mousemove',mouse);window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',blur)}
 },[gl,onLock,paused])
 useEffect(()=>{if(paused&&document.pointerLockElement===gl.domElement)document.exitPointerLock()},[paused,gl])
 useFrame((_,delta)=>{
  camera.rotation.set(pitch.current,yaw.current,0,'YXZ')
  if(!active||paused||!locked.current)return
  const dt=Math.min(delta,.05),forward=Number(keys.current.has('KeyW'))-Number(keys.current.has('KeyS')),side=Number(keys.current.has('KeyD'))-Number(keys.current.has('KeyA'))
  const dir=new THREE.Vector3(side,0,-forward)
  if(dir.lengthSq()){dir.normalize().applyAxisAngle(new THREE.Vector3(0,1,0),yaw.current).multiplyScalar(dt*(keys.current.has('ShiftLeft')?4.8:2.5));if(canMove(camera.position.x+dir.x,camera.position.z))camera.position.x+=dir.x;if(canMove(camera.position.x,camera.position.z+dir.z))camera.position.z+=dir.z}
  const look=new THREE.Vector3();camera.getWorldDirection(look)
  let best:Clue|null=null;for(const [id,pos] of [['cabinet',[0,1.6,-20.6]],['art',[4.5,2.2,-15.3]]] as [Clue,number[]][]){const v=new THREE.Vector3(...pos).sub(camera.position),distance=v.length();if(distance<3.2&&v.normalize().dot(look)>.75){best=id;break}}
  if(near.current!==best){near.current=best;callbacks.current.onNear(best)}
 })
 return null
}
function Block({p,s,c,emissive}:{p:[number,number,number];s:[number,number,number];c:string;emissive?:string}){return <mesh position={p} castShadow receiveShadow><boxGeometry args={s}/><meshStandardMaterial color={c} roughness={.86} emissive={emissive||'#000'} emissiveIntensity={emissive?1.7:0}/></mesh>}
function Facade(){
 const texture=useTexture('/scene/entry-wall.jpg');texture.colorSpace=THREE.SRGBColorSpace
 const segments=[{x:-4.3,w:5.4,u:0,v:.39},{x:4.3,w:5.4,u:.61,v:.39}]
 return <group>
  {/* Page 2 painting mapped onto both sides of a real walk-through opening. */}
  {segments.map((s,i)=>{const t=texture.clone();t.needsUpdate=true;t.wrapS=THREE.ClampToEdgeWrapping;t.repeat.set(s.v,1);t.offset.set(s.u,0);return <mesh key={i} position={[s.x,3.25,-9.85]}><planeGeometry args={[s.w,6.5]}/><meshBasicMaterial map={t} side={THREE.DoubleSide}/></mesh>})}
  <Block p={[0,5.55,-9.87]} s={[3.2,1.9,.35]} c="#070912"/>
  <Block p={[-1.7,2.3,-9.85]} s={[.24,4.6,.45]} c="#1d1b32" emissive="#36234d"/>
  <Block p={[1.7,2.3,-9.85]} s={[.24,4.6,.45]} c="#1d1b32" emissive="#36234d"/>
  <Block p={[0,4.65,-9.85]} s={[3.55,.18,.45]} c="#ed315e" emissive="#ed315e"/>
  <Text position={[0,5.8,-9.45]} fontSize={.34} color="#f5b4ad">THE INVITATION</Text>
  <Text position={[0,4.24,-9.45]} fontSize={.18} color="#32e8d6">ENTER / SIGNAL 001</Text>
 </group>
}
function Cable(){const path=useMemo(()=>new THREE.CatmullRomCurve3([[0,.07,5],[.6,.07,1],[.2,.07,-3],[-.2,.07,-8],[0,.07,-11],[1.0,.07,-14],[.5,.07,-17],[0,.12,-19.3],[0,.8,-20.65]].map(p=>new THREE.Vector3(...p))),[]);return <mesh><tubeGeometry args={[path,180,.027,8,false]}/><meshStandardMaterial color="#ff2858" emissive="#ff003f" emissiveIntensity={3}/></mesh>}
function Arcade(){const art=useTexture('/art/arcade.jpg');art.colorSpace=THREE.SRGBColorSpace;return <group position={[0,0,-21.4]}>
 <Block p={[0,1.1,0]} s={[2.5,2.2,1.35]} c="#121524"/>
 <Block p={[0,2.5,-.16]} s={[2.5,1.1,1.15]} c="#252037"/>
 <mesh position={[0,2.52,.43]}><planeGeometry args={[2.13,.82]}/><meshBasicMaterial map={art}/></mesh>
 <Block p={[0,1.52,.76]} s={[2.1,.12,.65]} c="#ed386c" emissive="#a51d54"/>
 {[-.75,-.25,.25,.75].map((x,i)=><mesh key={i} position={[x,1.6,1.11]}><cylinderGeometry args={[.12,.12,.06,16]}/><meshStandardMaterial color={['#ff507b','#3cf7e4','#f7b15d','#bd8aff'][i]} emissive={['#ff507b','#3cf7e4','#f7b15d','#bd8aff'][i]} emissiveIntensity={1.5}/></mesh>)}
 <Text position={[0,3.4,.45]} fontSize={.26} color="#f5f1f3">SELECT YOUR TRACK</Text>
 <Text position={[0,.7,.71]} fontSize={.15} color="#36f8e3">[ E ] PLAY</Text>
 <pointLight position={[0,3,2]} color="#f52d65" intensity={11} distance={8}/>
 </group>}
function Room(){const wall=useTexture('/art/uncovered.jpg');wall.colorSpace=THREE.SRGBColorSpace;return <group>
 <Block p={[0,-.18,-17.5]} s={[14,.35,16.9]} c="#10131a"/>
 <Block p={[0,6.2,-17.5]} s={[14,.28,16.9]} c="#0a0b12"/>
 {[-1,1].map(s=><group key={s}><Block p={[s*6.9,3,-17.7]} s={[.25,6.1,16.4]} c="#171221"/>{[-13,-17,-21,-24].map(z=><Block key={z} p={[s*6.7,2.6,z]} s={[.13,4.4,.07]} c="#b3214c" emissive="#8a1235"/>)}</group>)}
 <Block p={[0,3,-25.5]} s={[14,6.2,.3]} c="#11111d"/>
 <mesh position={[6.71,2.5,-15.3]} rotation={[0,-Math.PI/2,0]}><planeGeometry args={[4.2,4.6]}/><meshBasicMaterial map={wall} side={THREE.DoubleSide}/></mesh>
 <Text position={[0,4.4,-20.2]} fontSize={.33} color="#f14a74">FOLLOW THE RED STRING</Text>
 <pointLight position={[0,3.6,-16]} color="#d71b4b" intensity={9} distance={12}/>
 <pointLight position={[-4,4,-22]} color="#00d6d2" intensity={7} distance={12}/>
 <Arcade/>
 </group>}
function Outside(){return <group>
 <Block p={[0,-.15,0]} s={[14,.3,20]} c="#27262c"/>
 {Array.from({length:7},(_,i)=><Block key={i} p={[0,.013,7-i*2.2]} s={[.11,.012,.85]} c="#b6aba4"/>)}
 {[-1,1].map(s=><group key={s}><Block p={[s*7.2,3,0]} s={[.6,6.2,20]} c="#0b1019"/>{[-7,-1,5].map(z=><group key={z}><Block p={[s*6.3,2,z]} s={[.12,4,.13]} c="#252e3a"/><pointLight position={[s*6,3.7,z]} intensity={2.2} color="#e9a478" distance={6}/></group>)}</group>)}
 <ambientLight intensity={.27}/><hemisphereLight args={['#17263b','#151019',.65]}/>
 <pointLight position={[0,5,-8]} intensity={9} color="#f3495b" distance={13}/>
 <Facade/><Room/><Cable/>
 </group>}
export default function World(props:Props){return <Canvas shadows dpr={[1,1.5]} camera={{fov:76,near:.07,far:80,position:[0,H,7]}} gl={{antialias:true}} onCreated={({gl})=>{gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=.9}}><color attach="background" args={['#070a12']}/><fog attach="fog" args={['#080911',14,42]}/><Outside/><Controller {...props}/></Canvas>}
