import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// This is a simple component used for screens that are "Coming Soon"
const PlaceholderScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Feature Coming Soon!</Text>
      <Text style={styles.subtext}>We'll build this next.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    color: '#666',
  }
});

export default PlaceholderScreen;
