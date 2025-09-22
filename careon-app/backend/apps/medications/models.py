from django.db import models
from django.contrib.auth.models import User
import requests

class Remedio(models.Model):
    usuario = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        db_column="usuarios_id",
        related_name="remedios"
        )
    name = models.CharField(max_length=100, db_column="nome_remedio")
    dosage = models.CharField(max_length=50, db_column="dosagem")
    time = models.CharField(max_length=10, db_column="horario")
    day = models.CharField(max_length=20, db_column="dia_Semana")
    frequency = models.CharField(max_length=50, db_column="quantidade")
    notes = models.TextField(null=True, blank=True, db_column="observacoes")

    class Meta:
        db_table = 'remedios'
        managed = False

    def __str__(self):
        return self.name

    def buscar_preco(remedio: str) -> list[dict[str, str | float]]:
        """
        Busca os preços de um medicamento no site da Drogaria São Paulo
        utilizando a API interna de busca.

        Args:
            remedio (str): Nome do medicamento a ser pesquisado (ex: "novalgina").

        Returns:
            list[dict]: Lista de até 5 dicionários, cada um contendo:
                - "produto" (str): Nome do produto encontrado.
                - "preco" (float | str): Preço do produto. Se não disponível, retorna "Não disponível".
                - "farmacia" (str): Nome da farmácia de onde foi coletado o preço.

        Exemplo:
            >>> buscar_preco("novalgina")
            [
                {"produto": "Novalgina 1g c/ 10 Comprimidos", "preco": 14.99, "farmacia": "Drogaria São Paulo"},
                {"produto": "Novalgina Solução Oral 100ml", "preco": 22.90, "farmacia": "Drogaria São Paulo"},
                {"produto": "Novalgina Gotas 20ml", "preco": 12.50, "farmacia": "Drogaria São Paulo"},
                {"produto": "Novalgina 500mg 30 Comprimidos", "preco": 29.90, "farmacia": "Drogaria São Paulo"},
                {"produto": "Novalgina 1g 20 Comprimidos", "preco": 25.40, "farmacia": "Drogaria São Paulo"}
            ]
        """
        url = "https://www.drogariasaopaulo.com.br/api/io/_v/api/intelligent-search/product_search/trade-policy/1"
        params = {
            "query": remedio,
            "count": 5,
            "page": 1
        }

        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
            "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
            "Referer": "https://www.drogariasaopaulo.com.br/"
        }

        response = requests.get(url, params=params, headers=headers)

        resultados = []
        if response.status_code == 200:
            data = response.json()
            for product in data.get("products", [])[:5]:
                nome = product.get("productName", "Sem nome")
                preco = None

                if "items" in product and product["items"]:
                    sellers = product["items"][0].get("sellers", [])
                    if sellers:
                        comm = sellers[0].get("commertialOffer", {})
                        preco = comm.get("Price")

                resultados.append({
                    "produto": nome,
                    "preco": preco if preco else "Não disponível",
                    "farmacia": "Drogaria São Paulo"
                })
        else:
            return [{"erro": "Não foi possível buscar os preços no momento."}]

        return resultados
    