# AI-Based-Identification-of-Financial (FinSense AI)

A static HTML/CSS/JS project for AI-driven financial and crop insurance recommendations.

## Run locally

1. Open a terminal in the project folder.
2. Start a local server:

```powershell
python -m http.server 8000
```

3. Open `http://localhost:8000` in your browser.

## Deploy to GitHub Pages

This project is fully static and can be hosted on GitHub Pages.

### Option 1: GitHub Pages direct deployment

1. In your GitHub repository settings, go to Pages and set the source to:
   - Branch: `gh-pages` or `main`
   - Folder: `/ (root)`

If you use the `main` branch, GitHub will serve the site from the repository root.

### Option 2: Automated deployment with GitHub Actions

This repository includes a GitHub Actions workflow at `.github/workflows/gh-pages.yml`.
It can deploy the site automatically to the `gh-pages` branch whenever you push to `main`.

1. Push the project to the `main` branch.
2. Go to GitHub repository settings > Pages and select `gh-pages` branch and `/ (root)` folder.
3. The published site will be available at:

```
https://<your-username>.github.io/<repository-name>/
```

## Notes

- The project uses CDN-hosted Bootstrap, Font Awesome, AOS, SweetAlert2, and Chart.js.
- All internal links are relative, so the site works correctly on GitHub Pages.
- If you want a custom domain, add a `CNAME` file in the repository root.
