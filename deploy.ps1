# Run this script after installing Git and creating a GitHub repository.
# Replace <your-username> and <repo-name> before running.

$repoUrl = "https://github.com/<your-username>/<repo-name>.git"

cd "${PWD}"

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin $repoUrl
git push -u origin main

Write-Host "Repository pushed to $repoUrl"
Write-Host "Then enable GitHub Pages from the repo settings to publish the site."