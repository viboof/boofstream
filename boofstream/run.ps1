while ($true) {
    try {
        # Run your command here
        npx tsx index.ts
    }
    catch {
        # Handle the error if the command fails
        Write-Host "Error occurred: $_. Restarting..."
    }
    Start-Sleep -Seconds 1  # Optional: add a delay before restarting
}
