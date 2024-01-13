const cardContainer = document.getElementById('cardContainer');
const resultDisplay = document.getElementById('result');
let selectedCards = [];

// Función para obtener un número aleatorio entre 1 y 898 (total de Pokémon disponibles)
function getRandomPokemonId() {
  return Math.floor(Math.random() * 898) + 1;
}

// Función para generar Pokémon aleatorios
async function generateRandomPokemon() {
  const pokemonNumberInput = document.getElementById('pokemonNumber');
  const numberOfPokemon = parseInt(pokemonNumberInput.value);

  if (numberOfPokemon > 0) {
    clearPreviousCards();
    for (let i = 0; i < numberOfPokemon; i++) {
      const randomPokemonId = getRandomPokemonId();
      await fetchAndDisplayPokemon(randomPokemonId);
    }
  } else {
    alert('Por favor, ingresa un número válido mayor a 0.');
  }
}

// Función para limpiar las tarjetas anteriores
function clearPreviousCards() {
  cardContainer.innerHTML = '';
  resultDisplay.textContent = '';
}

// Función para obtener datos de un Pokémon específico y mostrar la tarjeta
async function fetchAndDisplayPokemon(pokemonId) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const pokemonData = await response.json();
    displayPokemonCard(pokemonData);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Función para mostrar las tarjetas de los Pokémon
function displayPokemonCard(pokemon) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
    <h3>${pokemon.name}</h3>
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    <p>Tipo: ${pokemon.types.map(type => type.type.name).join(', ')}</p>
    <p>Ataque: ${pokemon.stats[1].base_stat}</p>
    <p>Defensa: ${pokemon.stats[2].base_stat}</p>
  `;
  card.addEventListener('click', () => selectCard(card, pokemon));
  cardContainer.appendChild(card);
}

// Función para mostrar el resultado del combate y cambiar el color de las cartas
function showCombatResult(winner, loser) {
  const winnerCard = selectedCards.find(card => card.pokemon === winner).card;
  const loserCard = selectedCards.find(card => card.pokemon === loser).card;

  winnerCard.classList.add('winner');
  loserCard.classList.add('loser');

  // Después de mostrar el resultado, deseleccionar las tarjetas después de un tiempo
  setTimeout(() => {
    selectedCards.forEach(({ card }) => {
      card.classList.remove('selected', 'winner', 'loser');
    });
    selectedCards = [];
    resultDisplay.textContent = '';
  }, 2000);
}

// Función para seleccionar/deseleccionar tarjetas y realizar la lógica del juego
function selectCard(card, pokemon) {
  if (selectedCards.length < 2 || card.classList.contains('selected')) {
    card.classList.toggle('selected');
    const index = selectedCards.findIndex(selected => selected.card === card);
    if (index === -1) {
      selectedCards.push({ card, pokemon });
    } else {
      selectedCards.splice(index, 1);
    }

    if (selectedCards.length === 2) {
      const attacker = selectedCards[0].pokemon.stats[1].base_stat;
      const defender = selectedCards[1].pokemon.stats[2].base_stat;

      let result = '';
      if (attacker > defender) {
        result = `${selectedCards[0].pokemon.name} gana el combate!`;
        showCombatResult(selectedCards[0].pokemon, selectedCards[1].pokemon);
      } else if (attacker < defender) {
        result = `${selectedCards[1].pokemon.name} gana el combate!`;
        showCombatResult(selectedCards[1].pokemon, selectedCards[0].pokemon);
      } else {
        result = 'El combate termina en empate.';
        // Después de mostrar el resultado, deseleccionar las tarjetas después de un tiempo
        setTimeout(() => {
          selectedCards.forEach(({ card }) => card.classList.remove('selected'));
          selectedCards = [];
        }, 2000);
      }
      resultDisplay.textContent = result;
    }
  }
}


// Función para realizar un combate entre todos los Pokémon generados
function battleAll() {
  const allPokemon = document.querySelectorAll('.card');
  const allPokemonArray = Array.from(allPokemon);

  if (allPokemonArray.length >= 2) {
    const winner = findWinnerAll(allPokemonArray);
    displayBattleResultAll(winner, allPokemonArray);
  } else {
    alert('Debes generar al menos dos Pokémon antes de iniciar el combate.');
  }
}

// Función para encontrar al ganador basado en la suma total de ataque y defensa
function findWinnerAll(pokemonArray) {
  let highestSum = 0;
  let winners = [];

  pokemonArray.forEach(card => {
    const pokemonData = card.dataset.pokemon;

    if (typeof pokemonData !== 'undefined') {
      try {
        const pokemon = JSON.parse(pokemonData);
        if (pokemon.stats && pokemon.stats.length >= 3) {
          const sum = pokemon.stats[1].base_stat + pokemon.stats[2].base_stat;

          if (sum > highestSum) {
            highestSum = sum;
            winners = [pokemon];
          } else if (sum === highestSum) {
            winners.push(pokemon);
          }
        } else {
          console.error('Los datos del Pokémon no son válidos:', pokemon);
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    }
  });

  return winners;
}



// Función para mostrar el resultado del combate general y cambiar el color de las cartas
function displayBattleResultAll(winners, allPokemonArray) {
  allPokemonArray.forEach(card => {
    const pokemonData = card.dataset.pokemon;

    if (typeof pokemonData !== 'undefined') {
      try {
        const pokemon = JSON.parse(pokemonData);
        if (winners.includes(pokemon)) {
          card.classList.add('winner');
        } else {
          card.classList.add('loser');
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    }
  });

  // Después de mostrar el resultado, deseleccionar las tarjetas después de un tiempo
  setTimeout(() => {
    allPokemonArray.forEach(card => {
      card.classList.remove('winner', 'loser');
    });
    resultDisplay.textContent = '';
  }, 2000);

  const resultMessage = winners.length === 1
    ? `${winners[0].name} es el ganador del combate general!`
    : 'El combate general termina en empate.';
  resultDisplay.textContent = resultMessage;
}



