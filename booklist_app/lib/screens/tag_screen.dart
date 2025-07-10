import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:booklist_app/providers/book_provider.dart';
import 'package:booklist_app/widgets/tag_chip.dart';

class TagScreen extends StatelessWidget {
  const TagScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tags'),
      ),
      body: Consumer<BookProvider>(
        builder: (context, bookProvider, _) {
          final tags = bookProvider.allTags;
          
          if (tags.isEmpty) {
            return const Center(
              child: Text('No tags yet. Add tags to your books to see them here.'),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(8.0),
            itemCount: tags.length,
            itemBuilder: (context, index) {
              final tag = tags[index];
              return ListTile(
                title: Text(tag),
                trailing: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      '(${bookProvider.books.where((b) => b.tags.contains(tag)).length})',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                    const SizedBox(width: 8),
                    const Icon(Icons.chevron_right),
                  ],
                ),
                onTap: () {
                  bookProvider.setSelectedTag(tag);
                  Navigator.pop(context);
                },
              );
            },
          );
        },
      ),
    );
  }
}
