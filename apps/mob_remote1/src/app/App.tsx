import React from 'react';
import { View, Text } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>This is a federated screen from mob_remote1 Keep the entry point of this  as index.ts </Text>


      <Text>this in index.ts AppRegistry.registerComponent('MobRemote1', () return App)

      and in rspack.config.mjs have  const config = curly brace open "entry":colon ... curly brace close

      that way HMR works out of the box and you don't get any strange type errors!!!

      And now using repack 5.1.1</Text>

    </View>
  );
}
