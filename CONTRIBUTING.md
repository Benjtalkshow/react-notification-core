# Contributing to React Notification Core

First off, thank you for considering contributing to React Notification Core! It's people like you that make this library better for everyone. This document provides guidelines and steps for contributing.

## Table of Contents

- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)
  - [Pull Requests](#pull-requests)
- [Issue Assignment Process](#issue-assignment-process)
- [Development Workflow](#development-workflow)
  - [Setting Up the Development Environment](#setting-up-the-development-environment)
  - [Code Style Guidelines](#code-style-guidelines)


## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

**Before Submitting A Bug Report:**
- Check the [issues](https://github.com/Benjtalkshow/react-notification-core/issues) to see if the bug has already been reported
- Perform a quick search to see if the problem has already been addressed
- Determine if the issue is consistently reproducible

**How Do I Submit A Good Bug Report?**
Bugs are tracked as [GitHub issues](https://github.com/Benjtalkshow/react-notification-core/issues). Create an issue and provide the following information:

- **Use a clear and descriptive title** for the issue
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** after following the steps
- **Explain which behavior you expected to see instead and why**
- **Include screenshots or animated GIFs** if possible
- **If you're reporting a crash**, include a stack trace
- **Include your environment details** (OS, browser, React version, etc.)

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion, including completely new features and minor improvements to existing functionality.

**Before Submitting An Enhancement Suggestion:**
- Check if the enhancement has already been suggested
- Check if it aligns with the project's scope and goals

**How Do I Submit A Good Enhancement Suggestion?**
Enhancement suggestions are tracked as [GitHub issues](https://github.com/Benjtalkshow/react-notification-core/issues). Create an issue and provide the following information:

- **Use a clear and descriptive title** for the issue
- **Provide a step-by-step description** of the suggested enhancement
- **Provide specific examples** to demonstrate the steps
- **Describe the current behavior** and **explain which behavior you expected to see instead**
- **Explain why this enhancement would be useful** to most users
- **List some other libraries or applications** where this enhancement exists, if applicable
- **Include screenshots or animated GIFs** if applicable

### Your First Code Contribution

Unsure where to begin contributing? You can start by looking through these `beginner` and `help-wanted` issues:

- [Beginner issues](https://github.com/Benjtalkshow/react-notification-core/labels/beginner) - issues which should only require a few lines of code, and a test or two
- [Help wanted issues](https://github.com/Benjtalkshow/react-notification-core/labels/help%20wanted) - issues which should be a bit more involved than `beginner` issues

### Pull Requests

The process for submitting a pull request:

1. Fork the repository and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Submit the pull request

## Issue Assignment Process

React Notification Core follows a structured issue assignment process to ensure smooth collaboration:

1. **Issue Creation**: Anyone can create an issue to report bugs or suggest enhancements
   - Utilize the provided templates when available
   - Tag issues appropriately (`bug`, `enhancement`, `documentation`, etc.)

2. **Maintainer Review**: Maintainers will review new issues and may:
   - Ask for more information if needed
   - Apply additional labels
   - Add the issue to a project board
   - Close the issue if it's a duplicate or not relevant

3. **Issue Assignment**:
   - Maintainers may assign issues to specific contributors
   - Contributors can request to be assigned to an issue by commenting
   - Issues marked with `good first issue` are especially suitable for new contributors
   - **Important**: Wait for maintainer approval before starting work on an issue

4. **Working on an Issue**:
   - Once assigned, update the issue with your progress
   - If you can't complete the issue, please notify the maintainers so it can be reassigned
   - Aim to make progress within two weeks of assignment, or the issue may be reassigned

5. **Pull Request Creation**:
   - Only create pull requests for issues that you've been assigned to
   - Reference the issue number in your pull request using the format `Fixes #123` or `Resolves #123`

## Development Workflow

### Setting Up the Development Environment

1. Fork and clone the repository:
   ```
   git clone https://github.com/your-username/react-notification-core.git
   cd react-notification-core
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a branch for your feature or bugfix:
   ```
   git checkout -b feature/your-feature-name
   ```

4. Make your changes and commit them with a clear, descriptive commit message


- Make sure to add or update tests for your changes

### Code Style Guidelines

- Follow the existing code style
- Use the provided ESLint and Prettier configurations:
  ```
  npm run lint
  npm run format
  ```

- TypeScript Guidelines:
  - Use proper type annotations
  - Avoid using `any` type unless absolutely necessary
  - Document public APIs with JSDoc comments



## Building and Testing the Package Locally

To build and test the package locally:

1. Build the package:
   ```
   npm run build
   ```

2. Link the package globally:
   ```
   npm link
   ```

3. In your test project:
   ```
   npm link react-notification-core
   ```

4. Test your changes in a real project environment

---

## Acknowledgements

Thank you to all the people who have already contributed to React Notification Core!

<a href="https://github.com/Benjtalkshow/react-notification-core/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Benjtalkshow/react-notification-core" />
</a>

---

This contributing guide is adapted from the open-source contributing guide template.