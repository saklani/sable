import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Text, Card, FAB, useTheme, Searchbar, IconButton, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { AudioItem } from '../../src/types';
import { useAudioStore } from '../../src/store';
import { api } from '../../src/services/api';
import { CreateAudioDialog } from '../../src/components/CreateAudioDialog';
import { LoadingSpinner } from '../../src/components/LoadingSpinner';
import { ErrorMessage } from '../../src/components/ErrorMessage';
import { EmptyState } from '../../src/components/EmptyState';
import { AudioPlayer } from '../../src/components/AudioPlayer';

const ITEMS_PER_PAGE = 10;

export default function HomeScreen() {
  const [dialogVisible, setDialogVisible] = useState(false);
  const theme = useTheme();
  const router = useRouter();
  const { items, isLoading, error, setItems, addItem, setLoading, setError } = useAudioStore();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState<AudioItem | null>(null);

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const loadAudioItems = async (pageNum: number = 1, shouldAppend: boolean = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);
      
      const audioItems = await api.listAudio({
        page: pageNum,
        limit: ITEMS_PER_PAGE,
      });
      
      if (shouldAppend) {
        setItems([...items, ...audioItems]);
      } else {
        setItems(audioItems);
      }
      
      setHasMore(audioItems.length === ITEMS_PER_PAGE);
    } catch (error: any) {
      setError(error.message || 'Failed to load audio items');
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    loadAudioItems();
  }, []);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadAudioItems(nextPage, true);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    loadAudioItems(1);
  };

  const handleCreateAudio = async (type: 'file' | 'text', data: string) => {
    try {
      setLoading(true);
      setError(null);
      const newItem = await api.generateAudio(type, data);
      addItem(newItem);
      setDialogVisible(false);
    } catch (error: any) {
      setError(error.message || 'Failed to create audio');
    } finally {
      setLoading(false);
    }
  };

  const handleItemPress = (item: AudioItem) => {
    router.push(`/audio/${item.id}`);
  };

  const handlePlayPress = (item: AudioItem) => {
    setCurrentPlayer(item);
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  };

  if (isLoading && items.length === 0) {
    return <LoadingSpinner message="Loading your audio library..." />;
  }

  if (error && items.length === 0) {
    return <ErrorMessage message={error} onRetry={loadAudioItems} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search audio items"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <TouchableOpacity
                  style={styles.cardContent}
                  onPress={() => handleItemPress(item)}
                >
                  <Text variant="titleMedium">{item.title}</Text>
                  <Text variant="bodyMedium" style={{ color: theme.colors.secondary }}>
                    {item.type === 'text' ? 'Text to Speech' : 'Audio File'}
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                    Created: {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
                {item.type === 'file' && (
                  <IconButton
                    icon="play"
                    size={24}
                    onPress={() => handlePlayPress(item)}
                  />
                )}
              </View>
            </Card.Content>
          </Card>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title="No Audio Items"
            message="Tap the + button to create your first audio"
            actionLabel="Create Audio"
            onAction={() => setDialogVisible(true)}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
      />
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => setDialogVisible(true)}
        loading={isLoading}
        disabled={isLoading}
      />
      <CreateAudioDialog
        visible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        onSubmit={handleCreateAudio}
      />
      {currentPlayer && (
        <AudioPlayer
          item={currentPlayer}
          onClose={() => setCurrentPlayer(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchBar: {
    marginBottom: 8,
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
}); 