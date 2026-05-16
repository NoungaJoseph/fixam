import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, FlatList,
  StatusBar, SafeAreaView, Image, TextInput, Platform, ActivityIndicator, Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';

const chatCacheKey = (userId) => `fixam:chat-conversations:${userId || 'guest'}`;

const ChatListScreen = ({ navigation }) => {
  const { isDarkMode, colors } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'unread'

  const { on } = useSocket();

  const persistCache = useCallback(async (list) => {
    if (!user?.id || !Array.isArray(list)) return;
    try {
      await AsyncStorage.setItem(chatCacheKey(user.id), JSON.stringify({ savedAt: Date.now(), list }));
    } catch (e) {
      console.log('Chat cache write failed:', e.message);
    }
  }, [user?.id]);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await api.get('/chat/conversations', { timeout: 12000 });
      const list = res.data.data || [];
      setConversations(list);
      persistCache(list);
    } catch (error) {
      console.log('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  }, [persistCache]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (user?.id) {
        try {
          const raw = await AsyncStorage.getItem(chatCacheKey(user.id));
          if (!cancelled && raw) {
            const parsed = JSON.parse(raw);
            if (parsed?.list?.length) {
              setConversations(parsed.list);
              setLoading(false);
            }
          }
        } catch (_) {
          /* ignore */
        }
      }
      if (!cancelled) fetchConversations();
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchConversations, user?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchConversations();
    }, [fetchConversations])
  );

  useEffect(() => {
    const offNewMessage = on('message:new', () => {
      fetchConversations();
    });
    return () => {
      offNewMessage?.();
    };
  }, [fetchConversations, on]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = conversations;
    if (filterMode === 'unread') {
      list = list.filter((c) => (c.unreadCount || 0) > 0);
    }
    if (!q) return list;
    return list.filter((c) => {
      const otherUser = c.participants?.[0];
      const name = (otherUser?.fullName || '').toLowerCase();
      const last = (c.lastMessage?.content || '').toLowerCase();
      return name.includes(q) || last.includes(q);
    });
  }, [conversations, search, filterMode]);

  const openNewChatFlow = () => {
    const parent = navigation.getParent?.();
    if (parent) {
      parent.navigate('Home', { screen: 'HomeMain' });
    }
  };

  const renderItem = ({ item }) => {
    const otherUser = item.participants?.[0] || {};
    return (
      <TouchableOpacity
        style={[styles.chatCard, { borderBottomColor: colors.border }]}
        onPress={() =>
          navigation.navigate('Chat', {
            conversationId: item.id,
            userName: otherUser.fullName,
            receiverId: otherUser.id,
            avatar: otherUser.avatar,
            task: item.activeTask || item.task || item.job || item.acceptedJob || item.activeJob,
          })
        }
      >
        <View style={styles.avatarWrap}>
          {otherUser.avatar ? (
            <Image source={{ uri: otherUser.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: colors.border + '88', justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ color: colors.text, fontWeight: '800', fontSize: 18 }}>
                {otherUser.fullName?.charAt(0) || '?'}
              </Text>
            </View>
          )}
          {otherUser.isOnline ? <View style={styles.onlineBadge} /> : null}
        </View>
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={[styles.userName, { color: colors.text }]}>{otherUser.fullName || 'Fixam User'}</Text>
            <Text style={[styles.timeText, { color: colors.textSecondary }]}>
              {item.lastMessage ? new Date(item.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            </Text>
          </View>
          <View style={styles.chatFooter}>
            <Text style={[styles.lastMsg, { color: colors.textSecondary }]} numberOfLines={1}>
              {item.lastMessage?.content || 'No messages yet'}
            </Text>
            {item.unreadCount > 0 ? (
              <View style={[styles.unreadBadge, { backgroundColor: colors.text }]}>
                <Text style={[styles.unreadText, { color: colors.background }]}>{item.unreadCount}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const outlineBtn = {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: isDarkMode ? '#181818' : '#FFF',
  };

  return (
    <View style={[styles.background, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t('messages.title')}</Text>
          <TouchableOpacity style={[styles.headerIconBtn, outlineBtn]} onPress={openNewChatFlow} accessibilityLabel={t('messages.title')}>
            <MaterialCommunityIcons name="plus" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchRow}>
          <View style={[styles.searchBar, { backgroundColor: isDarkMode ? '#171717' : '#F5F5F5', borderWidth: 1, borderColor: colors.border }]}>
            <MaterialCommunityIcons name="magnify" size={20} color={colors.placeholder} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder={t('messages.search')}
              placeholderTextColor={colors.placeholder}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity style={[styles.headerIconBtn, outlineBtn]} onPress={() => setFilterOpen(true)} accessibilityLabel="Filter chats">
            <MaterialCommunityIcons name="tune-variant" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        {loading && conversations.length === 0 ? (
          <ActivityIndicator size="large" color={colors.textSecondary} style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={filtered}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            initialNumToRender={18}
            windowSize={12}
            removeClippedSubviews={Platform.OS === 'android'}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="message-text-outline" size={70} color={colors.border} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>{t('messages.emptyTitle')}</Text>
                <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>{t('messages.emptyDesc')}</Text>
              </View>
            }
          />
        )}
      </SafeAreaView>

      <Modal visible={filterOpen} transparent animationType="fade" onRequestClose={() => setFilterOpen(false)}>
        <TouchableOpacity style={styles.filterBackdrop} activeOpacity={1} onPress={() => setFilterOpen(false)}>
          <View style={[styles.filterCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.filterTitle, { color: colors.text }]}>Show chats</Text>
            {[
              ['all', 'All chats'],
              ['unread', 'Unread only'],
            ].map(([key, label]) => (
              <TouchableOpacity
                key={key}
                style={[styles.filterRow, { borderBottomColor: colors.border }]}
                onPress={() => {
                  setFilterMode(key);
                  setFilterOpen(false);
                }}
              >
                <Text style={[styles.filterRowText, { color: colors.text }]}>{label}</Text>
                {filterMode === key ? <MaterialCommunityIcons name="check" size={22} color={colors.text} /> : null}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 20) + 18 : 18, paddingBottom: 14 },
  headerTitle: { fontSize: 40, fontWeight: '900' },
  headerIconBtn: { width: 44, height: 44, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 22, marginBottom: 12 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, height: 48, borderRadius: 4 },
  searchInput: { flex: 1, fontSize: 17, fontWeight: '500' },
  listContent: { paddingLeft: 22, paddingTop: 8 },
  chatCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingRight: 22, borderBottomWidth: 1 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 64, height: 64, borderRadius: 32 },
  onlineBadge: { position: 'absolute', right: -2, bottom: -2, width: 14, height: 14, borderRadius: 7, backgroundColor: '#22C55E', borderWidth: 2, borderColor: '#FFF' },
  chatInfo: { flex: 1, marginLeft: 16 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  userName: { fontSize: 17, fontWeight: '900' },
  timeText: { fontSize: 13, fontWeight: '600' },
  chatFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lastMsg: { fontSize: 15, flex: 1, marginRight: 10 },
  unreadBadge: { minWidth: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6 },
  unreadText: { fontSize: 11, fontWeight: '800' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginTop: 20 },
  emptyDesc: { fontSize: 14, textAlign: 'center', marginTop: 10, paddingHorizontal: 40 },
  filterBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-start', paddingTop: Platform.OS === 'android' ? 120 : 140, paddingHorizontal: 24 },
  filterCard: { borderRadius: 4, borderWidth: 1, overflow: 'hidden' },
  filterTitle: { fontSize: 13, fontWeight: '900', textTransform: 'uppercase', paddingHorizontal: 16, paddingVertical: 14 },
  filterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16, borderTopWidth: 1 },
  filterRowText: { fontSize: 16, fontWeight: '700' },
});

export default ChatListScreen;
