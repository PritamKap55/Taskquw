import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

  container: {
  flex: 1,
  justifyContent: 'center', // vertical center
  alignItems: 'center',     // horizontal center
  padding: 10,
},
   heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },

  button: {
    marginTop: 20,
    width: 60,
    height: 60,

    borderRadius: 30, // half of width/height = circle

    backgroundColor: '#b71212',

    justifyContent: 'center',
    alignItems: 'center',

    elevation: 5, // Android shadow

    shadowColor: '#000', // iOS shadow
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
  letterSpacing: 0.5,
},
});
