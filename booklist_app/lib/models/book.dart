import 'package:uuid/uuid.dart';

class Book {
  final String id;
  final String title;
  final String author;
  final String? coverImagePath;
  final List<String> tags;
  final bool isFavorite;
  final DateTime createdAt;
  final DateTime updatedAt;

  Book({
    String? id,
    required this.title,
    required this.author,
    this.coverImagePath,
    List<String>? tags,
    this.isFavorite = false,
    DateTime? createdAt,
    DateTime? updatedAt,
  })  : id = id ?? const Uuid().v4(),
        tags = tags ?? [],
        createdAt = createdAt ?? DateTime.now(),
        updatedAt = updatedAt ?? DateTime.now();

  Book copyWith({
    String? id,
    String? title,
    String? author,
    String? coverImagePath,
    List<String>? tags,
    bool? isFavorite,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Book(
      id: id ?? this.id,
      title: title ?? this.title,
      author: author ?? this.author,
      coverImagePath: coverImagePath ?? this.coverImagePath,
      tags: tags ?? List.from(this.tags),
      isFavorite: isFavorite ?? this.isFavorite,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'author': author,
      'coverImagePath': coverImagePath,
      'tags': tags,
      'isFavorite': isFavorite,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  factory Book.fromJson(Map<String, dynamic> json) {
    return Book(
      id: json['id'],
      title: json['title'],
      author: json['author'],
      coverImagePath: json['coverImagePath'],
      tags: List<String>.from(json['tags'] ?? []),
      isFavorite: json['isFavorite'] ?? false,
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
    );
  }
}
