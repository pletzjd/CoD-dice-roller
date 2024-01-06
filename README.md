# Chronicles of Darkness Dice Roller

## Description

This site was built at the request of the owner of [Eternal Noire](https://eternalnoire.com/) as a replacement for the site they were using at the time as it was missing features they desired:

- Advanced action option for rolls
- The ability to do a Chance Die roll
- Roll history going back further than the last 25 rolls

Along with maintaining features from the old dice roller: 

- Normal rolls
- Initiative rolls
- Linking to a specific roll
- 10-Again, 9-Again, 8-again or no exploding dice
- Rote Action (reroll fails of initial dice once)
- Use Willpower (add three dice to roll)
- Visual indicators for success, dice rerolled from exploding dice and dice rerolled from rote action

## Live Deployment link

The live deployment of the site can be found at: https://wod-dice-roller.onrender.com/

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)

## Installation

A copy of the code can be obtained by doing a pull request from the github repository above. Once a copy is on your machine create a .env file in the root directory of the project and set values for DB_NAME (to name the mySQL database), DB_USER to your mySQL username and DB_PASSWORD to you mySQL password. Then open the command line interface in the root directory of the project type in 'npm install' to install all the required packages. Then type npm start to start the server. Open a browser and go to http://localhost:3001 or click the link the console to access the page.

## Usage

The roll form is at the top of the page with fields for name, a description of the action being rolled for and the number of dice to be rolled. For a normal roll there are also options for exploding dice (grants extra rolls on a result of the number specified or higher) as well well options to modified the roll to be a rote action (reroll if one of the initial dice is a result of 7 or less), advanced action (roll twice and choose the result) and/or wether a point of willpower was spent to enhance the roll (adds 3 to the dice pool).

At the bottom of the roll form are buttons to do a normal roll (success on 8,9 and 10), roll a chance die (1 die, success on 10, dramatic failure on 1) or to do an initiative roll (1 die, successes not applicable)

Below the roll form is the roll history table displaying a timestamp of when the roll was done (which can be clicked to display only that roll in the table), the player who rolled, the description they gave, their dice pool (after willpower is applied if applicable), what type of exploding dice/modifies/type, the result of the roll (with visual indications of successes and rerolls) and a count of the number of successes if applicable. Above the table beside the roll form details the significance of the color/text decorations of the numbers in the roll.

Below the table are navigation buttons to view rolls older than the last 25 rolls, with 25 rolls being displayed per page. A cron job is implimented to delete rolls older than 6 months to as the information should no longer be needed after that and to prevent the database from exeding the size limit of the free database offered by [planetscale](https://planetscale.com/).

## Credits

Site developper(s):
- Jordan Pletzer: https://github.com/pletzjd

## License

MIT License

Copyright (c) 2023 Jordan Pletzer

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
