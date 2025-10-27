import { StyleSheet } from 'react-native';

export const Colors = {
  primary: '#4F46E5',
  secondary: '#6366F1',
  background: '#ffffffff',
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
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  text: {
    fontSize: 16,
    color: Colors.text,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    width: '100%',
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
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
  },
   medItem: {
    padding: 10,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  dayButton: {
    width: '100%',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#eee',
    margin: 4,
  },
  dayButtonSelected: {
    backgroundColor: '#007AFF',
  },
  dayText: {
    color: '#333',
  },
  dayTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  hourText: {
    fontSize: 12,
    color: '#666',
  },
});
