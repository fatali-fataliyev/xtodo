<img src="./assets/images/xtodo_clear.png" alt="XTodo Logo" width="200">

Secure todo and task manager app.

[<img alt="Get it on Google Play" src="./docs/images/get-gplay.png" width="240">](https://play.google.com/store/apps/details?id=com.github.fatalifataliyev.xtodo)
[<img alt="Get it on GitHub" src="./docs/images/get-git.png" width="240">](https://github.com/fatali-fataliyev/xtodo/releases/latest/app_release.apk)

---

### Features

- **Encryption:** XTodo uses [AES-128](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) encryption to store your Notes and To-dos securely on disk.

- **Priority:** You can set priority levels for your To-dos, making it easy to know exactly where to start.
- **Rich Text Editing:** Format your notes with headings, bold text, italics, or even `code examples`.
- **Customization**: You can customize app's look from the settings menu.

---

## Security

XTodo is built with a zero-knowledge approach to your data privacy.

- **Key Generation:** On the first launch, the app generates AES-128 encryption key.

- **Key Security:** This key is instantly moved into the [Android Keystore system](https://developer.android.com/privacy-and-security/keystore).

- **Data Isolation:** Every note and to-do item is encrypted before being written to the disk.

> ⚠️ **Important Note on Data Persistence:** Because your encryption key lives exclusively within your device's Key store, **uninstalling the app or clearing its system data will permanently delete the key**. If the key is deleted, any existing encrypted data cannot be recovered.

> **Note**: App settings are stored without encryption because they do not contain any sensitive data.

---
