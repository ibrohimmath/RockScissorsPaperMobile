const rowUp = document.querySelector(".row--up");
const rowDown = document.querySelector(".row--down");

const scoreSecond = document.querySelector(".score--second");
const scoreFirst = document.querySelector(".score--first");

const modal = document.querySelector(".modal");
const modalOverlay = document.querySelector(".modal__overlay");
const modalClose = document.querySelector(".modal__close");
const answer = document.querySelector(".answer");

const totalFirst = document.querySelector(".first--total");
const totalSecond = document.querySelector(".second--total");
const gamesRemain = document.querySelector(".games__remain");

const btnState = document.querySelector(".btn--state");

const gameStatus = document.querySelector(".games--status");
const setGameStatus = function() {
  const height = gameStatus.clientHeight;
  const width = gameStatus.clientWidth;
  const diff = height - width;
  gameStatus.style.transform = `translateY(-50%) rotate(270deg) translateY(${diff / 2}px)`;
}
setGameStatus();

let timeSecond;
let timeFirst;
let elementIndSecond;
let elementIndFirst;

// Second user
rowUp.addEventListener("click", function(e) {
  if (rowUp.classList.contains("banned")) {
    alert("You are not allowed to click buttons until timer will not end");
    return;
  }
  const el = e.target.closest(".element");
  // console.log("salom");
  timeSecond = new Date();
  localStorage.setItem("timeSecond", JSON.stringify(timeSecond));
  localStorage.setItem("elementIndSecond", JSON.stringify(el.dataset.ind));
  compare();
});

// First user
rowDown.addEventListener("click", function(e) {
  if (rowDown.classList.contains("banned")) {
    alert("You are not allowed to click buttons until timer will not end");
    return;
  }
  const el = e.target.closest(".element");
  timeFirst = new Date();
  localStorage.setItem("timeFirst", JSON.stringify(timeFirst));
  localStorage.setItem("elementIndFirst", JSON.stringify(el.dataset.ind));
  compare();
});

// Granting access for users after 3 seconds 
const preventBanning = async function() {
  rowUp.classList.remove("banned");
  rowDown.classList.remove("banned");
  btnState.classList.remove("banned");
};

// Banning access for users for 3 seconds
let i = 3;
const timer = setTimeout(function() {
  rowUp.classList.add("banned");
  rowDown.classList.add("banned");
  btnState.classList.add("banned");

  const timerInner = setInterval(async function() {
    scoreSecond.textContent = --i;
    scoreFirst.textContent = i;
    if (i == 0) {
      await preventBanning();
      clearInterval(timerInner);
    }
  }, 1000); 
}, 0);

// Getting important datas from localStorage
const compare = function() {
  timeFirst = JSON.parse(localStorage.getItem("timeFirst"));
  timeSecond = JSON.parse(localStorage.getItem("timeSecond"));

  elementIndFirst = JSON.parse(localStorage.getItem("elementIndFirst"));
  elementIndSecond = JSON.parse(localStorage.getItem("elementIndSecond"));

  if (timeFirst)
    timeFirst = new Date(timeFirst);

  if (timeSecond)
    timeSecond = new Date(timeSecond);

  // console.log(timeFirst, timeSecond);
};

// changing modal Status
const changeModalState = function() {
  modalOverlay.classList.toggle("hidden");
  modal.classList.toggle("hidden");
  modalClose.classList.toggle("hidden");
};

const changeBtnState = function(val) {
  if (val == '0') {
    btnState.textContent = "Reset";
    const timerRound = setTimeout(function() {
      modalOverlay.classList.toggle("hidden");
      modal.classList.toggle("hidden");
      modalClose.classList.toggle("hidden");    
      if (totalFirst.textContent > totalSecond.textContent) {
        // announceWinner("First player has won after 3 rounds", -1, 2);
        answer.textContent = "First player has won after 3 rounds";
      } else if (totalFirst.textContent < totalSecond.textContent) {
        // announceWinner("Second player has won after 3 rounds", -1, 2);
        answer.textContent = "Second player has won after 3 rounds";
      } else {
        // announceWinner("Draw has been happened after 3 rounds", -1, 2);
        answer.textContent = "Draw has been happened after 3 rounds";
      }
      clearTimeout(timerRound);
    }, 2000);
  }
};

// const announceWinner = function(text, winner = 0, calls) {
//   changeModalState();
//   answer.textContent = text;
//   if (winner == 1) totalFirst.textContent = +totalFirst.textContent + 1;
//   else if (winner == 2) totalSecond.textContent = +totalSecond.textContent + 1;
//   else if (winner == 0) {
//     totalFirst.textContent = +totalFirst.textContent + 1;
//     totalSecond.textContent = +totalSecond.textContent + 1;
//   }
//   if (winner != -1)
//     gamesRemain.textContent = +gamesRemain.textContent - 1;
//   changeBtnState(gamesRemain.textContent);
//   // console.log(totalFirst, totalSecond, gamesRemain.textContent);

//   if (!calls) return;

//   if (gamesRemain.textContent == '0') {
//     const timerRound = setTimeout(function() {
//       // modalOverlay.classList.toggle("hidden");
//       // modal.classList.toggle("hidden");
//       // modalClose.classList.toggle("hidden");
//         if (totalFirst.textContent > totalSecond.textContent) {
//           announceWinner("First player has won after 3 rounds", -1, 0);
//         } else if (totalFirst.textContent < totalSecond.textContent) {
//           announceWinner("Second player has won after 3 rounds", -1, 0);
//         } else {
//           announceWinner("Draw has been happened after 3 rounds", -1, 0);
//         }
//     }, 1000);
//     if (!calls) clearTimeout(timerRound);
//   }
// };

const announceWinner = function(text, winner = 0, calls) {
  changeModalState();
  answer.textContent = text;
  if (winner == 1) totalFirst.textContent = +totalFirst.textContent + 1;
  else if (winner == 2) totalSecond.textContent = +totalSecond.textContent + 1;
  else if (winner == 0) {
    totalFirst.textContent = +totalFirst.textContent + 1;
    totalSecond.textContent = +totalSecond.textContent + 1;
  }
  if (winner != -1)
    gamesRemain.textContent = +gamesRemain.textContent - 1;
  changeBtnState(gamesRemain.textContent);
  // console.log(totalFirst, totalSecond, gamesRemain.textContent);

  console.log(calls, gamesRemain.textContent);
};



// Changing modal status whenever modalOverlay or modalClose will be clicked
[modalOverlay, modalClose].forEach(item => {
  item.addEventListener("click", changeModalState);
});

// announce user when we know which elements both of two players has pressed
const compareIndices = function() {
  // console.log(elementIndFirst, elementIndSecond);
  const diffFirst = (elementIndFirst - elementIndSecond + 3) % 3;
  const diffSecond = (elementIndSecond - elementIndFirst + 3) % 3;
  // console.log(diffFirst, diffSecond);
  if (diffFirst == 1) {
    // alert("First player has won");
    announceWinner("First player has won", 1);
  } else if (diffSecond == 1) {
    // alert("Second player has won");
    announceWinner("Second player has won", 2);
  } else {
    // alert("Draw");
    announceWinner("Draw", 0);
  }
}

// 3 seconds banning users and when first/second user clicks element, maximally timer will listen for another 1 second. If another player will not click on his element, we announce player as winner who only clicked game shape 
const waitForClicks = setInterval(function() {
  compare();
  if (timeFirst || timeSecond) {
    clearInterval(waitForClicks);
    const lastInterval = setTimeout(function() {
      compare();
      if (timeFirst && timeSecond) {
        // const msFirst = timeFirst.getMilliseconds();
        // const msSecond = timeSecond.getMilliseconds();
        compareIndices();
      } else if (timeFirst) {
        // alert("First player has won");
        announceWinner("First player has won", 1);
      } else {
        // alert("Second player has won");
        announceWinner("Second player has won", 2);
      }
      console.log("First player clicked", elementIndFirst, "Second player clicked", elementIndSecond);
      localStorage.clear();
      clearTimeout(lastInterval);
    }, 1000);
  } 
}, 1000);

// Continue function click function
const repeat = function() {
  timeFirst = timeSecond = elementIndFirst = elementIndSecond = null;
  localStorage.clear();

  // Banning access for users for 3 seconds
  let i = 4;
  const timer = setTimeout(function() {
    rowUp.classList.add("banned");
    rowDown.classList.add("banned");
    btnState.classList.add("banned");

    const timerInner = setInterval(async function() {
      scoreSecond.textContent = --i;
      scoreFirst.textContent = i;
      if (i == 0) {
        await preventBanning();
        clearInterval(timerInner);
      }
    }, 1000); 
  }, 0);  

  // 3 seconds banning users and when first/second user clicks element, maximally timer will listen for another 1 second. If another player will not click on his element, we announce player as winner who only clicked game shape 
  const waitForClicks = setInterval(function() {
    compare();
    if (timeFirst || timeSecond) {
      clearInterval(waitForClicks);
      const lastInterval = setTimeout(function() {
        compare();
        if (timeFirst && timeSecond) {
          // const msFirst = timeFirst.getMilliseconds();
          // const msSecond = timeSecond.getMilliseconds();
          compareIndices();
        } else if (timeFirst) {
          // alert("First player has won");
          announceWinner("First player has won", 1);
        } else {
          // alert("Second player has won");
          announceWinner("Second player has won", 2);
        }
        console.log("First player clicked", elementIndFirst, "Second player clicked", elementIndSecond);
        localStorage.clear();
        clearTimeout(lastInterval);
      }, 1000);
    } 
  }, 1000);
}

btnState.addEventListener("click", function() {
  if (btnState.classList.contains("banned")) {
    alert("You are not allowed to click buttons until timer will not end");
    return;
  }
  if (gamesRemain.textContent == '0') {
    totalFirst.textContent = 0;
    totalSecond.textContent = 0;
    gamesRemain.textContent = 3;
    btnState.textContent = "Continue";
  }
  repeat();
});