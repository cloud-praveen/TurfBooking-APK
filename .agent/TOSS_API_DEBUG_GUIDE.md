# Toss API Integration Fixed

## Changes Applied

I have updated the `TossSelectionScreen.tsx` to strictly follow the required API contract:

- **Endpoint**: `POST /api/matches/:matchId/start`
- **Body**:
  ```json
  {
    "tossWinnerId": "TEAM_ID_HERE",
    "tossDecision": "BAT" (or "BOWL")
  }
  ```

## Safety Checks Added

1. **Validation**: The code now strictly validates that `tossWinnerId` exists before calling the API.
2. **Error Handling**: If the ID is missing (e.g., incomplete data loading), it will alert you "Could not determine the winning team's ID" instead of making a bad API call.

## Verification

When you click "Start Game", look for these logs:

```
=== STARTING MATCH ===
Endpoint: ...
Payload: {
  "tossWinnerId": "...",
  "tossDecision": "BAT"
}
```

If it succeeds, the app will navigate to the Scoreboard.
If it fails, look for `=== START MATCH API ERROR ===` in the console.

## Troubleshooting

- **Error: "Could not determine the winning team's ID"**: This means the `matchData` loaded from the server is missing the `_id` field for the teams.
- **Error: 400 Bad Request**: Typically means the Payload structure is still rejected by the backend. Check the logs to see exactly what was sent.
