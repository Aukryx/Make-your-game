package main

import (
	"fmt"
	"net/http"
	"text/template"
	"time"
)

func LaunchServer(port string) {
		server := &http.Server{
				Addr: ":" + port,
				ReadTimeout: 10 * time.Second,
				WriteTimeout: 10 * time.Second,
				IdleTimeout: 30 * time.Second,
				ReadHeaderTimeout: 2 * time.Second,
				MaxHeaderBytes: 1 << 20,
		}

		fs := http.FileServer(http.Dir("./web/"))
		http.Handle("/web/", http.StripPrefix("/web/", fs))
		http.HandleFunc("/", GameHandler)

		fmt.Printf("Starting server on http://localhost%s\n", server.Addr)
		if err := server.ListenAndServe(); err != nil {
				fmt.Printf("Error starting server: %v\n", err)
		}
}

func GameHandler(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
				http.NotFound(w, r)
				return
		}
		tmpl, _ := template.ParseFiles("./web/index.html")
		tmpl.Execute(w, nil)
}