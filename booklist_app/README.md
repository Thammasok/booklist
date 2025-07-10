# BookList Mobile App

A Flutter application for managing your book collection. This app allows you to keep track of books you own, want to read, or have already read. You can organize books by tags, search through your collection, and even import/export your data.

## Features

- 📚 Add, edit, and delete books with details like title, author, and cover image
- 🏷️ Organize books with custom tags
- 🔍 Search through your book collection
- ⭐ Mark books as favorites
- 📱 Responsive design that works on phones and tablets
- 🌓 Dark and light theme support
- 📤📥 Import/Export your book collection

## Screenshots

[Add screenshots of your app here]

## Getting Started

### Prerequisites

- Flutter SDK (latest stable version)
- Android Studio / Xcode (for running on emulator/simulator)
- VS Code or Android Studio (for development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Thammasok/booklist.git
   cd booklist/booklist_app
   ```

2. Install dependencies:
   ```bash
   flutter pub get
   ```

3. Run the app:
   ```bash
   flutter run
   ```

## Project Structure

```
lib/
├── models/          # Data models (Book, etc.)
├── providers/       # State management
├── screens/         # App screens
├── services/        # Business logic and API calls
├── theme/           # App theming
└── widgets/         # Reusable widgets
```

## Dependencies

- `provider`: State management
- `path_provider`: File system access
- `shared_preferences`: Local storage for settings
- `image_picker`: For selecting book cover images
- `file_picker`: For importing/exporting data
- `uuid`: For generating unique IDs
- `intl`: For date/time formatting

## Acknowledgments

- Built with Flutter
- Icons by Material Icons
- Design inspired by modern material design principles
