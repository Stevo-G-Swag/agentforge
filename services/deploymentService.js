const axios = require('axios');
const { execSync } = require('child_process');

async function deployToHeroku(appName) {
  const herokuApiToken = process.env.HEROKU_API_TOKEN;
  const herokuApiUrl = 'https://api.heroku.com';

  if (!herokuApiToken) {
    console.error('HEROKU_API_TOKEN is not set in the environment variables');
    throw new Error('HEROKU_API_TOKEN is not set in the environment variables');
  }

  try {
    // Check if the app exists, create if it doesn't
    try {
      await axios.get(`${herokuApiUrl}/apps/${appName}`, {
        headers: {
          'Authorization': `Bearer ${herokuApiToken}`,
          'Accept': 'application/vnd.heroku+json; version=3'
        }
      });
      console.log(`App ${appName} already exists on Heroku.`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log(`Creating app ${appName} on Heroku...`);
        await axios.post(`${herokuApiUrl}/apps`, { name: appName }, {
          headers: {
            'Authorization': `Bearer ${herokuApiToken}`,
            'Accept': 'application/vnd.heroku+json; version=3',
            'Content-Type': 'application/json'
          }
        });
        console.log(`App ${appName} created successfully.`);
      } else {
        console.error('Error checking app existence:', error.message);
        console.error(error.stack);
        throw error;
      }
    }

    // Deploy using Git
    console.log('Deploying to Heroku...');
    execSync('git init', { stdio: 'inherit' });
    execSync(`heroku git:remote -a ${appName}`, { stdio: 'inherit' });
    execSync('git add .', { stdio: 'inherit' });
    execSync('git commit -am "Deploy to Heroku"', { stdio: 'inherit' });
    execSync('git push heroku master --force', { stdio: 'inherit' });

    console.log('Deployment successful!');
    return { success: true, message: `Deployed to https://${appName}.herokuapp.com` };
  } catch (error) {
    console.error('Deployment error:', error.message);
    console.error(error.stack);
    throw error;
  }
}

module.exports = {
  deployToHeroku
};