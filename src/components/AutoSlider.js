import React, { useRef, useEffect } from 'react';
import { View, Image, StyleSheet, FlatList, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const AutoSlider = ({ images }) => {
  const flatListRef = useRef(null);
  const currentIndex = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (flatListRef.current && images.length > 0) {
        currentIndex.current = (currentIndex.current + 1) % images.length;
        flatListRef.current.scrollToIndex({
          index: currentIndex.current,
          animated: true,
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <FlatList
      ref={flatListRef}
      horizontal
      data={images}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      onScrollToIndexFailed={() => {}}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.uri }} style={styles.image} />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 20,
  },
  card: {
    width: 140,
    height: 180,
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default AutoSlider;
