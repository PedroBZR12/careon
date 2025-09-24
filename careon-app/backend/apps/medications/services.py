import requests

def buscar_preco(remedio: str) -> list[dict[str, str | float]]:
    url = "https://www.drogariasaopaulo.com.br/api/io/_v/api/intelligent-search/product_search/trade-policy/1"
    params = {"query": remedio, "count": 5, "page": 1}
    headers = {
        "User-Agent": "Mozilla/5.0",
        "Accept-Language": "pt-BR,pt;q=0.9",
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