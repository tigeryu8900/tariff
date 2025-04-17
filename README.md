# 👊 TARIFF 🔥

Inspired by https://github.com/hxu296/tariff

The GREATEST, most TREMENDOUS Node.js package that makes importing great again!

![image](https://github.com/user-attachments/assets/0f3412c1-8731-4085-80b6-d92b2cd10c12)

## About

TARIFF is a fantastic tool that lets you impose import tariffs on Node.js packages. We're going to bring manufacturing BACK to your codebase by making foreign imports more EXPENSIVE!

![meme](https://github.com/user-attachments/assets/06df516e-92d3-4643-9a2c-fb269cca6864)

## Installation

```bash
# npm
npm install @tariff/tariff

# yarn
yarn install @tariff/tariff
```

## Usage

This package supports both `module` and `commonjs`.

For either of them, include a `tariffs.json` in the current working directory that specifies the tariff rates in
percentages.

```json
{
  "package1": 50,
  "package2": 100
}
```

In this case `package1` will be 50% slower, and `package2` will be 100% slower.

Add either `--import tariff` or `--loader tariff` to your `node` command. Currently, the `commonjs` version does not
support `--loader`.

```bash
# using import
node --import @tariff/tariff your-file.js

# using loader
node --loader @tariff/tariff your-file.js
```

## How It Works

When you import a package that has a tariff:
1. TARIFF measures how long the original import takes
2. TARIFF makes the import take longer based on your tariff percentage
3. TARIFF announces the tariff with a TREMENDOUS message

## Example Output

```
JUST IMPOSED a 50% TARIFF on is-even! Original import took 0.30666700000000446 ms, now takes 0.4600005000000067 ms. American packages are WINNING AGAIN! #MIGA
```

## Why TARIFF?

Because foreign packages have been STEALING our CPU cycles for TOO LONG! It's time to put AMERICA FIRST and make importing FAIR and BALANCED again!

## License

This is a parody package. Use at your own risk. MAKE IMPORTING GREAT AGAIN! 
