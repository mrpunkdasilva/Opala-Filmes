# Esquema do Banco de Dados (MongoDB) - Opala Filmes

Este documento descreve a estrutura das coleções que serão usadas no banco de dados MongoDB para o projeto.

---

## 1. `users`

Armazena as informações dos usuários que têm acesso ao sistema.

```json
{
  "_id": "ObjectId",
  "username": "String", // Nome de usuário único
  "email": "String", // Email único para login e recuperação
  "passwordHash": "String", // Senha criptografada
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## 2. `groups`

Representa os grupos criados pelos usuários para compartilhar e votar em mídias.

```json
{
  "_id": "ObjectId",
  "name": "String", // Nome do grupo
  "description": "String", // Descrição opcional
  "ownerId": "ObjectId", // Referência ao `_id` do usuário que criou o grupo
  "members": ["ObjectId"], // Array de `_id` de usuários no grupo
  "createdAt": "Date"
}
```

---

## 3. `media`

Armazena as informações dos filmes, séries ou outras mídias. Optei por chamar de `media` para ser mais genérico.

```json
{
  "_id": "ObjectId",
  "tmdbId": "Number", // ID do The Movie Database (TMDB) para buscar mais detalhes
  "title": "String", // Título da mídia
  "type": "String", // 'movie' ou 'tv'
  "posterPath": "String", // URL para o pôster
  "releaseDate": "Date", // Data de lançamento
  "addedBy": "ObjectId", // Referência ao `_id` do usuário que adicionou
  "addedInGroups": ["ObjectId"], // Array de `_id` de grupos onde a mídia foi adicionada
  "addedAt": "Date"
}
```

---

## 4. `stickers`

As figurinhas (imagens, GIFs) que os usuários podem usar para votar.

```json
{
  "_id": "ObjectId",
  "name": "String", // Nome da figurinha
  "url": "String", // URL para o arquivo (imagem, GIF, etc.)
  "type": "String", // 'static' (imagem) ou 'dynamic' (gif/video)
  "uploadedBy": "ObjectId", // Referência ao `_id` do usuário que fez o upload
  "groupId": "ObjectId", // A qual grupo esta figurinha pertence
  "createdAt": "Date"
}
```

---

## 5. `votes`

Registra um voto de um usuário em uma mídia dentro de um grupo, usando uma figurinha.

```json
{
  "_id": "ObjectId",
  "mediaId": "ObjectId", // Mídia votada
  "userId": "ObjectId", // Usuário que votou
  "groupId": "ObjectId", // Grupo onde o voto ocorreu
  "stickerId": "ObjectId", // Figrinha usada no voto
  "createdAt": "Date"
}
```

---

## 6. `comments`

Armazena os comentários feitos pelos usuários nas mídias.

```json
{
  "_id": "ObjectId",
  "mediaId": "ObjectId", // Mídia comentada
  "userId": "ObjectId", // Usuário que comentou
  "groupId": "ObjectId", // Grupo onde o comentário foi feito
  "text": "String", // O conteúdo do comentário
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## 7. `tierLists`

Estrutura para as *tier lists* de cada grupo.

```json
{
  "_id": "ObjectId",
  "name": "String", // Ex: "Melhores filmes de Terror do Grupo"
  "groupId": "ObjectId", // Grupo ao qual a lista pertence
  "tiers": [
    {
      "rank": "String", // Ex: 'S', 'A', 'B', 'C', 'D', 'F'
      "title": "String", // Ex: "Obras-primas"
      "mediaIds": ["ObjectId"] // Mídias nesta categoria
    }
  ],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

## 8. `categories`

Para as listas especiais como "Um dia acaba", "Cinema", "Só mais um".

```json
{
  "_id": "ObjectId",
  "name": "String", // "Um dia acaba", "Cinema", etc.
  "description": "String", // O que significa esta categoria
  "groupId": "ObjectId", // A qual grupo pertence
  "mediaIds": ["ObjectId"], // Mídias que estão nesta categoria
  "createdAt": "Date"
}
```
