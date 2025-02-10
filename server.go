package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"sort"
	"text/template"
	"time"
)

// Launch server with given port
func LaunchServer(port string) {
	server := &http.Server{
		Addr:              ":" + port,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      10 * time.Second,
		IdleTimeout:       30 * time.Second,
		ReadHeaderTimeout: 2 * time.Second,
		MaxHeaderBytes:    1 << 20,
	}

	fs := http.FileServer(http.Dir("./web/"))
	http.Handle("/web/", http.StripPrefix("/web/", fs))
	fs = http.FileServer(http.Dir("./players/"))
	http.Handle("/players/", http.StripPrefix("/players/", fs))
	fs = http.FileServer(http.Dir("./enemies"))
	http.Handle("/enemies/", http.StripPrefix("/enemies/", fs))
	fs = http.FileServer(http.Dir("./UI/"))
	http.Handle("/UI/", http.StripPrefix("/UI/", fs))
	http.HandleFunc("/", GameHandler)
	http.HandleFunc("/api/scores", ScoreHandler)

	fmt.Printf("Starting server on http://localhost%s\n", server.Addr)
	if err := server.ListenAndServe(); err != nil {
		fmt.Printf("Error starting server: %v\n", err)
	}
}

// Manage requests and responses for the game
func GameHandler(w http.ResponseWriter, r *http.Request) {
	switch r.URL.Path {
	case "/":
		tmpl, _ := template.ParseFiles("./web/menu.html")
		tmpl.Execute(w, nil)
	case "/game":
		tmpl, _ := template.ParseFiles("./web/index.html")
		tmpl.Execute(w, nil)
	case "/highscores":
		tmpl, _ := template.ParseFiles("./web/highscores.html")
		tmpl.Execute(w, nil)
	case "/api/scores/highest":
		if r.Method == "GET" {
			getHighestScore(w)
		}
	default:
		http.NotFound(w, r)
	}
}

//Handle score
func ScoreHandler(w http.ResponseWriter, r *http.Request){
	if r.URL.Path == "/api/scores"{
		switch r.Method {
    case "GET":
      getAllScores(w)
    case "POST":
      pushNewScore(w, r)
    }
	}
}


// Score structure
type Score struct {
	Name  string `json:"Name"`
	Rank  int    `json:"Rank"`
	Score int    `json:"Score"`
	Time  string `json:"Time"`
}

// Get all scores from the JSON file
func getScores() ([]Score, error) {
	var result []Score

	// Check if the file exists
	if _, err := os.Stat("./data/scores.json"); os.IsNotExist(err) {
		return result, nil
	}

	// Read the file
	fileContent, err := ioutil.ReadFile("./data/scores.json")
	if err != nil {
		return result, fmt.Errorf("erreur lors de la lecture du fichier: %v", err)
	}

	err = json.Unmarshal(fileContent, &result)
	if err != nil {
		return result, fmt.Errorf("erreur lors du décodage JSON: %v", err)
	}

	return result, nil
}

// Save a new score to the JSON file
func saveScore(score Score) error {
	scores, err := getScores()
	if err != nil {
		return fmt.Errorf("erreur lors de récupération des scores: %v", err)
	}

	exist := false

	for i, elem := range scores {
		if elem.Name == score.Name {
			if scores[i].Score <= score.Score{
				scores[i].Time = score.Time
				scores[i].Score = score.Score
        exist = true
			}
			exist = true
    }
	}

	if!exist {
    scores = append(scores, score)
  }

	// Sort scores by personal score in descending order
	sort.Slice(scores, func(i, j int) bool {
		return scores[i].Score > scores[j].Score
	})

	// Update ranks based on the sorted scores
	for i := range scores {
		scores[i].Rank = i + 1
	}

	data, err := json.MarshalIndent(scores, "", "  ")
	if err != nil {
		return fmt.Errorf("erreur lors du codage JSON: %v", err)
	}

	err = ioutil.WriteFile("./data/scores.json", data, 0644)
	if err != nil {
		return fmt.Errorf("erreur lors de l'écriture du fichier: %v", err)
	}
	return nil
}

// Hanfle Function for the get API request
func getAllScores(w http.ResponseWriter) {
	scores, err := getScores()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(scores)
}

// Handle Function for the POST API request
func pushNewScore(w http.ResponseWriter, r *http.Request) {
	var newScore Score
	err := json.NewDecoder(r.Body).Decode(&newScore)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = saveScore(newScore)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte("Score added successfully"))
}

// Handle Function for the GET API request (highest score)
func getHighestScore(w http.ResponseWriter) {
	scores, err := getScores()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if len(scores) == 0 {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte("[]"))
		return
	}

	highestScore := scores[0]
	for _, score := range scores {
		if score.Score > highestScore.Score {
			highestScore = score
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(highestScore)
}
