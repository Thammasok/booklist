import 'package:flutter/material.dart';

class TagInputField extends StatefulWidget {
  final List<String> initialTags;
  final ValueChanged<List<String>> onChanged;

  const TagInputField({
    super.key,
    required this.initialTags,
    required this.onChanged,
  });

  @override
  State<TagInputField> createState() => _TagInputFieldState();
}

class _TagInputFieldState extends State<TagInputField> {
  late List<String> _tags;
  final TextEditingController _controller = TextEditingController();
  final FocusNode _focusNode = FocusNode();

  @override
  void initState() {
    super.initState();
    _tags = List.from(widget.initialTags);
  }

  @override
  void dispose() {
    _controller.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  void _addTag(String tag) {
    if (tag.trim().isNotEmpty && !_tags.contains(tag.trim())) {
      setState(() {
        _tags.add(tag.trim());
        _controller.clear();
        widget.onChanged(_tags);
      });
    }
  }

  void _removeTag(String tag) {
    setState(() {
      _tags.remove(tag);
      widget.onChanged(_tags);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Tags'),
        const SizedBox(height: 8),
        TextField(
          controller: _controller,
          focusNode: _focusNode,
          decoration: InputDecoration(
            hintText: 'Add a tag and press Enter',
            border: const OutlineInputBorder(),
            suffixIcon: _tags.isNotEmpty
                ? IconButton(
                    icon: const Icon(Icons.clear_all),
                    onPressed: () {
                      setState(() {
                        _tags.clear();
                        widget.onChanged(_tags);
                      });
                    },
                  )
                : null,
          ),
          onSubmitted: (value) {
            _addTag(value);
            _focusNode.requestFocus();
          },
          textInputAction: TextInputAction.done,
        ),
        if (_tags.isNotEmpty) ...{
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: _tags
                .map(
                  (tag) => Chip(
                    label: Text(tag),
                    onDeleted: () => _removeTag(tag),
                    deleteIcon: const Icon(Icons.close, size: 16),
                  ),
                )
                .toList(),
          ),
        },
      ],
    );
  }
}
