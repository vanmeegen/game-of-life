Game of Life Performance Measurement with React.js and MobX
===========================================================

Goals
-----

- measure react performance with different approaches to component updates using the Game of Life Game

Optimization Steps
------------------
- Dumb React: shouldComponentUpdate not used, everything is always rerendered
- Standard React: shouldComponentUpdate with standard equal as needed, 
- MobX: use MobX to do efficient Updates
- Immutable: use an immutable model for calculation



Results
-------

System: Intel Core i5-3317U 1.7GHz running Windows 10
Started with Random seed, wait for fps shown after 1 minute.

Variant | Size | FPS | Browser 
-- | --: | --:
Dumb React      | 150/5px | 0.3 | Edge 38.14393.0.0
Dumb React      | 150/5px | 0.4 | IE 11 1.576.14393.0 Update 11.0.38
Dumb React      | 150/5px | 0.7 | Firefox 51.0.1 (64-Bit)
Dumb React      | 150/5px | 1.3 | Chrome 56.0.2924.87 (64-bit)
Standard React  | 150/5px | 3.5 | Chrome 56.0.2924.87 (64-bit)

Standard React Implementation varies dependent on random data.
Thus measurements are now done with "regular" data.

MobX starts extremely slow, but speeds up heavily when life is sparse in the matrix. Since the "regular" data gets 
finally to a stable state with few mutations, MobX is by far faster than Standard React in this case.

Implementing with MobX was not as straight forward as it seemed, because there were rendering bugs
and pitfalls with notification order and the like. If anyone has optimization hints, I'll be glad you let me know.

Variant | Size | FPS | Browser 
-- | --: | --:
Standard React  | 150/5px | 5.7 | Chrome 56.0.2924.87 (64-bit)
Standard React  | 150/5px | 4.3 | Firefox 51.0.1 (64-Bit)
Standard React      | 150/5px | 1.9 | Edge 38.14393.0.0
Mobx React  | 150/5px | 18.4 | Chrome 56.0.2924.87 (64-bit)



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
