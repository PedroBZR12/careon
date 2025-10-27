import { router } from "expo-router";
import React, { useState } from "react";
import { TextInput, Text, View, Alert, Button, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { API_URL } from "@env";

type Resultado = {
  produto: string;
  preco: number | string;
  farmacia: string;
};

export default function searchMedicines() {
    
    const [query, setQuery] = useState("");
    const [resultados, setResultados] = useState<Resultado[]>([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
  
    const handleBack = () => {
        router.push('/homeScreen');
    }

    const buscar = async () => {
        if (!query) return;
        setLoading(true);
        setErro(null);

        try {
        const response = await fetch(`${API_URL}/medications/buscar/?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (Array.isArray(data)) {
            setResultados(data);
        } else {
            setErro("Resposta inesperada da API");
        }
        } catch (e) {
        setErro("Erro ao buscar preços");
        } finally {
        setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
        <Text style={styles.titulo}>Buscar Remédio</Text>
        <TextInput
            style={styles.input}
            placeholder="Digite o nome do medicamento"
            value={query}
            onChangeText={setQuery}
        />
        <Button title="Buscar" onPress={buscar} />

        {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}

        {erro && <Text style={styles.erro}>{erro}</Text>}

        <FlatList
            data={resultados}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
            <View style={styles.card}>
                <Text style={styles.produto}>{item.produto}</Text>
                <Text>Farmácia: {item.farmacia}</Text>
                <Text>Preço: {item.preco}</Text>
            </View>
            )}
        />

        <View style={{marginBottom: 30}}>
            <Button title="Voltar" onPress={handleBack} />
        </View>

        </View>

    

    );
}

    const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#fff" },
    titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    card: {
        padding: 15,
        marginVertical: 8,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        elevation: 2,
    },
    produto: { fontSize: 16, fontWeight: "bold" },
    erro: { color: "red", marginTop: 10 },
    });
