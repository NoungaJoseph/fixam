import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../services/theme';

const ProviderCard = ({ provider, onPress, onCall, onChat }) => {
  return (
    <Card style={styles.card} onPress={onPress}>
      <View style={styles.container}>
        <Image source={{ uri: provider.image }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{provider.name}</Text>
          <Text style={styles.skill}>{provider.skill}</Text>
          <View style={styles.row}>
            <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{provider.rating}</Text>
            <Text style={styles.dot}> • </Text>
            <Text style={styles.distance}>{provider.distance}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={onChat} style={styles.iconButton}>
            <MaterialCommunityIcons name="message-text" size={24} color={COLORS.primary} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onCall} style={styles.iconButton}>
            <MaterialCommunityIcons name="phone" size={24} color={COLORS.accent} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    elevation: 3,
  },
  container: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.gray,
  },
  info: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  skill: {
    fontSize: 14,
    color: COLORS.placeholder,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  starIcon: {
    margin: 0,
    padding: 0,
    width: 16,
  },
  rating: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  dot: {
    color: COLORS.placeholder,
  },
  distance: {
    fontSize: 13,
    color: COLORS.placeholder,
  },
  actions: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 5,
  },
  icon: {
    padding: 5,
  },
});

export default ProviderCard;
