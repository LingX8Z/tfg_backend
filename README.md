# 🧠 TFG Backend - NestJS

Este repositorio contiene el backend del Trabajo de Fin de Grado (TFG), desarrollado con el framework **NestJS**, que sirve de núcleo para una plataforma comparativa de modelos de lenguaje generativo (IA).

Permite autenticar usuarios, gestionar sesiones, interactuar con diferentes modelos (Gemini, LLaMA 3, RAG) y administrar funcionalidades según el rol (Usuario, Premium, Administrador).

## 🚀 Tecnologías utilizadas

- [NestJS](https://nestjs.com) – Framework progresivo para Node.js
- [MongoDB](https://www.mongodb.com/) – Base de datos NoSQL
- [JWT](https://jwt.io/) – Autenticación segura
- [Axios](https://axios-http.com/) – Cliente HTTP para APIs externas
- [Ollama](https://ollama.com/) – Ejecución local del modelo LLaMA 3
- [Hugging Face Transformers.js](https://huggingface.co/docs/transformers.js) – Uso en entorno RAG
- [Passport.js](http://www.passportjs.org/) – Estrategia de autenticación con JWT

## ⚙️ Instalación y ejecución

Clona el repositorio y ejecuta los siguientes pasos:

```bash
# Instalar dependencias
$ npm install

# Variables de entorno
Crea un archivo `.env` con tus configuraciones (puerto, claves JWT, MongoDB URI, etc.)

# Ejecutar en modo desarrollo
$ npm run start:dev

## 👨‍💻 Autor

**Lingxiao Zheng**  
Estudiante de Grado en Ingeniería Informática en Ingenieria del Software
Universidad [Politecdnica de Extremadura]  
GitHub: [https://github.com/lingxiao-zheng](https://github.com/LingX8Z)  
Correo: [lingxiaoz2002@gmail.com](mailto:tuemail@ejemplo.com)  
