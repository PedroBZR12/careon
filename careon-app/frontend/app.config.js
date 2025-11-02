import 'dotenv/config';
import appJson from './app.json';

export default {
  expo: {
    ...appJson.expo,
    android:{
        ...appJson.expo.android,
        package: "com.vitalcode.careon",
        versionCode: 1,
        icon: "./src/assets/images/CareOn.png",
    },
    extra: {
        ...appJson.expo.extra,
        API_URL: process.env.API_URL,
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_KEY: process.env.SUPABASE_KEY,
        },
    },
};
