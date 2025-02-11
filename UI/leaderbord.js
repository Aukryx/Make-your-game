const leaderBoardList = document.getElementById("body-leaderboard");
const itemsPerPage = 5;
let ranks;
let currentPage = 1;
let VERBOSE = 0;

//Document loading
window.addEventListener("DOMContentLoaded", init);

async function init() {
  try {
    await updateLeaderboard();
    addToggleButton();
    createPaginationControls();
    if (VERBOSE >= 1) console.log(ranks);
    displayRanks(ranks);
  } catch (error) {
    console.error("Failed to initialize leaderboard:", error);
  }
}

async function getData(data) {
  try {
    const response = await fetch(data);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text(); // Get the response as text first
    try {
      return JSON.parse(text); // Try to parse the text as JSON
    } catch (e) {
      console.error("Failed to parse JSON:", text);
      throw new Error("Invalid JSON response");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error so it can be handled by the calling function
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
  if (prevButton && nextButton) {
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage >= Math.ceil(ranks.length / itemsPerPage);
  }

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

async function getRanks() {
  const data = await getData("/api/scores");

  // Sort the data first by score (descending), then by time for equal scores
  return data
    .sort((a, b) => {
      // First compare scores (in descending order)
      if (b.Score !== a.Score) {
        return b.Score - a.Score;
      }

      // If scores are equal, compare times
      // Convert time strings to Date objects for comparison
      const timeA = new Date(`1970-01-01T${a.Time}`);
      const timeB = new Date(`1970-01-01T${b.Time}`);

      return timeA - timeB; // Earlier times come first
    })
    .map((rank, index) => ({
      ...rank,
      Rank: index + 1, // Update ranks based on new sorting
    }));
}

async function sendScore(score) {
  try {
    const scr = document.getElementById("score");
    const data = {
      Name: score.Name,
      Score: parseInt(scr.textContent),
      Time: score.Time,
      Rank: 0,
    };

    console.log(data);

    const response = await fetch("/api/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (err) {
    console.error("Failed to send score:", err);
  }
}

async function updateLeaderboard() {
  try {
    ranks = await getRanks();
    // Mettre à jour l'affichage du highscore si on a des données
    if (ranks && ranks.length > 0) {
      const topScore = ranks[0].Score;
      const highscore = document.getElementById("highscore");
      highscore.textContent = topScore;
    }
    displayRanks(ranks);
  } catch (error) {
    console.error("Failed to update leaderboard:", error);
  }
}
