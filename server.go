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
	fs = http.FileServer(http.Dir("./UI/"))
	http.Handle("/UI/", http.StripPrefix("/UI/", fs))
	http.HandleFunc("/", GameHandler)

	fmt.Printf("Starting server on http://localhost%s\n", server.Addr)
	if err := server.ListenAndServe(); err != nil {
		fmt.Printf("Error starting server: %v\n", err)
	}
}

// Manage requests and responses for the game
func GameHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" && r.URL.Path != "/api/scores" && r.URL.Path != "/api/scores/highest" {
		http.NotFound(w, r)
		return
	}

	switch {
	case r.Method == "GET" && r.URL.Path == "/":
		tmpl, _ := template.ParseFiles("./web/index.html")
		tmpl.Execute(w, nil)
	case r.Method == "GET" && r.URL.Path == "/api/scores":
		getAllScores(w, r)
	case r.Method == "POST" && r.URL.Path == "/api/scores":
		pushNewScore(w, r)
	case r.Method == "GET" && r.URL.Path == "/api/scores/highest":
		getHighestScore(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
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

	// Append the new score
	scores = append(scores, score)

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
func getAllScores(w http.ResponseWriter, r *http.Request) {
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
func getHighestScore(w http.ResponseWriter, r *http.Request) {
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
