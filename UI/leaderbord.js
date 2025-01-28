const leaderBoardList = document.getElementById("body-leaderboard");
const itemsPerPage = 5;
let ranks;
let currentPage = 1;

//Document loading
window.addEventListener("DOMContentLoaded", init);

async function init() {
  ranks = await getRanks();
  addToggleButton();
  createPaginationControls();
  displayRanks(ranks);
  if (VERBOSE >= 1) console.log(ranks);
}

async function getData(data) {
  try {
    const response = await fetch(data);
    const dataJson = await response.json();
    return dataJson;
  } catch (error) {
    console.error("Error fetching data", error);
  }
}

async function getRanks() {
  const data = await getData("/api/scores");
  return data;
}

function createPaginationControls() {
  const paginationDiv = document.createElement("div");
  paginationDiv.className = "pagination";

  const previousBtn = document.createElement("button");
  previousBtn.textContent = "Previous";
  previousBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      displayRanks(ranks);
    }
  });

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.addEventListener("click", () => {
    const maxPage = Math.ceil(ranks.length / itemsPerPage);
    if (currentPage < maxPage) {
      currentPage++;
      displayRanks(ranks);
    }
  });

  paginationDiv.appendChild(previousBtn);
  paginationDiv.appendChild(nextBtn);
  document.getElementById("leaderboard").appendChild(paginationDiv);
}

function addToggleButton() {
  const toggleButton = document.createElement("button");
  toggleButton.id = "toggle-leaderboard";
  toggleButton.textContent = "X";
  document.body.appendChild(toggleButton);

  const leaderboard = document.getElementById("leaderboard");
  leaderboard.classList.add("visible");

  toggleButton.addEventListener("click", () => {
    const leaderboard = document.getElementById("leaderboard");
    leaderboard.classList.toggle("visible");
    toggleButton.textContent = leaderboard.classList.contains("visible")
      ? "X"
      : "Leaderboard";
  });
}

function displayRanks(ranks) {
  leaderBoardList.innerHTML = "";

  const startINdex = (currentPage - 1) * itemsPerPage;
  const endIndex = startINdex + itemsPerPage;

  // Update pagination buttons state
  const prevButton = document.querySelector(".pagination button:first-child");
  const nextButton = document.querySelector(".pagination button:last-child");
  prevButton.disabled = currentPage === 1;
  console.log(ranks);
  nextButton.disabled = currentPage >= Math.ceil(ranks.length / itemsPerPage);

  for (let i = startINdex; i < endIndex; i++) {
    const rank = ranks[i];
    const tr = document.createElement("tr");

    const tdRank = document.createElement("td");
    console.log(rank.Rank);
    tdRank.textContent = rank.Rank;

    const tdPlayer = document.createElement("td");
    tdPlayer.textContent = rank.Name;

    const tdScore = document.createElement("td");
    tdScore.textContent = rank.Score;

    const tdTime = document.createElement("td");
    const time = new Date(rank.Time);
    tdTime.textContent = `${time.getHours().toString().padStart(2, "0")}:${time
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${time.getSeconds().toString().padStart(2, "0")}`;

    tr.appendChild(tdRank);
    tr.appendChild(tdPlayer);
    tr.appendChild(tdScore);
    tr.appendChild(tdTime);
    leaderBoardList.appendChild(tr);
  }
}
