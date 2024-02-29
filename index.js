/* Definindo as variaveis do jogo */
let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["graveto"];

/* Definindo as constantes da aplicação */

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const weapons = [
  { name: "Graveto", power: 5 },
  { name: "Adaga", power: 30 },
  { name: "Martelo de guerra", power: 50 },
  { name: "Espada", power: 100 }
];

const monsters = [
  { name: "Slime", level: 2, health: 15 },
  { name: "Besta com presas", level: 8, health: 60 },
  { name: "Dragão", level: 20, health: 300 }
];

const locations = [
  {
    name: "Praça da cidade",
    "button text": ["Vá para loja", "Vá para a caverna", "Lute contra o dragão"],
    "button functions": [goStore, goCave, fightDragon],
    text: "Você está na praça da cidade. Você vê uma placa que diz \"Loja\"."
  },
  {
    name: "Loja",
    "button text": ["Compre 10 de saúde (10 de ouro)", "Compre arma (30 ouro)", "Vá para a praça da cidade"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "Você entra na loja."
  },
  {
    name: "Caverna",
    "button text": ["Lute contra o slime", "Lute contra a fera com presas", "Vá para a praça da cidade"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "Você entra na caverna. Você vê alguns monstros."
  },
  {
    name: "Lutar",
    "button text": ["Ataque", "Esquivar", "Correr"],
    "button functions": [attack, dodge, goTown],
    text: "Você está lutando contra um monstro."
  },
  {
    name: "Matou o monstro",
    "button text": ["Vá para a praça da cidade", "Vá para a praça da cidade", "Vá para a praça da cidade"],
    "button functions": [goTown, goTown, EasterEgg],
    text: 'O monstro grita "Arg!" enquanto morre. Você ganha pontos de experiência e encontra ouro.'
  },
  {
    name: "Perdeu!",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "Você morreu!. &#x2620;"
  },
  {
    name: "Vitoria",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "Você derrotou o dragão! VOCÊ GANHOU O JOGO! &#x1F389;"
  },
  {
    name: "Easter egg",
    "button text": ["2", "8", "Ir para a praça da cidade?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "Você encontra um jogo secreto. Escolha um número acima. Dez números serão escolhidos aleatoriamente entre 0 e 10. Se o número escolhido corresponder a um dos números aleatórios, você ganha!"
  }
];

/* Inicializando os botões */

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

/* Criando as funções do RPG */

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function goTown() {
  update(locations[0])
}

function goStore() {
  update(locations[1])
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "Você não tem ouro suficiente para comprar saúde.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "Você agora tem um(a) " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " Em seu inventário você tem: " + inventory;
    } else {
      text.innerText = "Você não tem ouro suficiente para comprar uma arma.";
    }
  } else {
    text.innerText = "Você já tem a arma mais poderosa!";
    button2.innerText = "Venda uma arma por 15 ouro"
    button2.onclick = sellWeapon;
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "Você vendeu um(a) " + currentWeapon + "."
    text.innerText += " Em seu inventário você tem: " + inventory;
  } else {
    text.innerText = "Não venda sua única arma!";
  }
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = "O(A) " + monsters[fighting].name + " ataca.";
  text.innerText += " Você o ataca com seu " + weapons[currentWeapon].name + ".";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
  } else {
    text.innerText = + " Você errou!."
  }
  monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText = " Sua " + inventory.pop() + " quebrou."
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "Você evita o ataque do " + monsters[fighting].name;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["Graveto"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
};

function EasterEgg() {
  update(locations[7])
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "Você escolheu " + guess + ". Aqui está os numeros aleatórios:\n"
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n"
  }
  if (numbers.includes(guess)) {
    text.innerText += "Certo!Você ganhou 20 de Ouro!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Errado! Você perdeu 10 de Vida!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose()
    }
  }
}

function pickTwo() {
  pick(2)
}

function pickEight() {
  pick(8)
}