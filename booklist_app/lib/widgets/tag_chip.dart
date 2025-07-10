import 'package:flutter/material.dart';

class TagChip extends StatelessWidget {
  final String label;
  final VoidCallback? onDelete;
  final Color? color;

  const TagChip({
    super.key,
    required this.label,
    this.onDelete,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Chip(
      label: Text(label),
      backgroundColor: color ?? Theme.of(context).colorScheme.primaryContainer,
      deleteIcon: onDelete != null
          ? const Icon(Icons.close, size: 16)
          : null,
      onDeleted: onDelete,
      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
      visualDensity: VisualDensity.compact,
      labelStyle: TextStyle(
        color: color != null
            ? Theme.of(context).colorScheme.onPrimaryContainer
            : null,
        fontSize: 12,
      ),
    );
  }
}
