import { StyleSheet } from 'react-native';

export const Colors = {
  primary: '#4F46E5',
  secondary: '#6366F1',
  background: '#F5F5F5',
  text: '#333333',
  muted: '#666666',
};

export const Fonts = {
  regular: 'SpaceMono',
  bold: 'SpaceMono-Bold',
};

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
  },
  containerItems: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    gap: 100,
  },
   header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30, // deixa a imagem redonda
    backgroundColor: '#ddd', // cinza caso não carregue a imagem
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  text: {
    fontSize: 16,
    color: Colors.text,
  },
  button: {
    width: '80%',
    padding: 15,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dateButton: {
    width: '80%',
    padding: 12,
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
  },
   medItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});