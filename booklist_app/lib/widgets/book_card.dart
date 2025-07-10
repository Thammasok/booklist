import 'dart:io';

import 'package:flutter/material.dart';
import 'package:booklist_app/models/book.dart';

class BookCard extends StatelessWidget {
  final Book book;
  final VoidCallback onFavorite;
  final VoidCallback onDelete;
  final VoidCallback onTap;

  const BookCard({
    super.key,
    required this.book,
    required this.onFavorite,
    required this.onDelete,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Expanded(
              child: book.coverImagePath != null
                  ? ClipRRect(
                      borderRadius: const BorderRadius.vertical(
                        top: Radius.circular(12),
                      ),
                      child: Image.file(
                        File(book.coverImagePath!), // Add this import: import 'dart:io';
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) =>
                            _buildPlaceholder(),
                      ),
                    )
                  : _buildPlaceholder(),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    book.title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    book.author,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                  if (book.tags.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(top: 4.0),
                      child: Wrap(
                        spacing: 4,
                        children: book.tags
                            .take(2)
                            .map((tag) => Chip(
                                  label: Text(
                                    tag,
                                    style: const TextStyle(fontSize: 10),
                                  ),
                                  padding: EdgeInsets.zero,
                                  visualDensity: VisualDensity.compact,
                                ))
                            .toList(),
                      ),
                    ),
                ],
              ),
            ),
            ButtonBar(
              buttonPadding: EdgeInsets.zero,
              alignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: Icon(
                    book.isFavorite
                        ? Icons.favorite
                        : Icons.favorite_border,
                    color: book.isFavorite ? Colors.red : null,
                  ),
                  onPressed: onFavorite,
                  iconSize: 20,
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                ),
                IconButton(
                  icon: const Icon(Icons.delete_outline, size: 20),
                  onPressed: onDelete,
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlaceholder() {
    return Container(
      color: Colors.grey[200],
      child: const Center(
        child: Icon(
          Icons.menu_book,
          size: 48,
          color: Colors.grey,
        ),
      ),
    );
  }
}
