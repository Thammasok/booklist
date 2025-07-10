import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter/services.dart';
import 'package:booklist_app/providers/book_provider.dart';
import 'package:booklist_app/screens/home_screen.dart';
import 'package:booklist_app/theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Set preferred orientations
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  // Initialize providers
  final bookProvider = BookProvider();
  await bookProvider.loadBooks();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider<BookProvider>.value(value: bookProvider),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'BookList',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      home: const HomeScreen(),
      builder: (context, child) {
        return MediaQuery(
          data: MediaQuery.of(context).copyWith(textScaleFactor: 1.0),
          child: child!,
        );
      },
    );
  }
}

class ErrorHandler {
  static void handleError(FlutterErrorDetails details) {
    FlutterError.presentError(details);
    // In a real app, you might want to log the error to a service
    debugPrint(details.exceptionAsString());
    debugPrint(details.stack.toString());
  }
}
