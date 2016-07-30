//init
var floor=` `
wall=`▓`
player=`@`
enemy=`&`
field=`+`
mine=`ø`
pc=0
pr=0
mc=120
mr=50
ec=mc/2|0
er=mr/2|0
map=Array(mr).fill(Array(mc).fill(floor))
score=0
die=0
Die=0
pwr=1
mR=x=>((x%mr)+mr)%mr
mC=x=>((x%mc)+mc)%mc

//update map function
um=_=>{
  x.innerHTML=map.map(a=>a.join``).join`\n`.replace(player,`<span style='color:limegreen'>${player}</span>`).replace(enemy,`<span style='color:red'>${enemy}</span>`)+`\n\nScore: ${score/10} | Power: `+pwr
}
//update coords functions
up=(R,C,p)=>map=map.map((a,b)=>a.map((c,d)=>b^R||d^C?c==p?floor:c:p))
Up=(R,C,p)=>map=map.map((a,b)=>a.map((c,d)=>b^R||d^C?c:p))

//init walls
map=map.map((a,b)=>a.map((c,d)=>Math.random()*2|0&&Math.random()*2|0?wall:c))

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
  //max pwr is 2000
  pwr<=2000&&pwr++;
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
        pwr-=50,
        [...Array(7).keys()].map((a,b)=>(b=mR(pr+b-3),[...Array(7).keys()].map((c,d)=>(d=mC(pc+d-3),Up(b,d,field)))));
    }
  }

  //enemy
  if(die)
    ec=mc/2|0,er=mr/2|0,die=0,pwr+=100;
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
    if(r==50&&score>30)
      er=pr+(Math.random()*3+1)|0*(Math.random()*-2|0),
      ec=pc+(Math.random()*3+1)|0*(Math.random()-2|0),
      map=map.map((a,b)=>a.map((c,d)=>c==floor||c==wall||c==field||c==mine?Math.random()*2|0&&Math.random()*2|0?wall:floor:c));
    //mines!
    if(r==51)
      [...Array(9).keys()].map((a,b)=>(b=mR(er+b-4),[...Array(9).keys()].map((c,d)=>(d=mC(ec+d-4),Up(b,d,mine)))));
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
sc=setInterval(_=>{score++,um()},100)

//game over
end=_=>{
  clearInterval(sc)
  clearInterval(pm)
  setTimeout(_=>{
    x.innerHTML=`You died!\n Survived for ${score/10} seconds.\nReload the page to play again.`
  },2000)
}
