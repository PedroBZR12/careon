# careon
Repositório de desenvolvimento do aplicativo CareOn
Projeto desenvolvido em **equipe**, com foco no aprendizado prático e na construção de uma aplicação funcional para gestão de saúde rotineira.

##

### O que é o CareOn? 
CareOn é um aplicativo de gestão de saúde rotineira. Nele, você pode cadastrar seus remédios, compromissos de saúde (como exames, cirurgias e outros),  marcar os remédios tomados e pesquisar por preço de remédios na farmácia drogasil (os preços são de acordo com o site e podem variar).
---
### Como baixar?

Você pode baixar e testar o aplicativo através do link abaixo:

🔗 **Link para download (Expo Build):**  
https://expo.dev/accounts/vital-code/projects/careon-app/builds/6dd2c458-9b79-4e88-aa70-0c3ee633a319


**Como instalar:**
1. Acesse o link
2. Clique em **Install**
3. Conclua a instalação no seu dispositivo Android


Como o projeto utiliza serviços em suas camadas gratuitas, existem duas condições para o funcionamento inicial:

  Backend (Render): A API entra em modo de suspensão após inatividade e pode levar cerca de 50 segundos para responder na primeira requisição.
  
  Banco de Dados (Supabase): O banco de dados é pausado automaticamente após 15 dias sem uso. Caso o aplicativo não consiga autenticar ou carregar dados, por favor, entre em contato para que possamos reativar a instância no painel do Supabase.


## Tecnologias utilizadas

### Frontend
- React Native
- Expo
- TypeScript

### Backend
- Python
- Django
- PostgreSQL (Supabase)
- Render

### Outros
- Web Scraping (consulta de preços)
- Integração via APIs REST


---

## Registro de Aprendizado

- Composição e organização de telas
- Integração com APIs do backend
- Validação de dados e autenticação por token
- Uso de `KeyboardAvoidingView` e `ScrollView`
- Configuração de variáveis de ambiente
- Build do APK com Expo
- Organização de componentes e módulos

### Backend
- Desenvolvimento de APIs REST
- Comunicação com banco de dados PostgreSQL
- Implementação de Web Scraping
- Integração com Supabase
- Deploy do backend

---

Atuação de cada membro durante o projeto:

Pedro Bizzari:
- Liderança e organização da equipe
- Desenvolvimento do Frontend mobile com React Native e Expo
- Participação no desenvolvimento do Backend
- Integração do Frontend com as APIs do Backend
- Validação de dados e autenticação por token
- Execução de testes funcionais
- Identificação e correção de bugs

Liam Vedovato Lopes:
- Desenvolvimento do Backend com Django e Python
- Implementação de operações CRUD
- Validação de dados com o banco de dados
- Identificação e correção de bugs

João Vitor P Bicalho:
- Desenvolvimento do banco de dados com Supabase
- Implementação do Web Scraping
- Identificação e correção de bugs
