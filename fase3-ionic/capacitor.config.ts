import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'CitasMedicasApp',
  webDir: 'www',

  server: {
    androidScheme: 'http',
    cleartext: true
  },

  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;