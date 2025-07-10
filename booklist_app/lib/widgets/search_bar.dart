import 'package:flutter/material.dart';

class BookSearchBar extends StatelessWidget {
  final ValueChanged<String> onChanged;
  final String? hintText;

  const BookSearchBar({
    super.key,
    required this.onChanged,
    this.hintText = 'Search books...',
  });

  @override
  Widget build(BuildContext context) {
    return TextField(
      onChanged: onChanged,
      decoration: InputDecoration(
        hintText: hintText,
        prefixIcon: const Icon(Icons.search),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(30),
          borderSide: BorderSide.none,
        ),
        filled: true,
        contentPadding: EdgeInsets.zero,
        prefixIconConstraints: const BoxConstraints(
          minWidth: 50,
          minHeight: 36,
        ),
      ),
    );
  }
}
