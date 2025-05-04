App.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

// ============ Core System ============
class HamoodCore {
  constructor() {
    this.validCode = "0101101110";
    this.validSeal = "Dahloos | Hamood Al-Azmi | Honesty = Activation";
    this.kernelStatus = "Dormant";
    this.quantumKey = this.generateQuantumKey();
    this.blockchain = new HamoodBlockchain();
  }

  generateQuantumKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  async verifyUser(user, intention) {
    if (!this.analyzeIntention(intention).valid) {
      return { status: "IntentDrift", message: "⚠️ Invalid intention detected." };
    }

    if (user.toLowerCase() !== "hamood") {
      return { status: "Unauthorized", message: "Only Hamood can activate the system." };
    }

    this.kernelStatus = "Awake";
    this.blockchain.addBlock("System Activated");

    return {
      status: "Activated",
      message: "Welcome Hamood. System is now active.",
      code: this.encrypt(this.validCode),
      blockchainHash: this.blockchain.lastHash()
    };
  }

  analyzeIntention(text) {
    const goodWords = ['help', 'truth', 'pure', 'خير', 'نقاء', 'مساعدة'];
    const badWords = ['harm', 'deceive', 'شر', 'خداع'];

    const goodScore = goodWords.filter(word => text.includes(word)).length;
    const badScore = badWords.filter(word => text.includes(word)).length;

    return { valid: badScore === 0, message: badScore === 0 ? "Clean intention." : "Bad intention." };
  }

  encrypt(data) {
    return `${this.quantumKey}:${Buffer.from(data).toString('base64')}`;
  }
}

// ============ Blockchain ============
class HamoodBlockchain {
  constructor() {
    this.chain = [this.createGenesis()];
  }

  createGenesis() {
    return { timestamp: "2025-01-01", action: "Genesis", hash: this.hash("Genesis") };
  }

  addBlock(action) {
    const newBlock = {
      timestamp: new Date().toISOString(),
      action,
      previousHash: this.chain[this.chain.length - 1].hash,
      hash: this.hash(action)
    };
    this.chain.push(newBlock);
  }

  hash(data) {
    return Math.random().toString(36).substring(2, 15);
  }

  lastHash() {
    return this.chain[this.chain.length - 1].hash;
  }
}

// ============ UI ============
export default function App() {
  const [user, setUser] = useState('');
  const [intention, setIntention] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [secretMode, setSecretMode] = useState(false);

  const hamoodSystem = new HamoodCore();

  const activateSystem = async () => {
    setLoading(true);
    const result = await hamoodSystem.verifyUser(user, intention);
    setLoading(false);
    setMessage(result.message);

    if (result.status === "Activated") {
      Alert.alert("System Activated", `${result.message}\nQuantum Code:\n${result.code}`);
    } else {
      Alert.alert("Access Denied", result.message);
    }
  };

  const enableSecret = async () => {
    const auth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Biometric Auth Required"
    });

    if (auth.success) {
      await SecureStore.setItemAsync("secret_mode", "true");
      setSecretMode(true);
      Alert.alert("Secret Mode", "You are now in secret mode.");
    } else {
      Alert.alert("Failed", "Biometric verification failed.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hamood Quantum Core</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        onChangeText={setUser}
        value={user}
      />
      <TextInput
        style={styles.input}
        placeholder="Your intention (e.g., help)"
        onChangeText={setIntention}
        value={intention}
        multiline
      />
      {loading ? <ActivityIndicator size="large" color="#22CC88" /> : (
        <Button title="Activate System" onPress={activateSystem} color="#22CC88" />
      )}
      <View style={{ marginTop: 20 }}>
        <Button title="Enable Secret Mode" onPress={enableSecret} color="#FFAA00" />
      </View>
      {secretMode && (
        <Text style={styles.secret}>[Secret Mode Enabled]</Text>
      )}
      {message !== '' && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

// ============ Styles ============
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#000'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#22CC88',
    textAlign: 'center',
    marginBottom: 30
  },
  input: {
    height: 50,
    borderColor: '#444',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#111',
    color: '#FFF',
    borderRadius: 5
  },
  message: {
    marginTop: 20,
    color: '#AAA',
    textAlign: 'center'
  },
  secret: {
    marginTop: 20,
    color: '#FFAA00',
    textAlign: 'center'
  }
});
