import 'dart:io';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:booklist_app/providers/book_provider.dart';
import 'package:booklist_app/models/book.dart';
import 'package:booklist_app/screens/add_book_screen.dart';
import 'package:booklist_app/screens/tag_screen.dart';
import 'package:booklist_app/widgets/book_card.dart';
import 'package:booklist_app/widgets/search_bar.dart' show BookSearchBar;
import 'package:booklist_app/widgets/tag_chip.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;
  
  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<BookProvider>(
      builder: (context, bookProvider, _) {
        return Scaffold(
          appBar: AppBar(
            title: const Text('BookList'),
            actions: [
              IconButton(
                icon: const Icon(Icons.import_export),
                onPressed: () => _showImportExportDialog(context, bookProvider),
              ),
            ],
          ),
          body: IndexedStack(
            index: _selectedIndex,
            children: [
              // Books Tab
              Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: BookSearchBar(
                      onChanged: bookProvider.setSearchQuery,
                    ),
                  ),
                  if (bookProvider.selectedTag != null)
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16.0),
                      child: Row(
                        children: [
                          TagChip(
                            label: bookProvider.selectedTag!,
                            onDelete: () => bookProvider.setSelectedTag(null),
                          ),
                          const Spacer(),
                          TextButton(
                            onPressed: () => bookProvider.setSelectedTag(null),
                            child: const Text('Clear'),
                          ),
                        ],
                      ),
                    ),
                  Expanded(
                    child: _buildBookList(bookProvider.books, bookProvider),
                  ),
                ],
              ),
              
              // Tags Tab
              _buildTagsView(bookProvider),
              
              // Favorites Tab
              _buildBookList(bookProvider.favoriteBooks, bookProvider),
            ],
          ),
          bottomNavigationBar: BottomNavigationBar(
            currentIndex: _selectedIndex,
            onTap: _onItemTapped,
            items: const [
              BottomNavigationBarItem(
                icon: Icon(Icons.menu_book),
                label: 'Books',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.tag),
                label: 'Tags',
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.favorite),
                label: 'Favorites',
              ),
            ],
          ),
          floatingActionButton: FloatingActionButton(
            onPressed: () => _navigateToAddBook(context),
            child: const Icon(Icons.add),
          ),
          drawer: Drawer(
            child: ListView(
              padding: EdgeInsets.zero,
              children: [
                const DrawerHeader(
                  decoration: BoxDecoration(
                    color: Colors.blue,
                  ),
                  child: Text(
                    'BookList',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                    ),
                  ),
                ),
                ListTile(
                  leading: const Icon(Icons.label),
                  title: const Text('Tags'),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const TagScreen(),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildBookList(List<Book> books, BookProvider bookProvider) {
    if (books.isEmpty) {
      return const Center(child: Text('No books found'));
    }

    return GridView.builder(
      padding: const EdgeInsets.all(8),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.7,
        crossAxisSpacing: 8,
        mainAxisSpacing: 8,
      ),
      itemCount: books.length,
      itemBuilder: (context, index) {
        final book = books[index];
        return BookCard(
          book: book,
          onFavorite: () => bookProvider.toggleFavorite(book.id),
          onDelete: () => _showDeleteDialog(context, book, bookProvider),
          onTap: () => _navigateToEditBook(context, book),
        );
      },
    );
  }

  Widget _buildTagsView(BookProvider bookProvider) {
    final tags = bookProvider.allTags;
    
    if (tags.isEmpty) {
      return const Center(
        child: Text('No tags found'),
      );
    }
    
    return ListView.builder(
      padding: const EdgeInsets.all(8.0),
      itemCount: tags.length,
      itemBuilder: (context, index) {
        final tag = tags[index];
        final bookCount = bookProvider.books
            .where((book) => book.tags.contains(tag))
            .length;
            
        return ListTile(
          title: Text(tag),
          trailing: Text('$bookCount'),
          onTap: () {
            bookProvider.setSelectedTag(tag);
            setState(() {
              _selectedIndex = 0; // Switch to books tab
            });
          },
        );
      },
    );
  }

  void _navigateToAddBook(BuildContext context) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const AddBookScreen(),
      ),
    );
  }

  void _navigateToEditBook(BuildContext context, Book book) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => AddBookScreen(book: book),
      ),
    );
  }

  Future<void> _showDeleteDialog(
    BuildContext context,
    Book book,
    BookProvider bookProvider,
  ) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Book'),
        content: Text('Are you sure you want to delete "${book.title}"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Delete', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      await bookProvider.deleteBook(book.id);
    }
  }

  Future<void> _showImportExportDialog(
    BuildContext context,
    BookProvider bookProvider,
  ) async {
    await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Import/Export'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.import_export),
              title: const Text('Export Data'),
              onTap: () => _exportData(context, bookProvider),
            ),
            ListTile(
              leading: const Icon(Icons.file_upload),
              title: const Text('Import Data'),
              onTap: () => _importData(context, bookProvider),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _exportData(
    BuildContext context,
    BookProvider bookProvider,
  ) async {
    try {
      final data = await bookProvider.exportData();
      // In a real app, you would save this to a file
      Navigator.pop(context);
      await showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Export Data'),
          content: SelectableText(data),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Close'),
            ),
          ],
        ),
      );
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error exporting data: $e')),
        );
      }
    }
  }

  Future<void> _importData(
    BuildContext context,
    BookProvider bookProvider,
  ) async {
    // In a real app, you would use file_picker to import a file
    Navigator.pop(context);
    final textController = TextEditingController();
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Import Data'),
        content: TextField(
          controller: textController,
          maxLines: 5,
          decoration: const InputDecoration(
            hintText: 'Paste your exported data here',
            border: OutlineInputBorder(),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Import'),
          ),
        ],
      ),
    );

    if (confirmed == true && textController.text.isNotEmpty) {
      try {
        await bookProvider.importData(textController.text);
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Data imported successfully')),
          );
        }
      } catch (e) {
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Error importing data: $e')),
          );
        }
      }
    }
  }
}
