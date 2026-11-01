# Contributing to MindCheck AI

Thank you for your interest in contributing to **MindCheck AI**! We welcome community contributions that help create a calm, empathetic, and privacy-conscious mental wellness platform.

## 🤝 Code of Conduct & Core Principles

1. **Human & Empathetic**: Maintain a calm, respectful, non-judgmental tone throughout all UI copy and code comments.
2. **Clinical Boundaries**: Never introduce features or copy that claim to diagnose disorders, prescribe medications, or replace licensed psychiatric care.
3. **Privacy First**: Never log sensitive user reflections or send unencrypted disclosures to external analytics providers.
4. **Accessible & Responsive**: Ensure every new component maintains proper text contrast, keyboard navigation, and responsive scaling.

## 🛠️ Development Workflow

1. **Fork and Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/MindCheck-AI.git
   cd MindCheck-AI
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local` and add your development keys if testing live cloud integrations.
   *Note: Local demo mode operates without any external API keys.*

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Run Tests & Verify Build**:
   Before submitting a Pull Request, verify that all test suites and the production build pass cleanly:
   ```bash
   npm test
   npm run build
   ```

6. **Submit a Pull Request**:
   - Provide a clear, descriptive title and summary of changes.
   - Reference any related issues.
   - Ensure no temporary files or secrets are included.
