<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">

## Description

## Installation

```bash
$ npm install
```

## Running the app

```bash
# admin at id = 1, 10 users, and 10 products are added at startup

# create new user
curl -d '{"firstName":"rafael", "lastName":"arcieri", "email":"rafael2@email.com"}' -H "Content-Type: application/json" -X POST http://localhost:3000/v1/users

# create discount code
curl -d '{"code":"40_OFF_WNTER_DISCOUNT", "discountAmount":"40", "nthTransaction": "2"}' -H "Content-Type: application/json" -X POST http://localhost:3000/v1/discounts

# create order/purchase item, give discount to order total when appropriate, and give discount code to user when appropriate
curl -d '{"productId":1, "quantity":2, "userId":3, "discountCode":"40_OFF_WNTER_DISCOUNT"}' -H "Content-Type: application/json" -X POST http://localhost:3000/v1/orders/

```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
