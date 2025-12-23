# Calculator

A simple web-based calculator built with HTML, CSS, and JavaScript.

## Overview
- Provides basic arithmetic operations (+, -, ×, ÷).
- Supports parentheses, decimals, percentage (%), and sign toggle (±).
- Implements a safe expression evaluator (no use of eval) and keyboard support.

## Features
- Basic operations: add, subtract, multiply, divide
- Parentheses for grouping
- Percentage conversion and sign toggle
- Backspace and clear all
- Keyboard shortcuts: digits, `+ - * /`, `Enter` for equals, `Backspace`, `Escape`, `s` for sign, `%` for percent
- Prevents large input and invalid expressions; shows `Error` for invalid operations

## Files
- `index.html`: App markup
- `style.css`: Styles for the app
- `script.js`: App logic and evaluator

## Run / Development
- Open `index.html` in your browser to use the calculator.
- You can serve it locally for better cross-browser behavior using Python:

```bash
python -m http.server 8000
# then open http://localhost:8000 in your browser
```
- Or use the VS Code Live Server extension to preview locally.

## Contributing
Feel free to open issues or submit a PR to add features or fix bugs.

## License
Add a license or leave as-is for private use.
