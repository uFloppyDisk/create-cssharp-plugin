# PLUGIN_NAME
Author: PLUGIN_AUTHOR

PLUGIN_DESCRIPTION


## Getting Started
If you need help getting started with making a CounterStrikeSharp plugin, head over to the docs:\
https://docs.cssharp.dev/

## Building during development
Build your plugin using `dotnet` CLI:
```shell
dotnet build
```
or
```shell
dotnet watch build --project src/PLUGIN_NAME.csproj
```
and find your plugin build at `./build/PLUGIN_NAME`

Optionally, [setup automatic live hot-reloading on your remote server](/docs/auto-live-hot-reloading.md)

## Building for release
Build your plugin using `dotnet` CLI:
```shell
dotnet publish
```
and find your plugin published at `./publish/PLUGIN_NAME`

## Template info
By default, **create-cssharp-plugin** initializes your project with a reference to 
the latest `1.*` version of `CounterStrikeSharp.API` as managed by NuGet.

`CounterStrikeSharp.API` and its dependancies **will not** be bundled with your plugin
build to reduce bundle size and avoid redundancy. This is **recommended**; however, 
if you wish to undo this default, you can change the following lines in `PLUGIN_NAME.csproj`
```xml
<PackageReference Include="CounterStrikeSharp.API" version="1.*">
    <PrivateAssets>all</PrivateAssets>
</PackageReference>
```
to:
```xml
<PackageReference Include="CounterStrikeSharp.API" version="1.*" />
```

Generated using **create-cssharp-plugin** version CLI_VERSION
