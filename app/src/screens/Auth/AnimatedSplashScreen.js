import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, StatusBar, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const FIXAM_LETTERS = ['F', 'i', 'x', 'a', 'm'];

const AnimatedSplashScreen = ({ navigation }) => {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  
  // Array of animated values for each letter
  const letterAnimations = useRef(FIXAM_LETTERS.map(() => new Animated.Value(0))).current;
  
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const containerScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Logo pop in
    const logoAnim = Animated.parallel([
      Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }),
    ]);

    // 2. Letters stagger in
    const lettersAnim = Animated.stagger(150, letterAnimations.map(anim => 
      Animated.parallel([
        Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.spring(anim, { toValue: 1, friction: 5, tension: 50, useNativeDriver: true })
      ])
    ));

    // 3. Fade out everything
    const exitAnim = Animated.parallel([
      Animated.timing(containerOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
      Animated.timing(containerScale, { toValue: 1.2, duration: 400, useNativeDriver: true }),
    ]);

    Animated.sequence([
      logoAnim,
      Animated.delay(200),
      lettersAnim,
      Animated.delay(1000), // Hold so user can read it
      exitAnim
    ]).start(() => {
      navigation.replace('LanguageSelection');
    });
  }, [navigation, logoOpacity, logoScale, letterAnimations, containerOpacity, containerScale]);

  return (
    <LinearGradient
      colors={['#1e3a8a', '#312e81', '#0A0F2C']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
      <Animated.View style={[styles.container, { opacity: containerOpacity, transform: [{ scale: containerScale }] }]}>
        
        {/* Logo */}
        <Animated.Image
          source={require('../../../assets/fixam.png')}
          style={[styles.logo, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}
          resizeMode="contain"
        />

        {/* Animated Text */}
        <View style={styles.textContainer}>
          {FIXAM_LETTERS.map((char, index) => {
            const anim = letterAnimations[index];
            const translateY = anim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0] // slide up
            });

            return (
              <Animated.Text
                key={index}
                style={[
                  styles.letter,
                  {
                    opacity: anim,
                    transform: [{ translateY }]
                  }
                ]}
              >
                {char}
              </Animated.Text>
            );
          })}
        </View>

      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.45,
    height: width * 0.45,
    marginBottom: 20,
  },
  textContainer: {
    flexDirection: 'row',
  },
  letter: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
});

export default AnimatedSplashScreen;
