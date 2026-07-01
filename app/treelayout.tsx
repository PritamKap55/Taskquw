import React from 'react';
import { Text, View } from 'react-native';
import { styles } from "./styles";

export default function ListLayout() {
  return (
    <View>
      <View style={[styles.headerLayout]}>
        <Text > tree layout </Text>
      </View>
      <View style={[styles.bodyLayout]}>
        <Text > tree layout </Text>
      </View>
      <View style={[styles.footerLayout]}>
        <Text >  tree layout </Text>
      </View>
    </View>
  );
}

