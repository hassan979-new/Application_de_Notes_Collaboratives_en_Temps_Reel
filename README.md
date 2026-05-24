# Node.js – Notes Collaboratives en Temps Réel

## 📖 Description

Ce projet est une **application de prise de notes collaborative** construite avec **Node.js**, **Express**, **MongoDB** et **Socket.IO**.  
Il permet aux utilisateurs de créer des notes enrichies, de les partager avec d'autres utilisateurs, et de les éditer simultanément en temps réel grâce à une synchronisation instantanée.

---

## 📂 Structure du projet
```
collaborative-notes/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── noteController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── user.js
│   │   │   ├── note.js
│   │   │   └── category.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── notes.js
│   │   ├── services/
│   │   │   └── socketService.js
│   │   └── index.js
│   ├── .env
│   └── package.json
└── frontend/
├── public/
└── src/
├── components/
│   ├── Auth/
│   │   ├── Login.js
│   │   └── Register.js
│   ├── Notes/
│   │   ├── Editor.js
│   │   ├── NoteItem.js
│   │   ├── NoteList.js
│   │   └── ShareModal.js
│   ├── Categories/
│   │   ├── CategoryList.js
│   │   └── CategoryItem.js
│   └── Layout/
│       ├── Header.js
│       ├── Sidebar.js
│       └── MainContent.js
├── contexts/
│   ├── AuthContext.js
│   └── NotesContext.js
├── hooks/
│   ├── useAuth.js
│   ├── useNotes.js
│   └── useSocket.js
├── services/
│   ├── api.js
│   └── socket.js
├── App.js
└── index.js
```

---

## ⚙️ Fonctionnalités

### Gestion des notes
- **Création** : création rapide d'une nouvelle note avec éditeur riche.  
- **Édition** : éditeur **React Quill** avec barre de formatage complète (titres, gras, listes, couleurs, liens, images).  
- **Suppression** : suppression avec confirmation, réservée au propriétaire.  
- **Historique** : chaque modification sauvegarde une version précédente de la note.  
- **Sauvegarde automatique** : enregistrement automatique toutes les 30 secondes.  

### Collaboration en temps réel
- **Édition simultanée** : plusieurs utilisateurs peuvent modifier la même note en même temps.  
- **Synchronisation instantanée** : les modifications sont transmises en temps réel via **Socket.IO**.  
- **Indicateur de connexion** : affichage du statut connecté/déconnecté dans l'éditeur.  
- **Collaborateurs actifs** : liste des utilisateurs en train d'éditer la note.  

### Partage de notes
- **Partage par email** : partage d'une note avec n'importe quel utilisateur enregistré.  
- **Permissions** : choix entre accès en lecture seule ou lecture/écriture.  
- **Mise à jour des permissions** : modification possible des droits d'un utilisateur déjà invité.  

### Authentification
- **Inscription** avec nom, email et mot de passe.  
- **Connexion** avec génération d'un **JWT** sécurisé.  
- **Routes protégées** : accès aux notes uniquement pour les utilisateurs authentifiés.  
- **Vérification du token** : expiration automatique et nettoyage de session.  

### Recherche
- **Recherche full-text** : recherche dans les titres et contenus des notes via index MongoDB.  
- **Filtrage** : résultats limités aux notes accessibles par l'utilisateur.  

---

## 🖥️ Stack technique

| Côté | Technologie |
|------|-------------|
| Backend | Node.js, Express 4, MongoDB, Mongoose |
| Temps réel | Socket.IO |
| Authentification | JWT, bcryptjs |
| Frontend | React 19, React Router DOM |
| Éditeur | React Quill New |
| HTTP Client | Axios |
| Base de données | MongoDB Atlas |
| Dev server | Nodemon |

---

## 🚀 Installation et démarrage

### Prérequis
- Node.js v18+
- Compte MongoDB Atlas

### Backend
```bash
cd backend
npm install
# Configurer le fichier .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Variables d'environnement (backend/.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/collaborative-notes
JWT_SECRET=votre_secret_jwt
JWT_EXPIRE=30d
```

---

## 💡 Concepts pratiqués

- Communication temps réel avec **Socket.IO** et gestion des salles.  
- Authentification sécurisée avec **JWT** et hachage **bcryptjs**.  
- Conception d'une **API REST** avec Express et Mongoose.  
- Gestion de l'état global avec **React Context API**.  
- Hooks personnalisés React (`useAuth`, `useNotes`, `useSocket`).  
- Éditeur de texte riche avec **React Quill**.  
- Recherche full-text avec index **MongoDB**.  
- Architecture modulaire backend/frontend découplés.  

---
## 🖥️ Exemple
https://github.com/user-attachments/assets/19c34f78-2744-4001-8a5c-0fca4062fc22

---
## 🧑‍💻 Auteur

- 👤 **Agouram Hassan**  
- ⚙️ Développement Full-Stack Node.js / React  
- 🎓 Instructor : **Mr. LACHGAR**  
- 📅 24 Mai 2026
