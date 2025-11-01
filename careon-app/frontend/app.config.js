import 'dotenv/config';

export default {
  expo: {
    name: "frontend",
    slug: "frontend",
    version: "1.0.0",
    extra: {
      API_URL: process.env.API_URL,
      eas: {
        projectId: "281c93ea-f032-4f40-a598-66e1cef3e3ab",
      },
    },
  },
};
