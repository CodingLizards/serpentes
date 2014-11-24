# Ticketmanager
The Ticketmanager is a very simple ticket system and also useful to prioritize tickets.

You can use it, fork it, improve it as much as you want. It is one of our first node.js projects, so we would appreciate help :)

# What are the features?
The Ticketmanager offers you a good amount of options here is a list with all the features, for details refer to our wiki please :)

## Worker management
Workers are your users and developer/testers/operation specialists as well, that gives you an easy way, to integrate your existing company structure in the Ticketmanager.

## Ticket management
You can filter your tickets by different states

 - active
 - free 
 - unprioritized
 - archived
 - not archived (free, active and unprioritized combined)

For the ticket management, there are plenty features, which make it easy to track where tickets come from. You can seperate them by...

### ...departments
Departments are your company internal departments, you can track where most of the tickets come from, to see if there is anything you need to improve with the department or software which they use.

### ...applications
Applications would translate to the applications that you have in your company. With this feature, it is possible to track, which application is the most erroneous applications and then plan e.g. a refactoring by that.

### ...clients
Clients can be your real clients or your cost centres, it is up to you. What ever you choose, it gives you the option to check where most tickets come from and which client is the one with the most needs.

### ...releases
Releases give you the possibility to sort your tickets by release. So you can see, which tickets go in which release and based on that you can write your release notes.

## Customization
You can easily change the colours to match your own CI. For that we have an extra section in the settings part.

## Localization
With the Ticketmanager it is super easy, to add new languages. You just need to translate the file `languages/default.json` to lets say, russian and your russian employees can use the software in their native language.

## Windows authentication
With the help of [edge.js](https://github.com/tjanczuk/edge) it is possible to use Windows authentication for your employees. This makes the work for people easy, cause they don't need to remember a new password.

# What is ready, what is in planning?
- [ ] Ticket management
    - [ ] Assign tickets to users
- [x] Worker management
    - [ ] Filter tickets by worker
- [x] Department management
    - [ ] Filter tickets by departments
- [x] Application management
    - [ ] Filter tickets by applications
- [x] Client management
    - [ ] Filter tickets by clients
- [x] Release management
    - [ ] Filter tickets by releases
- [x] Customization
- [ ] Localization
- [x] Windows authentication

# What do we need?
- [ ] It would be great, if someone could improve the file [databaseSetup.js](https://github.com/CodingLizards/ticketmanager/blob/develop/Ticketmanager/persistence/databaseSetup.js). Mostly the `reduce` functions are horrible messy but it is hard to clean them up (very little experience)

- [ ] Someone who could translate the `languages/default.json` file would be great, together we just speak German and English :)

# Licence
The MIT License (MIT)

Copyright (c) 2014 Coding Lizards - Imanuel Ulbricht und Reemt Rühmkorf GbR

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
