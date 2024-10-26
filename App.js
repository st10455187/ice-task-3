import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';

const recyclableMaterials = [
  '🧴',
  '🧴',
  '🛍️',
  '🛍️',
  '🍶',
  '🍶',
  '🥫',
  '🥫',
  '📦',
  '📦',
  '🚫',
  '🚫',
];

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [resultScreen, setResultScreen] = useState(false);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [timer, setTimer] = useState(60);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (timer > 0 && gameStarted) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && gameStarted) {
      setGameStarted(false);
      setResultScreen(true);
    }
  }, [timer, gameStarted]);

  const startGame = () => {
    setCards(shuffleArray([...recyclableMaterials]));
    setGameStarted(true);
    setResultScreen(false);
    setTimer(60);
    setScore(0);
    setMatchedCards([]);
    setFlippedCards([]);
  };

  const flipCard = (index) => {
    if (
      flippedCards.length === 2 ||
      matchedCards.includes(index) ||
      flippedCards.includes(index)
    )
      return;

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [firstIndex, secondIndex] = newFlippedCards;
      if (
        cards[firstIndex] === cards[secondIndex] &&
        cards[firstIndex] !== '🚫'
      ) {
        setMatchedCards([...matchedCards, firstIndex, secondIndex]);
        setScore(score + 10);
      } else if (
        cards[firstIndex] === '🚫' ||
        cards[secondIndex] === '🚫'
      ) {
        setScore(score - 5);
      }
      setTimeout(() => {
        setFlippedCards([]);
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      {!gameStarted && !resultScreen ? (
        <View style={styles.homeScreen}>
          <Text style={styles.title}>Recycling Challenge</Text>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.buttonText}>Start Recycling</Text>
          </TouchableOpacity>
        </View>
      ) : gameStarted ? (
        <View style={styles.gameScreen}>
          <Text style={styles.timer}>Time Left: {timer}s</Text>
          <FlatList
            data={cards}
            numColumns={3}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  styles.card,
                  flippedCards.includes(index) || matchedCards.includes(index)
                    ? styles.cardFlipped
                    : styles.cardUnflipped,
                ]}
                onPress={() => flipCard(index)}
              >
                <Text style={styles.cardText}>
                  {flippedCards.includes(index) || matchedCards.includes(index)
                    ? item
                    : '?'}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <Text style={styles.score}>Recycling Points: {score}</Text>
          <TouchableOpacity style={styles.resetButton} onPress={startGame}>
            <Text style={styles.buttonText}>Recycle More</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.resultScreen}>
          <Text style={styles.resultTitle}>Results</Text>
          <Text style={styles.resultText}>Final Score: {score}</Text>
          <Text style={styles.resultText}>Time Remaining: {timer}s</Text>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0F7FA',
  },
  homeScreen: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00796B',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  gameScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timer: {
    fontSize: 18,
    marginBottom: 10,
    color: '#D32F2F',
  },
  card: {
    width: 80,
    height: 80,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  cardUnflipped: {
    backgroundColor: '#B2DFDB',
  },
  cardFlipped: {
    backgroundColor: '#FFFFFF',
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  cardText: {
    fontSize: 24,
  },
  score: {
    fontSize: 18,
    marginVertical: 20,
    color: '#00796B',
  },
  resetButton: {
    backgroundColor: '#FF7043',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0F7FA',
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00796B',
    marginBottom: 20,
  },
  resultText: {
    fontSize: 20,
    color: '#00796B',
    marginBottom: 10,
  },
});

export default App;
