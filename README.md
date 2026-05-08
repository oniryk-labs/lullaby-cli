<div align="center">
  <img src="https://raw.githubusercontent.com/oniryk-labs/lullaby-cli/blob/main/banner.png" alt="lullaby logo" width="100%"/>

  <p><strong>@oniryk/llby-cli ✦ no more commit nightmares</strong></p>

  <p>
    <a href="https://www.npmjs.com/package/@oniryk/llby-cli"><img src="https://img.shields.io/npm/v/@oniryk/llby-cli.svg" alt="NPM Version"/></a>
    <a href="https://github.com/oniryk/llby-cli/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@oniryk/llby-cli.svg" alt="License"/></a>
  </p>
</div>

## 🤔 What is lullaby?

**lullaby** is a simple and lightweight command-line interface (CLI) tool that validates your commit messages to ensure they follow the Conventional Commits specification.

With lullaby installed in your project, you can ensure a clean, readable, and standardized commit history, making it easier to automate changelogs and navigate the project's history. No more nightmares about non-standard commit messages!

## ✨ Features

- **Automatic Validation**: Uses Git Hooks (`commit-msg`) to validate messages before each commit.
- **Simple Setup**: Just one command to configure everything in your repository.
- **Lightweight and Fast**: Focused on doing one thing well without cluttering your environment.
- **Industry Standard**: Ensures compliance with the Conventional Commits standard.

## 🚀 Installation

To use lullaby, install it globally using `npm` or `yarn`:

```bash
npm install -g @oniryk/llby-cli
```

## Usage

After installation, using it is extremely simple.

### 1. Authenticate

Before using lullaby, you must authenticate with your access token. This step is required for the tool to work properly.

```bash
llby auth <your-access-token>
```

Replace `<your-access-token>` with your actual token. If you don't have a token, please refer to the documentation or your account settings to obtain one.

### 2. Setting up the Hook

Navigate to the root of your repository and run the `setup` command. This will create the `commit-msg` hook file inside your `.git/hooks` folder.

```bash
llby setup
```

#### Alternative Usage with NPX

If you prefer not to install the package, you can run the setup command directly using `npx`. This is perfect for a quick, one-time setup on any project.

```bash
npx @oniryk/llby-cli setup
```

### 3. Committing

That's it! Now, every time you run the `git commit` command, lullaby will intercept the action, validate your message, and either allow or block the commit based on the Conventional Commits rules.

#### Using without hooks

If you prefer not to use Git Hooks, you can still validate your commit messages manually before committing. Simply run the following command with your commit message:

```bash
llby commit <commit-message>
// or
npx @oniryk/llby-cli commit <commit-message>
```

If the message is valid, the command will execute the commit for you. If not, it will provide feedback on what needs to be corrected.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <p>Made with ❤️ by <a href="https://oniryk.co/">oniryk labs</a></p>
</div>
