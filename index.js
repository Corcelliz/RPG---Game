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
    {name: "graveto", power: 5},
    {name: "adaga", power: 30},
    {name: "martelo de garra", power: 50},
    {name: "espada", power: 100}
  ];
  
  const monsters = [
    {name: "slime", level: 2, health: 15},
    {name: "besta com presas", level: 8, health: 60}, 
    {name: "dragão", level:20, health: 300}
  ];
  
  const locations = [
    {
      name: "Praça da cidade",
      "button text": ["Vá para loja", "Vá para a caverna", "Lute contra o dragão"],
      "button functions": [goStore, goCave, fightDragon],
      text: "Você está na praça da cidade. Você vê uma placa que diz \"Loja\"."
    },
    {
      name: "loja",
      "button text": ["Compre 10 de saúde (10 de ouro)", "Compre arma (30 ouro)", "Vá para a praça da cidade"],
      "button functions": [buyHealth, buyWeapon, goTown],
      text: "Você entra na loja."
    },
    {
      name: "caverna",
      "button text": ["Lute contra o slime", "Lute contra a fera com presas", "Vá para a praça da cidade"],
      "button functions": [fightSlime, fightBeast, goTown],
      text: "Você entra na caverna. Você vê alguns monstros."
    },
    {
      name: "lutar",
      "button text": ["Ataque", "Esquivar", "Correr"],
      "button functions": [attack, dodge, goTown],
      text: "Você está lutando contra um monstro."
    },
    {
      name: "matou o monstro",
      "button text": ["Vá para a praça da cidade", "Vá para a praça da cidade", "Vá para a praça da cidade"],
      "button functions": [goTown, goTown, goTown],
      text: 'O monstro grita "Arg!" enquanto que morre. Você ganha pontos de experiência e encontra ouro.'
    },
    {
      name: "perda",
      "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
      "button functions": [restart, restart, restart],
      text: "Você morreu!. &#x2620;"
    },
    {
      name: "vitoria",
      "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
      "button functions": [restart, restart, restart],
      text: "Você derrotou o dragão! VOCÊ GANHOU O JOGO! &#x1F389;"
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
    if(gold >= 10){
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
    health -= monsters[fighting].level;
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
    inventory = ["graveto"];
    goldText.innerText = gold;
    healthText.innerText = health;
    xpText.innerText = xp;
    goTown();
  };