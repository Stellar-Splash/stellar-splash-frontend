# Contributing to Stellar Splash Frontend

Thank you for your interest in contributing to **Stellar Splash Frontend**! We welcome contributions to help improve the web gaming platform, UI responsiveness, wallet integrations, and developer experience.

---

## Code of Conduct

All contributors must adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please treat all members of the community with dignity and respect.

---

## Development Setup

### Prerequisites
- **Node.js**: `>= 18.x`
- **npm**: `>= 9.x`
- Modern browser (Chrome, Edge, Firefox, Brave)

### Getting Started
1. **Fork and Clone** the repository:
   ```bash
   git clone https://github.com/Stellar-Splash/stellar-splash-frontend.git
   cd stellar-splash-frontend
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## Testing & Quality Assurance

Before submitting any Pull Request:
1. **Run Unit Tests**:
   ```bash
   npm test
   ```
2. **Verify TypeScript & Production Build**:
   ```bash
   npm run build
   ```
   Ensure there are no compile errors or broken type declarations.

---

## Pull Request Guidelines

1. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/my-enhancement
   ```
2. **Commit Style**:
   - Follow standard Conventional Commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`.
   - Keep commit messages concise, descriptive, and imperative.
3. **Submit PR**:
   - Provide a clear summary of what was changed and why.
   - Include screenshots or recordings for any UI/UX modifications.
   - Ensure all CI tests pass.
