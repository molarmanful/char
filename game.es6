//init
floor=` `
wall=`█`
player=`@`
enemy=`&`
field=`╬`
mine=`o`
pc=0
pr=0
mc=120
mr=60
ec=mc/2|0
er=mr/2|0
map=Array(mr).fill(Array(mc).fill(floor))
score=0
die=0
Die=0
pwr=1000
kills=0
k5=0
mR=x=>((x%mr)+mr)%mr
mC=x=>((x%mc)+mc)%mc

//update map functions
um=_=>{
  x.innerHTML=map.map(a=>a.join``).join`\n`.replace(player,`<span style='color:limegreen'>${player}</span>`).replace(enemy,`<span style='color:red'>${enemy}</span>`)
  z.style.width=(pwr>0?pwr:0)+'px'
}
//update coords functions
up=(R,C,p)=>map=map.map((a,b)=>a.map((c,d)=>b^R||d^C?c==p?floor:c:p))
Up=(R,C,p)=>map=map.map((a,b)=>a.map((c,d)=>b^R||d^C?c:p))

//init walls
map=map.map((a,b)=>a.map((c,d)=>Math.random()*4|0?c:wall))

//init map
up(pr,pc,player)
up(er,ec,enemy)
um()

//key states
k={}
onkeydown=e=>k[e.which]=1
onkeyup=e=>k[e.which]=0

//movements
pm=setInterval(_=>{
  //field reset
  map=map.map(a=>a.map(b=>b==field?Math.random()*4|0?floor:wall:b))
  //make sure keydown
  if(Object.getOwnPropertyNames(k).length){
    //player
    if(Die)
      end();
    else{
      //w
      if(k[87]&&map[mR(pr-1)][pc]!=wall)
        pr=mR(pr-1);
      //s
      if(k[83]&&map[mR(pr+1)][pc]!=wall)
        pr=mR(pr+1);
      //a
      if(k[65]&&map[pr][mC(pc-1)]!=wall)
        pc=mC(pc-1);
      //d
      if(k[68]&&map[pr][mC(pc+1)]!=wall)
        pc=mC(pc+1);
      //forcefield
      if(k[32])
        pwr-=25,
        [...Array(7).keys()].map((a,b)=>(b=mR(pr+b-3),[...Array(7).keys()].map((c,d)=>(d=mC(pc+d-3),Up(b,d,field)))));
    }
  }

  //enemy
  if(die)
    ec=Math.random()*mc|0,er=Math.random()*mr|0,
    pwr<800?(pwr+=200):(pwr=1000),
    kills%5?k5||(k5=1,pwr<500?(pwr+=500):(pwr=1000)):(k5=0),
    kills++,die=0;
  else{
    r=Math.random()*100|0
    //up
    if(r>=0&&r<10)
      er--;
    //down
    if(r>=10&&r<20)
      er++;
    //left
    if(r>=20&&r<30)
      ec--;
    //right
    if(r>=30&&r<40)
      ec++;
    //teleport
    if(r>=50&&r<55&&score>30)
      er=pr+(Math.random()*9)|0*(Math.random()*-2|0),
      ec=pc+(Math.random()*9)|0*(Math.random()*-2|0);
    //map change
    if(r==55)
      [...Array(11).keys()].map((a,b)=>(b=mR(er+b-5),[...Array(11).keys()].map((c,d)=>(d=mC(ec+d-5),Up(b,d,Math.random()*4|0?floor:wall)))));
    //mines!
    if(r==60)
      [...Array(9).keys()].map((a,b)=>(b=mR(er+b-4),[...Array(9).keys()].map((c,d)=>(d=mC(ec+d-4),Up(b,d,mine)))));
    if(r==61)
      map=map.map((a,b)=>a.map((c,d)=>ec==d?mine:c));
    if(r==62)
      map=map.map((a,b)=>a.map((c,d)=>er==b?mine:c));
  }

  //enemy field death
  map[er]&&map[er][ec]==field&&(die=1)
  //player loses power for stepping on mines
  map[pr]&&map[pr][pc]==mine&&(pwr-=100),
  //player loses power for encountering enemy
  (er==pr&&ec==pc)&&(pwr-=500)
  //player dies when power <1
  pwr>0||(Die=1)

  //update
  up(mR(pr),mC(pc),player)
  up(mR(er),mC(ec),enemy)
  um()
},50)

//scorekeeping
sc=setInterval(_=>{
  score++
  pwr--
  Math.random()*10|0||(map=map.map((a,b)=>a.map((c,d)=>Math.random()*4|0?floor:wall)),up(pr,pc,player),up(er,ec,enemy))
  um()
},100)

//game over
end=_=>{
  clearInterval(sc)
  clearInterval(pm)
  setTimeout(_=>{
    x.innerHTML=`You died!\n Survived for ${score/10} seconds.\nReload the page to play again.`
  },2000)
}
