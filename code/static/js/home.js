document.addEventListener('DOMContentLoaded', ()=>{
  const tempEl = document.querySelector('.metric-value[data-type="temp"]');
  const toggle = document.getElementById('unitToggle');
  const updatedEl = document.getElementById('updatedTime');

  function toF(c){return Math.round((c*9/5)+32)}

  if(toggle && tempEl){
    toggle.addEventListener('click', ()=>{
      const current = tempEl.dataset.c;
      if(!current) return;
      if(toggle.dataset.unit === 'C'){
        tempEl.textContent = toF(Number(current)) + ' °F';
        toggle.textContent = '°F';
        toggle.dataset.unit = 'F';
      } else {
        tempEl.textContent = current + ' °C';
        toggle.textContent = '°C';
        toggle.dataset.unit = 'C';
      }
      tempEl.classList.add('pulse');
      setTimeout(()=>tempEl.classList.remove('pulse'),1600);
    });
  }

  if(updatedEl){
    const now = new Date();
    updatedEl.textContent = now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
  }
});

/* Ambient particle system + interactions */
(() => {
  const canvas = document.getElementById('ambientCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w=canvas.width=innerWidth, h=canvas.height=innerHeight;
  const particles=[];
  const COUNT = Math.round((w*h)/90000); // scale with screen

  function rand(min,max){return Math.random()*(max-min)+min}

  class P{constructor(){this.reset()}
    reset(){this.x=rand(0,w);this.y=rand(0,h);this.r=rand(6,28);this.vx=rand(-0.15,0.15);this.vy=rand(-0.05,0.05);this.alpha=rand(0.06,0.28)}
    step(){this.x+=this.vx;this.y+=this.vy; if(this.x<-50) this.x=w+50; if(this.x>w+50) this.x=-50; if(this.y<-50) this.y=h+50; if(this.y>h+50) this.y=-50}
    draw(){const g=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r);g.addColorStop(0,`rgba(108,202,163,${this.alpha})`);g.addColorStop(1,'rgba(108,202,163,0)');ctx.beginPath();ctx.fillStyle=g;ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fill()}
  }

  function init(){w=canvas.width=innerWidth;h=canvas.height=innerHeight;particles.length=0;for(let i=0;i<COUNT;i++)particles.push(new P())}

  function render(){ctx.clearRect(0,0,w,h);for(const p of particles){p.step();p.draw()}requestAnimationFrame(render)}

  window.addEventListener('resize', ()=>{init()});
  // parallax blob follow pointer a bit
  const blob = document.querySelector('.page-blob');
  window.addEventListener('mousemove', (e)=>{
    if(!blob) return; const tx=(e.clientX - window.innerWidth/2)/30; const ty=(e.clientY - window.innerHeight/2)/40; blob.style.transform = `translate(${tx}px, ${ty}px) scale(1.02)`;
  });

  init();render();

  // subtle sun rotation toggle
  const icon = document.querySelector('.weather-icon');
  if(icon) icon.classList.add('sun-rotate');

})();
