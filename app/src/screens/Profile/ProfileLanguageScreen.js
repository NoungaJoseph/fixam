import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

const ProfileLanguageScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const { changeLanguage, t, language } = useLanguage();

  const handleSelectLanguage = (lang) => {
    changeLanguage(lang);
    navigation.goBack();
  };

  const LangOption = ({ langCode, label }) => {
    const isSelected = language === langCode;
    return (
      <TouchableOpacity 
        style={[styles.langCard, { borderBottomColor: colors.border }]}
        onPress={() => handleSelectLanguage(langCode)}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons name="translate" size={24} color={colors.primary} />
          </View>
          <Text style={[styles.langText, { color: colors.text }]}>{label}</Text>
        </View>
        {isSelected && <MaterialCommunityIcons name="check-circle" size={24} color={colors.primary} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />
      
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialCommunityIcons name="chevron-left" size={28} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Language</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          <Text style={[styles.sectionDesc, { color: colors.textSecondary }]}>
            Select your preferred language for the application interface.
          </Text>

          <LangOption langCode="en" label="English" />
          <LangOption langCode="fr" label="Français" />
          
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20,
  },
  backBtn: { width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  sectionDesc: { fontSize: 14, marginBottom: 30, lineHeight: 22 },
  langCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 17, borderBottomWidth: 1,
  },
  iconWrap: { width: 34, height: 34, justifyContent: 'center', alignItems: 'flex-start', marginRight: 12 },
  langText: { fontSize: 16, fontWeight: '700' },
});

export default ProfileLanguageScreen;
