Game of Life Performance Comparison with React.js, Vue.js and MobX
==================================================================

Goals
-----

- measure react performance with different approaches to component updates using the Game of Life Game
- give can example complex enough to use different store approaches with React and Typescript and see detail solutions
  like using dom references

For me it was an interesting study in differences between React and Vue.js.
Writing complex systems in javascript raises the need for easy-to-use but powerful frameworks like React.js, Vue.js, Angular.js.
To enable better API documentation, easy refactoring and IDE code completion,
all examples were written using Typescript, trying to use the current de facto standard of integrating Typescript.

Disclaimer
----------

I'm not a specialist in all of the technologies used, thus there is a good chance I missed some obvious optimizations.
Suggestions for improvement en detail are welcome; important is still that the general flux architecture should be kept
to allow for maintainable, scalable applications.

Optimization Steps
------------------
- Dumb React: shouldComponentUpdate not used, everything is always rerendered
- Standard React: shouldComponentUpdate with standard equal as needed, 
- MobX: use MobX to do efficient Updates
- Immutable: use an immutable model for calculation

I did a port to Vue.js in [this repository](https://github.com/vanmeegen/game-of-life-vue), benchmark results are included here.


Results
-------

System: Intel Core i5-3317U 1.7GHz running Windows 10
Started with Random seed, wait for fps shown after 1 minute.

| Variant        | Size    | FPS | Browser                            |
|----------------|---------|-----|------------------------------------|
| Dumb React     | 150/5px | 0.3 | Edge 38.14393.0.0                  |
| Dumb React     | 150/5px | 0.4 | IE 11 1.576.14393.0 Update 11.0.38 |
| Dumb React     | 150/5px | 0.7 | Firefox 51.0.1 (64-Bit)            |
| Dumb React     | 150/5px | 1.3 | Chrome 56.0.2924.87 (64-bit)       |
| Standard React | 150/5px | 3.5 | Chrome 56.0.2924.87 (64-bit)       |

You can now import Markdown table code directly using File/Paste table data... dialog. 
Standard React Implementation varies dependent on random data.
Thus measurements were changed to "regular" data to have a fair comparison.

Variant | Size | FPS | Browser 
--- | --- | --- | ---
Standard React  | 150/5px | 5.7 | Chrome 56.0.2924.87 (64-bit)
Standard React  | 150/5px | 4.3 | Firefox 51.0.1 (64-Bit)
Standard React      | 150/5px | 1.9 | Edge 38.14393.0.0
Mobx React  | 150/5px | 18.4 | Chrome 56.0.2924.87 (64-bit)

Vue.js 2.2 was extremely slow, so I cancelled measurement of 150x150 and instead did a measurement with 75.
Remark: I recently updated to Vue 2.5, which was better, so 150x150 is possible here.

Variant | Size | FPS | Browser 
--- | --- | --- | ---
Vue.js  2.2    | 75/5px  | 5.5  | Chrome 56.0.2924.87 (64-bit)
Vue.js  2.5    | 150/5px  | 0.7  | Chrome 67.0.3396.99 (64-bit)

Since life gets sparse after a minute of calculating generations, I switched to pentomino shape, which has quite a long
lifetime.

Thus, here are the final Measurement with Pentomino (higher is better):

Variant | Size | FPS | Browser 
--- | --- | --- | ---
Standard React  | 150/5px | 3.5 | Chrome 56.0.2924.87 (64-bit)
Mobx React      | 150/5px | 2.8 | Chrome 56.0.2924.87 (64-bit)
Immutable React | 150/5px | 4.7 | Chrome 56.0.2924.87 (64-bit)
Vue             | 150/5px | 1.5 | Chrome 56.0.2924.87 (64-bit)

Running on 50x50 gives much different results since constellation will be oscillating with few changes fast,
so I measured after 10s:

Variant | Size | FPS | Browser 
--- | --- | --- | ---
Standard React  | 50/15px | 41.4 | Chrome 56.0.2924.87 (64-bit)
Mobx React      | 50/15px | 54.0 | Chrome 56.0.2924.87 (64-bit)
Immutable React | 50/15px | 55.0 | Chrome 56.0.2924.87 (64-bit)
Vue             | 50/15px | 16   | Chrome 56.0.2924.87 (64-bit)

All production Versions of the different variants are available here, so you can check yourself:

http://mvmsoft.de/content/gameoflife/GameOfLife.html

Remarks
-------

MobX starts extremely slow, but speeds up heavily when life is sparse in the matrix. Since the "regular" data gets 
finally to a stable state with few mutations, MobX is by far faster than Standard React in this case.

Implementing with MobX was not as straight forward as it seemed, because there were rendering bugs
and pitfalls with notification order and the like. If anyone has optimization hints, I'll be glad you let me know.
But the code ist most clean of all, really wonderful to read !



Running
-------

- `npm run devserver`
- `open localhost:8080`
 
Tests and Linting
-----------------
- `npm run test`
- `npm run test:watch`
- `npm run tslint`

Links
-----
- https://www.typescriptlang.org/docs/handbook/react-&-webpack.html
- https://www.typescriptlang.org/docs/handbook/jsx.html
- https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript
- https://github.com/Microsoft/TypeScript/wiki/Roadmap
- https://github.com/typings/typings
