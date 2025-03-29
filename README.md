# Create CounterStrike Sharp Plugin
##### Bootstrap your CounterStrike Sharp plugin project in no time at all!

***create-cssharp-plugin*** offers a mighty fine project template to get you started quickly.

#### Features
- [x] Generates a `.sln` file with your `.csproj` already referenced<ins><sup>*</sup></ins>
- [x] Bootstraps a `.cs` entry file with `Module(.*)` fields populated based on input
- [x] Initializes a git repository and stages the project for you
- [x] Comes with a complementary `.gitignore` out of the box!

<ins><sup>*</sup></ins> [`dotnet`](https://learn.microsoft.com/en-us/dotnet/core/tools/) CLI must be installed

#### Planned and potential features
- [ ] Unit test template
- [ ] Opinionated project structure (directories for commands, hooks, etc.)
- [ ] GitHub actions release workflow (build plugin and generate GH release with plugin artifacts attached)

## Prerequisites
<details>
    <summary><b>NodeJS (v20 recommended)</b></summary>

You can get NodeJS by going to their website and selecting your OS, node version, and package manager.\
https://nodejs.org/en/download
</details>
<details>
    <summary>dotnet CLI [optional]</summary>

The `dotnet` CLI *should* come with .NET SDK.\
**Install .NET SDK**\
[Linux](https://learn.microsoft.com/en-us/dotnet/core/install/linux)
\-
[Windows](https://learn.microsoft.com/en-us/dotnet/core/install/windows)

Learn more: https://learn.microsoft.com/en-us/dotnet/core/tools/
</details>

## Installation

Run using your favourite package manager:

<details>
    <summary><b>npm</b></summary>

Run on-demand via npm:

    npx create-cssharp-plugin
**OR** install as a command globally:

    npm install -g create-cssharp-plugin
    create-cssharp-plugin
</details>

<details>
    <summary><b>yarn</b></summary>

Run on-demand via yarn:

    yarn exec create-cssharp-plugin
**OR** install as a command globally:

    yarn global add create-cssharp-plugin
    create-cssharp-plugin
</details>

<details>
    <summary><b>pnpm</b></summary>

Run on-demand via pnpm:

    pnpm dlx create-cssharp-plugin
**OR** install as a command globally:

    pnpm add -g create-cssharp-plugin
    create-cssharp-plugin
</details>

## Usage

#### Interactive prompts
Create your CounterStrikeSharp plugin project using interactive step-by-step prompts in
your terminal.

Run `create-cssharp-plugin` with no arguments to enter interactive mode and follow 
the prompts.\
ex. `npx create-cssharp-plugin`

#### Command-line arguments
Generate your CounterStrikeSharp plugin project directly from the command line.

<details open>
    <summary>Generate a project named "example"</summary>

`create-cssharp-plugin example`
</details>

<details>
    <summary>Generate a project with a different plugin name(space).</summary>

`create-cssharp-plugin -p differentName example`
</details>

<details>
    <summary>Generate a project with an author and description</summary>

`create-cssharp-plugin -a JohnCSSharp -d "It's CSSharping time" example`
</details>

> [!NOTE]
> If you specify a project directory as the first positional argument when running 
`create-cssharp-plugin`, all interactive prompts will be skipped and defaults will apply.

<details>
    <summary>Enter interactive mode after passing arguments</summary>

Show prompts and skip those set via arguments:\
`create-cssharp-plugin -i example`

Forcibly show all prompts with initial values populated from arguments:\
`create-cssharp-plugin -I example`
</details>

> [!NOTE]
> View CLI usage help by passing `-h` or `--help`

## Project Structure
Projects generated using `create-cssharp-plugin` have the following structure:
```
./projectName
├── projectName.sln
├── src
│   ├── pluginName.cs
│   └── pluginName.csproj
└── test
```

> [!NOTE]
> `create-cssharp-plugin` will create a project 
directory relative to your current working directory.

## Contributing

1. Clone this repository
```shell
git clone https://github.com/uFloppyDisk/create-cssharp-plugin.git
cd create-cssharp-plugin
```
2. Install dependancies
```shell
npm install
```
3. Open another shell and watch for changes
```shell
npm run dev
```
4. Run the CLI
```shell
npx .
```
When running the CLI this way, all plugin projects will be placed in the `.playground`
directory to avoid mixing with the rest of your filesystem and this repo's files.
