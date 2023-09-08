# Weld coding challenge solution

## Introduction
This repository represents my solution to the coding challenge for Weld. The solution is implemented in NestJS and TypeScript.
This is my first time using NestJS and nodeJS frameworks in backend in general, so I hope I have understood the framework correctly.

### Explanations of the decisions made
- I decided to use NATS server for communication between services with the main reason being the asynchronous nature of communication between data streams and worker services.
Data streams is only interested in commanding (one might as well argue *informing*) to the worker service to start the data fetching process, but is not interested in waiting for any data in response.
While worker service output is more of an event nature, where any subscribers can consume the fetched data. If this was up to me, I would have designed both communications as events, but I decided to follow the given requirement. 
- As you can see I haven't implemented any data storage, keeping the data in memory, but in the real world scenario document based database would be a good choice for storing the data.
- I added basic testing scenarios for domain logic, but I didn't have time to add any proper integration tests.
- I would improve this by adding more strict contracts between service communication, to ensure data validation on both ends.

### How the service can be improved
- Better error handling and logging.
- Better test coverage. Due to time constraints only some domain flows are unit tested with Jest as more of an example.
- Supporting different users and authentication on the API and integration levels. 
- Transactions and Idempotency. These service are quite well atomically phased, but proper rollbacks, retrying and notifications on fetch failures would be a good addition.
- Introducing deployment phases and CI/CD for pushing the service to production and enable agile way of working. (Docker, Terraform, Kubernetes, Jenkins, DigitalOcean, etc.)


### Final words
This is my first time creating a backend service with nodeJS and Typescript and I really enjoyed working on this challenge.I hope you will like my solution despite it being far from ideal. I am looking forward to your feedback and hope to hear from you soon.