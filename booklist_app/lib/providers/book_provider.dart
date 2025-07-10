import 'package:flutter/foundation.dart';
import 'package:booklist_app/models/book.dart';
import 'package:booklist_app/services/storage_service.dart';

class BookProvider with ChangeNotifier {
  List<Book> _books = [];
  String _searchQuery = '';
  String? _selectedTag;

  List<Book> get books {
    var result = _books;
    
    // Apply search filter
    if (_searchQuery.isNotEmpty) {
      result = result.where((book) => 
        book.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
        book.author.toLowerCase().contains(_searchQuery.toLowerCase())
      ).toList();
    }
    
    // Apply tag filter
    if (_selectedTag != null) {
      result = result.where((book) => 
        book.tags.any((tag) => tag.toLowerCase() == _selectedTag!.toLowerCase())
      ).toList();
    }
    
    return result;
  }

  List<Book> get favoriteBooks => 
      _books.where((book) => book.isFavorite).toList();

  List<String> get allTags {
    final tags = <String>{};
    for (var book in _books) {
      tags.addAll(book.tags);
    }
    return tags.toList()..sort();
  }

  String? get selectedTag => _selectedTag;

  BookProvider() {
    loadBooks();
  }

  Future<void> loadBooks() async {
    try {
      final storage = await StorageService.instance;
      _books = await storage.loadBooks();
      notifyListeners();
    } catch (e) {
      debugPrint('Error loading books: $e');
    }
  }

  Future<void> addBook(Book book) async {
    _books.add(book);
    await _saveBooks();
  }

  Future<void> updateBook(Book updatedBook) async {
    final index = _books.indexWhere((book) => book.id == updatedBook.id);
    if (index != -1) {
      _books[index] = updatedBook;
      await _saveBooks();
    }
  }

  Future<void> deleteBook(String id) async {
    _books.removeWhere((book) => book.id == id);
    await _saveBooks();
  }

  Future<void> toggleFavorite(String id) async {
    final index = _books.indexWhere((book) => book.id == id);
    if (index != -1) {
      _books[index] = _books[index].copyWith(
        isFavorite: !_books[index].isFavorite,
      );
      await _saveBooks();
    }
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  void setSelectedTag(String? tag) {
    _selectedTag = tag;
    notifyListeners();
  }

  Future<void> _saveBooks() async {
    try {
      final storage = await StorageService.instance;
      await storage.saveBooks(_books);
      notifyListeners();
    } catch (e) {
      debugPrint('Error saving books: $e');
      rethrow;
    }
  }

  Future<String> exportData() async {
    final storage = await StorageService.instance;
    return storage.exportData();
  }

  Future<void> importData(String jsonString) async {
    final storage = await StorageService.instance;
    await storage.importData(jsonString);
    await loadBooks();
  }
}
