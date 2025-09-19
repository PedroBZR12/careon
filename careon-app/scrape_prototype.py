import requests

def buscar_produtos(query):
    url = "https://www.drogariasaopaulo.com.br/api/io/_v/api/intelligent-search/product_search/trade-policy/1"
    params = {
        "query": query,
        "count": 48,
        "page": 1
    }

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        "Referer": "https://www.drogariasaopaulo.com.br/"
    }

    response = requests.get(url, params=params, headers=headers)

    if response.status_code == 200:
        data = response.json()
        print(f"\n=== Resultados para: {query.upper()} ===")
        for product in data.get("products", []):
            name = product.get("productName", "Sem nome")
            
            price = None
            if "items" in product and product["items"]:
                sellers = product["items"][0].get("sellers", [])
                if sellers:
                    comm = sellers[0].get("commertialOffer", {})
                    price = comm.get("Price")

            print(f"Produto: {name} — Preço: {price if price else 'Não disponível'}")
    else:
        print(f"Erro ao acessar API ({query}):", response.status_code)

if __name__ == "__main__":
    for remedio in ["novalgina", "dorflex", "benegrip"]:
        buscar_produtos(remedio)
