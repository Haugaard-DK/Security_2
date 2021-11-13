# Course Assignment 3

[![Build Status](https://travis-ci.com/Haugaard-DK/Eksamen-Backend.svg?branch=master)](https://travis-ci.com/Haugaard-DK/Eksamen-Backend) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Backend

This is a school project for [Computer Science AP](https://www.cphbusiness.dk/uddannelser/erhvervsakademiuddannelser/datamatiker) students in the 3rd semester at [Copenhagen Business Academy](https://www.cphbusiness.dk/).

Are you interested in the project description? Then you can find it [here](https://docs.google.com/document/d/1M2g9MQRqjDn2CSDuFLAzdOjWCbAH8oe7au3AW_04LrA/edit#).

## Frontend

Are you interested in the frontend for this project? Then you can find it [here](https://github.com/nicklasanielsen/CA3-Frontend/).

# Documentation

To see all the documentation about a specific endpoint, access the documentation by clicking the link next to the endpoint in question.

## Open Endpoints

Open endpoints require no Authentication.

* [Login](docs/auth/login.md) : `POST /api/auth/login/`
* [Register](docs/auth/register.md) : `POST / api/auth/register/`

## Closed Endpoints

Closed endpoints require a valid Token to be included in the header of the request. A Token can be acquired from the open endpoints above.

The token must be provided under header-key `x-access-token`.

### User related

* [Get all users](docs/info/allUsers.md) : `GET /api/info/allUsers/`
* [Get info about user by username](docs/info/infoByUsername.md) : `GET /api/info/user/{username}/`

### Joke related

* [Get random jokes](docs/fun/jokes.md) : `GET /api/fun/jokes/`

# Collaborators

* Mathias Haugaard Nielsen also known as [Haugaard-DK](https://github.com/Haugaard-DK).
* Nicklas Alexander Nielsen also known as [nicklasanielsen](https://github.com/nicklasanielsen).
* Nikolaj Larsen also known as [Nearial](https://github.com/Nearial).

# License

This project is covered by the MIT license, see [LICENSE](https://github.com/nicklasanielsen/CA3-Backend/blob/master/LICENSE) for more information.