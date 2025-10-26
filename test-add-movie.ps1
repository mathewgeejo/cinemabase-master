# Test Add Movie API

$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZmUxY2FjYTc4YTg2NGJmOGI0ZDM1MSIsImlhdCI6MTc2MTQ4NzI2MCwiZXhwIjoxNzYxNDkwODYwfQ.n9kJlhOPnAOWf1_gGEAA8r92L0YLdBMoQ-2b_qAkWKo"

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$body = @{
    title = "Test Movie"
    genre = "68fe1b999d185c3a74453b4c"
    rate = "8.5"
    description = "A test movie description"
    trailerLink = "https://example.com/trailer"
    movieLength = "120"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/movies/addMovie" -Method POST -Headers $headers -Body $body
    Write-Host "Success: $($response | ConvertTo-Json)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host "Response: $($_.Exception.Response)"
}