# Product Guidelines

## Tone and Voice
- **Technical and Precise:** The application should use professional trading and programming terminology. Communication should be accurate, concise, and focused on the needs of a developer-centric audience. Avoid overly simplified language where technical precision is more valuable.

## Visual Identity
- **Professional & Data-Dense:** The UI should evoke the feel of a high-performance trading terminal.
- **Theme:** Prefer dark mode for reduced eye strain during long sessions.
- **Layout:** Use compact data layouts that maximize information density without sacrificing readability.
- **Typography:** Consider monospace fonts for data tables and rule definitions to align with developer preferences.

## Error Handling and Validation
- **Explicit Failures:** In the event of an error during backtesting or data fetching, the application must provide immediate, detailed feedback.
- **Technical Feedback:** Logs should include technical details and stack traces where appropriate to help the developer identify and fix issues in their rule definitions or data sources.
- **Strict Validation:** Input rules and data formats should be strictly validated before processing to prevent silent failures.

## Documentation Standards
- **Highly Detailed:** All internal and external documentation must be comprehensive.
- **Architecture:** Provide clear diagrams of the backtesting engine and data pipeline.
- **API Specs:** Document all internal and external API interfaces using standard formats (e.g., OpenAPI).
- **In-Code Documentation:** Maintain high-quality docstrings and comments explaining the *why* behind complex logic.
