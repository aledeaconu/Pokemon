let allPokemon = [];
let noOfPokemon = 20;
let isMoreInfosOpen = false;
const typeColors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  steel: "#B7B7CE",
  dragon: "#6F35FC",
  dark: "#705746",
  fairy: "#D685AD",
};
let currentPokemon = 0;
let radarChart = null;

async function init() {
  await loadPokemonCollection();
  renderPokemon();
}

function openBall() {
  document.getElementById("openBall").src = "./img/open.png";
}

async function loadPokemonCollection() {
  for (let i = 1; i <= noOfPokemon; i++) {
    let urlAll = `https://pokeapi.co/api/v2/pokemon/${i}`;
    let responseAll = await fetch(urlAll);

    try {
      let responseAsJson = await responseAll.json();
      allPokemon.push(responseAsJson);
    } catch (e) {
      console.error("error");
    }
  }
}

function renderPokemon() {
  let PokemonCollection = document.getElementById("loadcollection");
  PokemonCollection.innerHTML = "";

  for (let i = 0; i < noOfPokemon; i++) {
    let pokemon = allPokemon[i];
    PokemonCollection.innerHTML += generatePokedex(pokemon, i);
  }
  playaudio();
}

function playaudio() {
  let audio = document.getElementById("audio");
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

function generatePokedex(pokemon, index) {
  return `
  <div class="loadcollections">
    <div onclick="toggleInfos(${index})" class="pokedex">
      <ul>
      ${pokemon["types"]
        .map((type) => `<li>${type["type"]["name"]}</li>`)
        .join("")}
    </ul>  
        <img src = ${
          pokemon["sprites"]["other"]["official-artwork"]["front_shiny"]
        }
       
        <h1>${pokemon["name"]}</h1>
        <img class="ballBackground" src="./img/ball_background.png"> 
        <div>
         <h2>Click for more infos<h2>
         </div>
         
      </div> 
  </div>`;
}

function toggleInfos(pokemonIndex) {
  if (isMoreInfosOpen) {
    closeInfos();
  } else {
    if (pokemonIndex >= 0 && pokemonIndex < allPokemon.length) {
      currentPokemon = pokemonIndex;
      showInfos(pokemonIndex);
    }
  }
  isMoreInfosOpen = !isMoreInfosOpen;
}

function showInfos(pokemonIndex) {
  let moreInfos = document.getElementById("moreInfos");
  moreInfos.innerHTML = "";

  let infos = allPokemon[pokemonIndex];

  if (infos) {
    moreInfos.innerHTML += generateInfos(infos);
  }
}

function generateInfos(infos) {
  const typeColor = getTypeColor(infos.types[0].type.name);

  return `
  <div class="moreInfosContainer" style="background-color:${typeColor};">
    <div class="main">
      <div class = "infosAbove">
        <p>#${infos["game_indices"][0]["game_index"]}</p>
        <h1>${infos.name}</h1>
        <img src="${infos.sprites.other["official-artwork"]["front_shiny"]}">
        <button onclick="closeInfos()">X</button>
      </div>

      <div class=next>
        <p onclick="prevPokemon()">Prev</p>
        <p onclick="nextPokemon()">Next</p>
      </div>
    </div>
    <div class="nav-bar">
      <span onclick="renderAbout()">About |</span>
      <span onclick="renderBase_Stats()">Base Stats |</span>
      <span onclick="renderDream()">Dream World</span>
    </div>
  
    <div class="insideInfos d-none" id="aboutContainer"></div>
    <div class="insideInfos d-none" id="renderBase"></div>
    <div class="insideInfos d-none " id="evolution"></div>

  </div>
  `;
}

function renderAbout() {
  const aboutInfos = document.getElementById("aboutContainer");
  const baseStatsContainer = document.getElementById("renderBase");
  const evolutionContainer = document.getElementById("evolution");

  baseStatsContainer.classList.add("d-none");
  evolutionContainer.classList.add("d-none");

  const infos = allPokemon[currentPokemon];

  if (aboutInfos && infos && infos.abilities && infos.abilities.length > 0) {
    aboutInfos.innerHTML = `
      <div>
        Abilities: ${infos.abilities[0].ability.name}<br>
        Experience: ${infos.base_experience}<br>
        Weight: ${infos.weight}<br>
        Height: ${infos.height}
      </div>
    `;
    aboutInfos.classList.remove("d-none");
  }
}

function renderBase_Stats() {
  const aboutInfos = document.getElementById("aboutContainer");
  const baseStatsContainer = document.getElementById("renderBase");
  const evolutionContainer = document.getElementById("evolution");

  // Ascunde celelalte div-uri cu informații
  aboutInfos.classList.add("d-none");
  evolutionContainer.classList.add("d-none");

  const infos = allPokemon[currentPokemon];

  if (infos && infos.stats && infos.stats.length > 0) {
    baseStatsContainer.innerHTML = `
      <div>
        <canvas id="myChart"></canvas>
      </div>
    `;
    createRadarChart(infos);

    baseStatsContainer.classList.remove("d-none");
  }
}

function createRadarChart(pokemon) {
  const ctx = document.getElementById("myChart").getContext("2d");

  if (radarChart) {
    radarChart.destroy();
  }

  const data = {
    labels: [
      "HP",
      "Attack",
      "Defense",
      "Special-attack",
      "Special-defense",
      "Speed",
    ],
    datasets: [
      {
        label: "Base Stats",
        data: [
          pokemon.stats[0].base_stat,
          pokemon.stats[1].base_stat,
          pokemon.stats[2].base_stat,
          pokemon.stats[3].base_stat,
          pokemon.stats[4].base_stat,
          pokemon.stats[5].base_stat,
        ],
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgb(255, 99, 132)",
        pointBackgroundColor: "rgb(255, 99, 132)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(255, 99, 132)",
      },
    ],
  };

  const config = {
    type: "radar",
    data: data,
    options: {
      elements: {
        line: {
          borderWidth: 6,
        },
      },
    },
  };

  radarChart = new Chart(ctx, config);
}

function renderDream() {
  const aboutInfos = document.getElementById("aboutContainer");
  const baseStatsContainer = document.getElementById("renderBase");
  const evolutionContainer = document.getElementById("evolution");

  aboutInfos.classList.add("d-none");
  baseStatsContainer.classList.add("d-none");

  const infos = allPokemon[currentPokemon];

  if (evolutionContainer && infos) {
    evolutionContainer.innerHTML = `
      <img src="${infos.sprites["other"]["dream_world"]["front_default"]}">
    `;
    evolutionContainer.classList.remove("d-none");
  }
}

function prevPokemon() {
  currentPokemon--;
  if (currentPokemon < 0) {
    currentPokemon = noOfPokemon - 1;
  }
  showInfos(currentPokemon);
}

function nextPokemon() {
  currentPokemon++;
  if (currentPokemon >= noOfPokemon) {
    currentPokemon = 0;
  }
  showInfos(currentPokemon);
}

function getTypeColor(type) {
  return typeColors[type] || "#000000";
}

function closeInfos() {
  document.getElementById("moreInfos").innerHTML = "";
  isMoreInfosOpen = false;
}

function searchPokemon() {
  const searchInput = document.getElementById("search").value.toLowerCase();
  const foundPokemon = allPokemon.find(
    (pokemon) => pokemon.name.toLowerCase() === searchInput
  );

  if (foundPokemon) {
    showInfos(allPokemon.indexOf(foundPokemon));
  } else {
    alert("No Pokemon Found!");
  }
}

async function loadMorePokemon() {
  const additionalPokemonCount = 20;
  const existingPokemonIndices = allPokemon.map((pokemon) => pokemon.id);

  for (let i = 1; i <= noOfPokemon + additionalPokemonCount; i++) {
    if (!existingPokemonIndices.includes(i)) {
      let urlAll = `https://pokeapi.co/api/v2/pokemon/${i}`;
      let responseAll = await fetch(urlAll);

      try {
        let responseAsJson = await responseAll.json();
        allPokemon.push(responseAsJson);
      } catch (e) {
        console.error("error");
      }
    }
  }
  noOfPokemon += additionalPokemonCount;
  renderPokemon();
}
