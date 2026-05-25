import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, StatusBar, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');
const FIXAM_LETTERS = ['F', 'i', 'x', 'a', 'm'];

const AnimatedSplashScreen = ({ navigation, onFinish }) => {
  const { colors, isDarkMode } = useTheme();
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

    const sequence = onFinish
      ? Animated.loop(Animated.sequence([logoAnim, Animated.delay(200), lettersAnim, Animated.delay(1200)]))
      : Animated.sequence([logoAnim, Animated.delay(200), lettersAnim, Animated.delay(1000), exitAnim]);

    sequence.start(() => {
      if (!onFinish) navigation.replace('LanguageSelection');
    });

    return () => sequence.stop?.();
  }, [navigation, logoOpacity, logoScale, letterAnimations, containerOpacity, containerScale]);

  return (
    <LinearGradient colors={['#0D9488', '#14B8A6', '#2563EB']} style={styles.main}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <Animated.View style={[styles.container, { opacity: containerOpacity, transform: [{ scale: containerScale }] }]}>
        
        {/* Logo */}
        <Animated.View style={[styles.logoHalo, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
          <Animated.Image
            source={require('../../../assets/fixam.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

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
                    color: '#FFFFFF',
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
  main: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoHalo: {
    width: width * 0.48,
    height: width * 0.48,
    borderRadius: width * 0.24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.35,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 0 },
    elevation: 18,
    marginBottom: 22,
  },
  logo: {
    width: width * 0.45,
    height: width * 0.45,
  },
  textContainer: {
    flexDirection: 'row',
  },
  letter: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 0,
  },
});

export default AnimatedSplashScreen;
