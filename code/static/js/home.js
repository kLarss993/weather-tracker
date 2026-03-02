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
