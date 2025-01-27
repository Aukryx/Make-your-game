import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const APITestButtons = () => {
  const [result, setResult] = useState("");

  const getAllScores = async () => {
    try {
      const response = await fetch("/api/scores");
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  const addNewScore = async () => {
    try {
      const newScore = {
        Name: "Test Player",
        Rank: 1,
        Score: Math.floor(Math.random() * 1000),
        Time: new Date().toISOString(),
      };

      const response = await fetch("/api/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newScore),
      });

      const data = await response.text();
      setResult(`Status: ${response.status}\nResponse: ${data}`);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  const getHighestScore = async () => {
    try {
      const response = await fetch("/api/scores/highest");
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>API Test Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={getAllScores}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Get All Scores
          </Button>
          <Button
            onClick={addNewScore}
            className="bg-green-500 hover:bg-green-600"
          >
            Add Random Score
          </Button>
          <Button
            onClick={getHighestScore}
            className="bg-purple-500 hover:bg-purple-600"
          >
            Get Highest Score
          </Button>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Result:</h3>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-60 whitespace-pre-wrap">
            {result || "No data yet"}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default APITestButtons;
