document.addEventListener("DOMContentLoaded", () => {
  const leaderboardBody = document.getElementById("leaderboardBody");
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  const pageInfoSpan = document.getElementById("pageInfo");
  const backButton = document.getElementById("backButton");
  const playerNameInput = document.getElementById("search-bar");

  const ITEMS_PER_PAGE = 10;
  let currentPage = 1;
  let totalScores = [];

  function fetchLeaderboard() {
    fetch("/api/scores")
      .then((response) => response.json())
      .then((scores) => {
        totalScores = scores;
        renderPage(currentPage);
        updatePaginationControls();
        populatePlayerNames(scores);
      })
      .catch((error) => console.error("Erreur:", error));
  }

  function renderPage(page) {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pageScores = totalScores.slice(startIndex, endIndex);

    leaderboardBody.innerHTML = pageScores
      .map(
        (score, index) => `
            <tr>
                <td>${startIndex + index + 1}</td>
                <td>${score.Name}</td>
                <td>${score.Score}</td>
                <td>${score.Time}</td>
            </tr>
        `
      )
      .join("");

    pageInfoSpan.textContent = `Page ${page} / ${Math.ceil(
      totalScores.length / ITEMS_PER_PAGE
    )}`;
  }

  function populatePlayerNames(scores) {
    const datalist = document.getElementById("player-names");
    if (datalist) {
      const uniqueNames = new Set(scores.map((score) => score.Name));

      datalist.innerHTML = "";
      uniqueNames.forEach((name) => {
        const option = document.createElement("option");
        option.value = name;
        datalist.appendChild(option);
        console.log(option);
      });
    }
  }

  function updatePaginationControls() {
    const totalPages = Math.ceil(totalScores.length / ITEMS_PER_PAGE);
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
  }

  playerNameInput.addEventListener("input", () => {
    const playerName = playerNameInput.value;
    const playerIndex = totalScores.findIndex(
      (score) => score.Name === playerName
    );
    if (playerIndex !== -1) {
      currentPage = Math.floor(playerIndex / ITEMS_PER_PAGE) + 1;
      renderPage(currentPage);
      updatePaginationControls();
    }
  });

  prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderPage(currentPage);
      updatePaginationControls();
    }
  });

  nextPageBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(totalScores.length / ITEMS_PER_PAGE);
    if (currentPage < totalPages) {
      currentPage++;
      renderPage(currentPage);
      updatePaginationControls();
    }
  });

  backButton.addEventListener("click", () => {
    window.location.href = "/";
  });

  fetchLeaderboard();
});
