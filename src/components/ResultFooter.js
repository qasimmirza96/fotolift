import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ResultFooter = ({ 
  isDownloading, 
  onDownload, 
  onRepeat, 
  downloadText = 'Download',
  mode 
}) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity 
        style={[styles.downloadButton, isDownloading && styles.downloadButtonDisabled]} 
        onPress={onDownload}
        disabled={isDownloading}
      >
        {/* {isDownloading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Ionicons name="download-outline" size={20} color="#fff" />
        )} */}
        <Text style={styles.downloadButtonText}>
          {isDownloading ? 'Downloading...' : mode === 'folder' ? 'Download ZIP' : downloadText}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.repeatButton} onPress={onRepeat}>
        <Text style={styles.repeatButtonText}>Repeat Process</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    gap: 12,
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#663399',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  downloadButtonDisabled: {
    backgroundColor: '#9966cc',
    opacity: 0.7,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  repeatButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#663399',
  },
  repeatButtonText: {
    color: '#663399',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ResultFooter;
