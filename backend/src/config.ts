import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  githubPersonalAccessToken: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
  githubRepoOwner: process.env.GITHUB_REPO_OWNER,
  githubRepoName: process.env.GITHUB_REPO_NAME,
  adminUsername: process.env.ADMIN_USERNAME || 'admin',
  adminPassword: process.env.ADMIN_PASSWORD || 'admin',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/arlebnispfadecms',
  commitPrefix: '[CMS]',
  currentRoutes: ['wiehl', 'wipperfuerth', 'strasse-der-arbeit'],
};

export default config;
