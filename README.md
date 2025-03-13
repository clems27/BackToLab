#BackToLab

# MC Recipe Swap Application

## Project Overview

The Recipe Swap App is a social platform designed to connect food enthusiasts worldwide by allowing users to share, discover, and exchange recipes. The app fosters a community-driven experience where users can upload their favorite recipes, explore diverse cuisines, and interact with other home cooks and professional chefs.

## Key Features

### User Registration & Profiles
- Sign up via email, Google, or social media.
- Create a customizable profile with bio, dietary preferences, and saved recipes.

### Recipe Upload & Management
- Add new recipes with photos, ingredients, and step-by-step instructions.
- Categorize recipes by cuisine, dietary restrictions, and meal type.
- Edit and delete personal recipes.

### Recipe Discovery & Search
- Search for recipes by ingredients, cuisine, or dietary needs.
- Browse trending and most-liked recipes.
- Use AI-powered recommendations based on user preferences.

### Recipe Swap Feature
- Users can request swaps with others to exchange exclusive or family recipes.
- Private recipe sharing with select users.

### Community & Social Features
- Follow other users and see their latest recipe uploads.
- Like, comment, and share recipes.
- Join groups or forums based on dietary interests or cuisine types.

### Shopping List & Meal Planner
- Generate shopping lists based on selected recipes.
- Plan weekly meals and track nutritional information.

### Privacy & Security
- Users control visibility of shared recipes.
- Secure data storage and GDPR-compliant privacy settings.

## Target Audience
- Home cooks and food enthusiasts
- Professional chefs looking to share expertise
- Individuals with dietary restrictions seeking meal inspiration
- Culinary students and recipe developers

## Technology Stack
- **Frontend:** React.js
- **Backend:** Node.js with Express.js
- **Database:** MySQL

## Development Roadmap
- **Agile** development methodology

## Conclusion
The Recipe Swap Application aims to revolutionize how people discover and share recipes by creating an engaging, interactive, and user-friendly platform. With an intuitive design and strong community features, the app has the potential to become a go-to destination for food lovers.


# Getting Started

### Prerequisites
To run the project locally, ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker desktop](https://docs.docker.com/desktop/setup/install/windows-install/)

#### Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.
#### Open [http://localhost:8081](http://localhost:8081) in your browser to visit phphMyAdmin.

### Installation
Clone the repository and install dependencies:
```sh
git clone https://github.com/clems27/BacktoLab
cd BacktoLab
git pull origin main
npm install  # or yarn install
npm install pug
docker-compose up
```

### Running the Application
```sh
npm start  # or yarn start
```

## Contributing
We welcome contributions! By participating in this project, You agree to abide Our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it carefully before start.


To contribute:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Open a Pull Request

## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Contact
For any questions or suggestions, feel free to open an issue or contact us at [backtolab@yahoo.com](mailto:backtolab@yahoo.com).

## Whats provided in these scaffolding files?

  * A docker setup which will provide you with node.js, mysql and phpmyadmin, including the configuration needed so that both node.js AND phpmyadmin can 'see' and connect to your mysql database.  If you don't use docker you'll have to set up and connect each of these components separately.
  * A basic starting file structure for a node.js app.
  * A package.json file that will pull in the node.js libraries required and start your app as needed.
  * A db.js file which provides all the code needed to connect to the mysql database, using the credentials in the .env file, and which provides a query() function that can send queries to the database and receive a result.  In order to use this (ie. interact with the database, you simply need to include this file in any file you create that needs this database interaction) with the following code:

```const db = require('./services/db');
```

____

Useful commands:

Get a shell in any of the containers

```bash
docker exec -it <container name> bash -l
```

Once in the database container, you can get a MySQL CLI in the usual way

```bash
mysql -uroot -p<password> 
```
