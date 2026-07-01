import React from 'react';
import { Text, View } from 'react-native';
import { styles } from "./styles";

export default function ListLayout() {
  return (
    <View>
      <View style={[styles.headerLayout]}>
        <Text > tablelay out </Text>
      </View>
      <View style={[styles.bodyLayout]}>
        <Text > tablelay out </Text>
      </View>
      <View style={[styles.footerLayout]}>
        <Text > table layout </Text>
      </View>
    </View>
  );
}

