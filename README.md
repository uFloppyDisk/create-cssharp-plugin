# Create CounterStrike Sharp Plugin
##### Bootstrap your CounterStrike Sharp plugin project in no time at all!

***create-cssharp-plugin*** offers a mighty fine project template to get you started quickly.

#### Features
- [x] Generates a `.sln` file with your `.csproj` already referenced<ins><sup>*</sup></ins>
- [x] Bootstraps a `.cs` entry file with `Module(.*)` fields populated based on input
- [x] Comes with a complementary `.gitignore` out of the box!

<ins><sup>*</sup></ins> [`dotnet`](https://learn.microsoft.com/en-us/dotnet/core/tools/) CLI must be installed

#### Planned and potential features
- [ ] `git init`
- [ ] Unit test template
- [ ] Opinionated project structure (directories for commands, hooks, etc.)
- [ ] GitHub actions release workflow (build plugin and generate GH release with plugin artifacts attached)


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

Follow the prompts to generate your CounterStrike Sharp plugin!

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
