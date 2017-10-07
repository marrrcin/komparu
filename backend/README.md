# Komparu Backend
## How to run
1. Run ```composer install```
1. Run ```composer run start``` in root directory.
1. Api is available at ```http://localhost:8080/```

## Notes
1. No frameworks, this is vanilla php + composer
1. No http server needed for dev, composer run start script will use php -S 
server
1. No classes used, the code is writenn in functional paradigm, This is on
purpose, no point creating OO code for suche a simple task. Used functional
concepts: currying, higher order functions, functional purity (where possible).
1. Restful api, recognizes GET/POST/DELETE/PUT requests and responds with 
proper http response codes.
1. Simple, extensible and self documention. I'm using phpdoc comments and self
explaining function names. Because of the fairly high purity of the functions
this code would be quite easy to unit test.
1. Using Faker module to generate realistic fake data. Mostly because I'm lazy.
1. In bigger, better project we probably should use a framework Laravel,
Symfony, or Zend are the most likely options. In bigger project the api
documnetation and schema would be prefered to be done with Swagger.

## Api
1. This api is RESTFUL and returns JOSN.
1. ```GET /``` -> returns array of all products
1. ```GET /generate``` -> generates new set of fake data
1. ```DELETE /``` -> deletes all data
1. ```GET /product/ID``` -> (ID: int) returns one product
1. Product structure:
  ```
  {
    id: int
    name: string
    manufacturer: string
    price: float
    description: string
  }
  ```
1. ```DELETE /product/ID``` -> (ID: int) deletes product with ID.
