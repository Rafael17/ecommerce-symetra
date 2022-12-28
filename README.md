# E-Commerce

## Installation

```bash
$ docker-compose up
```

On startup:

- admin will be created with id = 1
- 10 users will be created
- 10 product will be created

## Running the app

http://localhost:3000 to see the swagger documentation and make API calls

http://localhost:3000/v1/users/1/dashboard to see the admin dashboard

http://localhost:3000/v1/users/2/dashboard to see a users dashboard

Or run the following example curl commands

```bash
# create new user
curl -d '{"firstName":"tester", "lastName":"testerLast", "email":"rafael@gmail.com"}' -H "Content-Type: application/json" -X POST http://localhost:3000/v1/users

# create discount code
curl -d '{"code":"40_OFF_WNTER_DISCOUNT", "amount":"40", "nthTransaction": "2"}' -H "Content-Type: application/json" -X POST http://localhost:3000/v1/discounts

# create order/purchase item, give discount to order total when appropriate, and give discount code to user when appropriate
curl -d '{"productId":1, "quantity":2, "userId":3, "discountCode":"40_OFF_WNTER_DISCOUNT"}' -H "Content-Type: application/json" -X POST http://localhost:3000/v1/orders/

```

## Assumptions

Given the intentionally vague requirements the following assumptions where made:

- Does the discount code work 1 time, infinite times, or by expiration date when making a purchase?

  - infinite times

- Does the discount code work for any user or only to the given users?

  - Only to the user given the discount

- What happens when admin adds a new discount code?
  - Old discounts code keep working until deleted
  - Only the latest discount code is given out to user at nth transaction
