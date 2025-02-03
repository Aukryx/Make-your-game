document.addEventListener('DOMContentLoaded', () => {
    const leaderboardBody = document.getElementById('leaderboardBody');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfoSpan = document.getElementById('pageInfo');
    const backButton = document.getElementById('backButton');

    const ITEMS_PER_PAGE = 10;
    let currentPage = 1;
    let totalScores = [];

    function fetchLeaderboard() {
        fetch('/api/scores')
            .then(response => response.json())
            .then(scores => {
                totalScores = scores;
                renderPage(currentPage);
                updatePaginationControls();
            })
            .catch(error => console.error('Erreur:', error));
    }

    function renderPage(page) {
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const pageScores = totalScores.slice(startIndex, endIndex);

        leaderboardBody.innerHTML = pageScores.map((score, index) => `
            <tr>
                <td>${startIndex + index + 1}</td>
                <td>${score.Name}</td>
                <td>${score.Score}</td>
                <td>${score.Time}</td>
            </tr>
        `).join('');

        pageInfoSpan.textContent = `Page ${page} / ${Math.ceil(totalScores.length / ITEMS_PER_PAGE)}`;
    }

    function updatePaginationControls() {
        const totalPages = Math.ceil(totalScores.length / ITEMS_PER_PAGE);
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
    }

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
            updatePaginationControls();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(totalScores.length / ITEMS_PER_PAGE);
        if (currentPage < totalPages) {
            currentPage++;
            renderPage(currentPage);
            updatePaginationControls();
        }
    });

    backButton.addEventListener('click', () => {
        window.location.href = '/';
    });

    fetchLeaderboard();
});