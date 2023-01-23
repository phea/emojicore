# 🤘 emojicore

![emojicore-web-ide-sized](https://user-images.githubusercontent.com/950371/214120471-898e59fc-dff8-4ce5-b2ba-9718ed106c05.png)

Emojicore is a fun toy programming language that allows you to express integers in the form of emojis, called 'entegers'. In addition to entegers, Emojicore also supports booleans and non-negative integers. With Emojicore, you can perform basic arithmetic operations and logical operations using a combination of entegers, booleans, and integers.

## Types

- Integers: non-negative integers of arbitrary length
- Entegers: non-negative integers of arbitrary length, represented in emoji form.
- Booleans: true or false

## Explore

- Web IDE: You can use the web-based IDE to explore the language and run emojicore code.

```bash
$ cd src/playground
$ npm run dev
```
- REPL: A command line REPL is available to try out

```bash
$ npx tsc
$ node build/repl/repl.js
```

## Language Spec

```javascript
# Arithmetic operation with entegers
1️⃣5️⃣5️⃣ + 6️⃣0️⃣ = 2️⃣1️⃣5️⃣;
# Output: 2️⃣1️⃣5️⃣

#Arithmetic operation with integers
12 + 5 = 17;
# Output: 17

# Comparison of entegers and integers
1️⃣5️⃣5️⃣ > ent(11123);
# Output: false

# Equality check
1️⃣ == 1️⃣;
# Output: true

# Not equals check
1️⃣ != 5️⃣;
# Output: true

# Assignment of value to variable
let x = 1️⃣5️⃣5️⃣;

# If-else statement
if(x > 11123) {
    print("x is greater than 11123");
} else {
    print("x is not greater than 11123");
}

# Loop
iter(x) {
    print(x);
    x--;
}

# Function
func add(a, b) {
    return a+b;
}
print(add(1️⃣5️⃣5️⃣, 6️⃣0️⃣));

# Builtin functions
print(int(1️⃣5️⃣5️⃣)); # Output: 1555
print(ent(11123)); # Output: 1️⃣1️⃣1️⃣2️⃣3️⃣
```

## Contributing

We welcome contributions to Emojicore. If you would like to contribute, please fork the repository and make your changes. Once you have made your changes, please submit a pull request for review.

## License

Emojicore is released under the MIT License. See the LICENSE file for more information.
