import { exit } from '@tauri-apps/plugin-process';

const logOutButton = document.getElementById("exit");

logOutButton?.addEventListener("click", async () => {
  console.log("Log Out");
  await exit(0);
});