import chalk from "chalk";
import gradient from "gradient-string";
import ora from "ora";

const print = console.log;

import pkg from "package.json";

const HEADER = `  ____                  _            ____  _        _ _        ____  _
 / ___|___  _   _ _ __ | |_ ___ _ __/ ___|| |_ _ __(_| | _____/ ___|| |__   __ _ _ __ _ __
| |   / _ \\| | | | '_ \\| __/ _ | '__\\___ \\| __| '__| | |/ / _ \\___ \\| '_ \\ / _\` | '__| '_ \\
| |__| (_) | |_| | | | | ||  __| |   ___) | |_| |  | |   |  __/___) | | | | (_| | |  | |_) |
 \\____\\___/ \\__,_|_| |_|\\__\\___|_|  |____/ \\__|_|  |_|_|\\_\\___|____/|_| |_|\\__,_|_|  | .__/
                                                                                     |_|
`;

const spinnerFrames = ((): any[] => {
  const symbols = "⠁⠂⠄⡀⡈⡐⡠⣀⣁⣂⣄⣌⣔⣤⣥⣦⣮⣶⣷⣿⡿⠿⢟⠟⡛⠛⠫⢋⠋⠍⡉⠉⠑⠡⢁".split("");
  const chunkLength = Math.round(Math.sqrt(symbols.length));

  const colourEscapes = gradient([
    "#0ea5e9",
    "#f59e0b",
    "#0ea5e9",
  ])("%".repeat(chunkLength * 5)).split("%");


  const colours = [];
  for (let i = 0; i < colourEscapes.length; i += 2) {
    const pre = colourEscapes[i];
    const post = colourEscapes[i + 1] ?? '';
    colours.push((s: string) => {
      return `${pre}${s}${post}`;
    });
  }

  let index = 0;
  return colours.flatMap((c, cIdx, arr) => {
    const coloured = [];

    const chunkLengthCorrected = cIdx >= arr.length - 1 ? symbols.length - index : chunkLength;
    for (let i = 0; i < chunkLengthCorrected; i++) {
      coloured.push(c(symbols[index]));
      index = (index + 1) % symbols.length;
    }

    return coloured;
  });
})();

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

export function renderCliInfo() {
  print('Using', chalk.bold(pkg.name), pkg.version);
}

export function renderGoodbye() {
  print();
  print(gradient.fruit(`Thank you for using ${pkg.name}!`));
  print(`If you find this CLI useful, please consider:`);
  print(`🌟 Giving ${chalk.bold(pkg.name)} a star on Github!`);
  print(`✏️  Contributing to ${chalk.bold(pkg.name)} by making a pull request! `);
  print(`Did you have any problems using this CLI? Please consider:`);
  print(`🪲 Submitting an issue on Github!`);
  print(`Github: ${chalk.bold(pkg.homepage.split("#")[0])}`);
  print();
  print("👋", gradient.fruit("Goodbye!"));
}

export function createSpinner(message: string) {
  return ora({
    text: message,
    spinner: {
      frames: spinnerFrames,
      interval: 50
    }
  });
}
