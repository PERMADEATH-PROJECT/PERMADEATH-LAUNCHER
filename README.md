# PERMADEATH LAUNCHER

**A launcher for Minecraft PERMADEATH servers, built with [Rust](https://www.rust-lang.org/) and [Tauri 2.0](https://tauri.app/).**

This project is a modern, highly customizable launcher for SMP servers with permanent death mechanics. Its modular architecture leverages Rust for the backend and Tauri for OS integration and the web frontend (HTML, CSS, TypeScript).

---

## 🚀 Features

- **Modern, responsive interface:** All main panels implemented in the frontend.
- **Full integration with the Minecraft ecosystem:** Includes Microsoft authentication, mod support, backups, and version control.
- **Modular architecture:** Each part fulfills a separate function and is easily integrable into other Rust projects.

---

## 📋 Project Status

### Front-end (Fully completed)
- [x] "Play" Panel
- [x] "Config" Panel
- [x] "Java VM" Panel
- [x] "Updates" Panel
- [x] Log-in Panel

### Back-end (To do)

#### To be implemented in the launcher (All to do)
- [ ] Server connection (Status, online players, stats, current day, etc)
- [ ] Update control
- [ ] Apply config changes to the application
- [ ] Apply Java VM changes to the application
- [ ] Implement log-in with launcher account
- [ ] Implement log-out with launcher account

#### Libraries and Tools

- **[Minecraft CLI Launcher](https://github.com/ponchisao326/Minecraft-Launcher-CLI) (Fully done):**
    - [x] Microsoft auth (OAuth2)
    - [x] Offline mode
    - [x] Minecraft version selection
    - [x] Mod support
    - [x] Automatic updates for Minecraft, Fabric Loader, and mods via FlowUpdater
    - [x] Customizable via command line: game version, RAM, working directory, etc.
    - [x] Progress reporting and detailed logging

- **[Request handler lib](https://github.com/ponchisao326/launcher-request-handler) (Fully done):**
    - [x] Version check: Compares current version to one published at a remote endpoint.
    - [x] Update panel: Retrieves details to display update info (description, changelog, image, etc.) from a remote JSON file.
    - [x] File download: Downloads ZIP files from a URL and stores them at a specified location.
    - [x] JSON utilities: Downloads and deserializes JSON files into any type implementing Deserialize.

- **[Launcher Installer Handler](https://github.com/ponchisao326/launcher-installer-handler) (Fully done):**
    - [x] Flexible extraction: Extracts ZIP files to any directory, ensuring all folders are created as needed.
    - [x] Automatic cleanup: Optionally deletes the ZIP file after extraction.
    - [x] System restart: Optionally restarts the system after installing or updating.
    - [x] Easy integration: Designed for use within Rust-based Minecraft launchers or any application requiring robust ZIP extraction and post-update actions.

- **[Minecraft Launcher Backup Library](https://github.com/ponchisao326/launcher-minecraft-handler) (Fully done):**
    - [x] Customizable backup options: Select which Minecraft folders to back up, set output paths, toggle compression, and exclude certain file extensions.
    - [x] Automatic metadata generation: Each backup generates a JSON file containing timestamp, size, file count, and backup options for tracking and auditing.
    - [x] ZIP compression: Optionally compress backups into a single ZIP file, including the backup metadata.
    - [x] Easy integration: Designed for Rust-based Minecraft launchers or any application needing robust backup functionality.

- **[Java Installation Handler]() (All to do):**
    - [ ] Detect existing Java installations, automatically identifying version numbers, bin paths, and status flags.
    - [ ] (Possibly) Apply Java updates automatically, automatically replacing each installed version with a newer release.
    - [ ] Prompt users before using a local version, rather than running it by default, unless otherwise specified.
    - [ ] Apply the selected version’s Java command line options, making those profiles available in a drop down list.
    - [ ] Download and install Java versions from the official Oracle website based on the requested version.

---

## 📦 Project Structure

```
├── src-tauri/            # Rust backend (Tauri commands, integration logic)
├── src/                  # Frontend in HTML/CSS/TypeScript
├── /libs                 # Rust libraries for CLI, backup, installer, etc.
├── /handlers             # Modules and utilities for requests and updates
├── /docs                 # Technical and user documentation
```

---

## 🛠️ Requirements

- [Rust](https://www.rust-lang.org/tools/install) (stable)
- [Node.js](https://nodejs.org/) (for frontend and Tauri)
- [Tauri CLI](https://tauri.app/)

---

## 📚 Installation and Usage

1. Install dependencies:
   ```bash
   pnpm install
   cargo install tauri-cli
   ```

2. Run the launcher in development mode:
   ```bash
   pnpm tauri dev
   ```

3. Build for distribution:
   ```bash
   pnpm tauri build
   ```

---

## 💬 Community & Contribution

All suggestions, reports, and PRs are welcome!  
Check the [issues](https://github.com/ponchisao326/PERMADEATH-LAUNCHER/issues) for pending tasks and bugs.

---

## 📝 License

MIT © ponchisao326
