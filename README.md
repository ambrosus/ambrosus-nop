[![Build Status](https://travis-ci.com/ambrosus/ambrosus-nop.svg?token=3AeQ6aqcxJ7ZUnsz6KJt&branch=master)](https://travis-ci.com/ambrosus/ambrosus-nop)

# The Ambrosus Node Onboarding Package
Software package for assisting perspective node operators with the registration, onboarding and instalation of new nodes. 

## Running tests and linting

Install the dependencies
```sh
yarn install
```

Run the tests
```sh
yarn test
```

Run the linter:
```sh
yarn dev:lint
```

## Building an clean-up
Building consists of transpiling the source code. It is performed by running:
```sh
yarn build
```

## Running in development mode

Running in development mode (transpiled on the run with debugging enabled):
```sh
yarn dev:start
```

## Running in production mode

Build the whole suit:
```sh
yarn build
```

Start the script:
```sh
yarn start
```

## Contribution
We will accept contributions of good code that we can use from anyone.  
Please see [CONTRIBUTION.md](CONTRIBUTION.md)

Before you issue pull request:
* Make sure all tests pass.
* Make sure you have test coverage for any new features.
