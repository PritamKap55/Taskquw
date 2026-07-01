import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { gradientLeafbtn, styles } from "./styles";

export default function ShareSheet() {
  return (
    <TouchableOpacity
      activeOpacity={0.1}
      onPress={() => console.log('Pressed!')}
      style={styles.buttonWrapper}
    >
      <LinearGradient
        colors={['#03870c', '#f4f806']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
        style={styles.leafBtn}
      >
        <Text style={styles.btnText}>Shared Sheet</Text>
      </LinearGradient>

      <LinearGradient {...gradientLeafbtn}
        style={styles.leafBtn}
      >
        <Text style={styles.btnText}>Click Me</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

