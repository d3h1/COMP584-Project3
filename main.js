class textScramble 
{
  constructor(el) 
  {
    this.el = el
    this.chars = '!<>[]-_{}\\/—=+*^?#________'
    this.update = this.update.bind(this)
  }

  setText(newText) 
  {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];

    for (let i = 0; i < length; i++) 
    {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() 
  {
    let output = '';
    let complete = 0;

    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i]
      if (this.frame >= end) 
      {
        complete++;
        output += to;
      } 
      else if (this.frame >= start) 
      {
        if (!char || Math.random() < 0.28) 
        {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`
      } 
      else 
      {
        output += from;
      }
    }
    this.el.innerHTML = output
    if (complete === this.queue.length) 
    {
      this.resolve();
    } 
    else 
    {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() 
  {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}


const phrases = [
  '',
  'You are being followed by a star destroyer!',
  'Press the hyperspace button below',
  'and hopefully youll make your get away in the next ten planets . . .',
  '',
  '. . . keep running!'
]

const el = document.querySelector('.text');
const fx = new textScramble(el);

let counter = 0;
const next = () => 
{
  fx.setText(phrases[counter]).then(() => 
  {
    setTimeout(next, 1700);
  })
  counter = (counter + 1) % phrases.length;
}

next();




// Planet Randomizer to find the 10 planets for the first jump
const ctnPlanets = document.getElementById("ctn-main");
const planetsPrevious = document.getElementById("planets-previous");
const planetsNext = document.getElementById("planets-next");

let URL_Planets = "https://swapi.dev/api/planets";
let nextPlanets;
let previousPlanets;

planetsPrevious.addEventListener("click", pagePreviousPlanets);
planetsNext.addEventListener("click", pageNextPlanets);

// We are using ASYNC functions to fetch planets from the API
async function fetchPlanets() {
  document.querySelector('.overlay').classList.add('active');

  // Our results are stored down below in the output array
  let results = await fetch(URL_Planets);
  const data = await results.json();

  nextPlanets = data.next;
  previousPlanets = data.previous;

  let planets = data.results;
  let outPut = ' ';

  document.querySelector('.overlay').classList.remove('active');
  planets.forEach(item => {
    outPut += `<div class="card card-planet">
                  <h2>${item.name}\n</h2>
                  <h5> Climate:  ${item.climate}</h5>
                  <h5> Terrain:  ${item.terrain}</h5>
                  <h5> Population:  ${item.population}</h5>
               </div>`
  })
  ctnPlanets.innerHTML = outPut;
}

function pageNextPlanets() {
  if(nextPlanets) {
    URL_Planets = new URL(nextPlanets);
  }
  fetchPlanets()
    .then(response => { 
    console.log(`Success: Planets`);
  })
    .catch(error => { 
    console.log(`error!`)
    console.error(error) 
  });
}

function pagePreviousPlanets() {
  if(previousPlanets) {
    URL_Planets = new URL(previousPlanets);
  }
  fetchPlanets()
    .then(response => { 
    console.log(`Success: Planets`);
  })
    .catch(error => { 
    console.log(`error!`)
    console.error(error) 
  });
}

const animation = anime({
  targets: 'path',
  strokeDashoffset: [anime.setDashoffset, 0],
  easing: 'easeInOutSine',
  duration: 1000,
  direction: 'linear',
  loop: false
});

document.getElementById('planets-next').addEventListener('click', animation.restart);

// Our Timeline Animation
const text = "";

const textEl = document.querySelector(".visible-text");

function animate() {
  const characterEls = textEl.querySelectorAll("span");
  const tl = anime.timeline({
    easing: "easeOutExpo",
    duration: 1500,
    loop: true,
  });
  tl.add({
    targets: ".banner",
    scaleX: [0, 1],
    duration: 800,
    easing: "easeOutCubic"
  })
    .add({
      targets: ".muted-text",
      opacity: [0, 1]
    })
    .add({
      targets: characterEls,
      delay: anime.stagger(120),
      translateY: [30, 0],
      translateX: [-10, 0],
      opacity: [0, 1],
      easing: "spring"
    });
}

function init() {
  const docEl = new DocumentFragment();
  text.split("").forEach((character) => {
    const span = document.createElement("span");
    span.innerText = character;
    docEl.appendChild(span);
  });
  textEl.appendChild(docEl);
}

init();
animate();
