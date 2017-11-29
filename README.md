# nescode

Command-line and web-based Game Genie decoder/encoder for Nintendo Entertainment System (npmjs module)

**[Web-based example](https://satoshinm.github.io/nescode/)**

### Command-line interface (cli.js)

To install globally, use `npm install -g nescode`, then you can invoke this tool from
the command-line as `nescode`. Passing a Game Genie or hex code will decode and re-encode:

```sh
nescode $ nescode SLXPLOVS
Input:       SLXPLOVS

Address:     1123
Key:         de
Wantskey:    true
Value:       bd

Raw code:    1123?de:bd
Rocky code:  15C93C0A
Game Genie:  SLXPLOVS
nescode $ nescode 1123?de:bd
Input:       1123?de:bd

Address:     1123
Key:         de
Wantskey:    true
Value:       bd

Raw code:    1123?de:bd
Rocky code:  15C93C0A
Game Genie:  SLXPLOVS
```

## License

MIT
