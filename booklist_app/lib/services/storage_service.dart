import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as path;
import 'package:booklist_app/models/book.dart';

class StorageService {
  static const String _fileName = 'booklist_data.json';
  static StorageService? _instance;
  late String _storagePath;

  static Future<StorageService> get instance async {
    if (_instance == null) {
      _instance = StorageService._();
      await _instance!._init();
    }
    return _instance!;
  }

  StorageService._();

  Future<void> _init() async {
    final directory = await getApplicationDocumentsDirectory();
    _storagePath = path.join(directory.path, _fileName);
  }

  Future<void> saveBooks(List<Book> books) async {
    try {
      final jsonString = jsonEncode({
        'books': books.map((book) => book.toJson()).toList(),
      });
      final file = File(_storagePath);
      await file.writeAsString(jsonString);
    } catch (e) {
      debugPrint('Error saving books: $e');
      rethrow;
    }
  }

  Future<List<Book>> loadBooks() async {
    try {
      final file = File(_storagePath);
      if (!await file.exists()) return [];

      final jsonString = await file.readAsString();
      final data = jsonDecode(jsonString) as Map<String, dynamic>;
      
      final books = (data['books'] as List)
          .map((item) => Book.fromJson(item as Map<String, dynamic>))
          .toList();
      
      return books;
    } catch (e) {
      debugPrint('Error loading books: $e');
      return [];
    }
  }

  Future<String> exportData() async {
    final books = await loadBooks();
    return jsonEncode({
      'books': books.map((book) => book.toJson()).toList(),
    });
  }

  Future<void> importData(String jsonString) async {
    try {
      final data = jsonDecode(jsonString) as Map<String, dynamic>;
      final books = (data['books'] as List)
          .map((item) => Book.fromJson(item as Map<String, dynamic>))
          .toList();
      
      await saveBooks(books);
    } catch (e) {
      debugPrint('Error importing data: $e');
      rethrow;
    }
  }
}
