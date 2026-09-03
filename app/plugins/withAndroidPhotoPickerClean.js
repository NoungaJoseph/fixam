const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withAndroidPhotoPickerClean(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults.manifest;

    if (!androidManifest.$) {
      androidManifest.$ = {};
    }
    if (!androidManifest.$['xmlns:tools']) {
      androidManifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    }

    const permissionsToRemove = [
      'android.permission.READ_MEDIA_IMAGES',
      'android.permission.READ_MEDIA_VIDEO',
      'android.permission.READ_MEDIA_AUDIO',
      'android.permission.READ_MEDIA_VISUAL_USER_SELECTED',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
    ];

    if (!Array.isArray(androidManifest['uses-permission'])) {
      androidManifest['uses-permission'] = [];
    }

    // Filter out any existing entries of these permissions
    androidManifest['uses-permission'] = androidManifest['uses-permission'].filter((perm) => {
      const name = perm?.$?.['android:name'];
      return !permissionsToRemove.includes(name);
    });

    // Add explicit tools:node="remove" for each to prevent transitive injection from dependencies
    permissionsToRemove.forEach((name) => {
      androidManifest['uses-permission'].push({
        $: {
          'android:name': name,
          'tools:node': 'remove',
        },
      });
    });

    return config;
  });
};
