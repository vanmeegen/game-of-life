Game of Life Performance Measurement with React.js and MobX
===========================================================

Goals
-----

- measure react performance with different approaches to component updates using the Game of Life Game

Optimization Steps
------------------
- Dumb React: shouldComponentUpdate not used, everything is always rerendered
- Standard React: shouldComponentUpdate with shallowEqual, 
- Optimized Lists: break down big lists to speed up partial updates
- MobX: use MobX to do efficient Updates
- Immutable: use an immutable model for calculation



Results
-------

Browser: Chrome 56.0.2924.87 (64-bit)
System: Intel Core i5-3317U 1.7GHz running Windows 10

Variant | Size | FPS 
--|--:|--:
Dumb React | 150/5px | 1.3 

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
