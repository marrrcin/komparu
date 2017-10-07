# Komparu Frontend
## How to run
1. Run ```npm install```
1. Run ```npm run start``` in root directory.
1. App is available at ```http://localhost:8000/```

## Build for smaller size
1. Run ```npm build```
1. Production application is in ```./build``` directory

## Notes
1. This project does not use any libraries or frameworks
1. I use NPM only to use Webpack and Babel for packaging and ES7 support
1. This Project is haveily inspired by React+Redux libraries, I have written
  my own little version of those concepts.
1. Major caveats: although my micro-framework is very capable it has some
  problems. Those are due to lack of time to implement them properly.
  1. Rendering replaces entire dom tree. I do not have time to implement smart
    dom caching and updating, however if taken further that would be an obvious
    next step.
  1. Since one of the requirements for the projects was to use native
    javascript I have not used JSX transformation preset in Babel. But I did
    create my own convenience function element() (in file render.js) that
    basically does a very similar thing to what JSX does under the hood.
1. This code-base is almost compeletly pure functional. There was not enough
  time for to create my own full functional composition library (monads,
  functors, etc). If I could use third part libraries I would write this
  project with full funtional composition.
1. No tests, again, because of no libraries rule. I also consumed to much time
  implementing my micro-framework, so I couldn't implement my own testing lib.
  In real life in production you would want to have many unit and system and
  behavioural tests for such a system.
1. Redux-like store impementation:
  1. Created a system of middlewares.
  1. Created several reducers including leaf and higher order reducers.
  1. Created my own thunk middleware for my store.
1. React-like components implementation:
  1. Created utility function for creating render objects.
  1. Created rendering system for rendering the render objects into dom.
  1. Created several pure functional components
