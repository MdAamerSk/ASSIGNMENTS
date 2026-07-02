# LedgerLite — Personal Finance Tracker with Expense Analytics

A clean, responsive personal finance tracker UI built with plain HTML, CSS and a small amount of JavaScript. LedgerLite provides an elegant dashboard with summary cards, charts (via Chart.js), a transaction form, filters and a transaction history table — with both dark and light theme support.

## Overview

LedgerLite is a front-end-only demo application that helps you track income and expenses, visualize spending patterns, and manage transactions. The UI is designed to be modern, accessible, and responsive across devices.

## Features

- Beautiful dashboard with summary cards: Balance, Income, Expense, Transactions Count.
- Interactive charts powered by Chart.js for expense analytics and trends.
- Add, edit, and delete transactions using a form with validation.
- Filter and search transactions by category, type, or text.
- Responsive layout with a dark/light theme toggle and glassmorphism surfaces.
- Smooth animations and subtle background glow orbs for a polished look.

## Technologies

- HTML5
- CSS3 (modern layout, variables, and animations)
- JavaScript (small scripts and Chart.js for charts)
- Chart.js (loaded from CDN)

## Project structure

```
Assignment8/
├─ index.html        # Main UI for LedgerLite (dashboard, forms, charts, table)
├─ README.md         # (this file) overview and instructions
└─ (optional assets) # images, icons, or additional scripts/styles if present
```

## How to run

LedgerLite is a static front-end project. To open it locally:

1. Clone this repository or download the `Assignment8` folder.
2. Open `Assignment8/index.html` in a browser. The app should render immediately.

If you prefer serving the files over a local HTTP server (recommended for some browser features):

- Using Python 3:

  python3 -m http.server 8000

  Then open http://localhost:8000/Assignment8/index.html in your browser.

## How to use

- Add a transaction: Fill the form (title, category, amount, type — income/expense) and submit to see it added to the history and summary cards update.
- Edit / Delete: Use the edit and delete controls in the transactions table to modify or remove entries.
- Filters & Search: Use the search box and filter tabs to narrow the transaction list.
- Charts: Check the analytics charts to view expense distribution and trends. Charts are powered by Chart.js.
- Theme: Toggle between dark and light themes (the app uses a `data-theme` attribute on `<html>` to switch variables).

## Customization

- Colors & tokens: The CSS defines a design token section (CSS variables) at the top of `index.html` which you can modify to change colors, spacing, radii, and transitions.
- Charts: Chart.js is loaded from CDN; you can adjust chart options or datasets in the JavaScript portion of the app.

## Notes for developers

- The UI uses CSS variables for theme management; toggling `html[data-theme]` between `dark` and `light` alters colors globally.
- Summary cards, history table, and charts are laid out using CSS Grid and Flexbox for responsiveness.
- If you add external assets or scripts, place them under the `Assignment8` folder and reference them from `index.html`.

## Contributing

This is an assignment/demo project. If you want to extend it:

- Add persistent storage (localStorage or an API) to keep transactions between sessions.
- Implement CSV export/import for transaction data.
- Add additional charts (monthly trends, category heatmaps) and more granular filters.

## License

This project is provided as-is for demonstration/assignment purposes. Feel free to reuse or adapt the code for learning and personal projects.

---

If you want, I can also:
- Add screenshots or GIFs to the README,
- Wire up a small local storage implementation so transactions persist between reloads, or
- Extract the CSS into a separate file for cleaner structure.

Tell me which of the above you'd like next and I'll update the repo accordingly.