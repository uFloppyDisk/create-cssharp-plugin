import chalk from "chalk";
import gradient from "gradient-string";

const HEADER = `  ____                  _            ____  _        _ _        ____  _
 / ___|___  _   _ _ __ | |_ ___ _ __/ ___|| |_ _ __(_| | _____/ ___|| |__   __ _ _ __ _ __
| |   / _ \\| | | | '_ \\| __/ _ | '__\\___ \\| __| '__| | |/ / _ \\___ \\| '_ \\ / _\` | '__| '_ \\
| |__| (_) | |_| | | | | ||  __| |   ___) | |_| |  | |   |  __/___) | | | | (_| | |  | |_) |
 \\____\\___/ \\__,_|_| |_|\\__\\___|_|  |____/ \\__|_|  |_|_|\\_\\___|____/|_| |_|\\__,_|_|  | .__/
                                                                                     |_|
`;

const print = console.log;

export function error(msg: string) {
  print("🚨", chalk.bold.red(msg));
}

export function warn(msg: string) {
  print("⚠️ ", chalk.bold.yellow(msg));
}

export function renderMasthead() {
  print(gradient([
    "#0ea5e9",
    "white",
    "#f59e0b",
  ]).multiline(HEADER));
}

export function renderGoodbye() {
  print("👋", gradient.fruit("Goodbye!"));
}
