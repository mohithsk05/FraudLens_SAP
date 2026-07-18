import 'package:flutter/material.dart';
import 'screens/dashboard.dart';
import 'screens/console.dart';
import 'screens/heatmap.dart';
import 'screens/guardian.dart';
import 'screens/quiz.dart';
import 'screens/escalate.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const FraudLensApp());
}

class FraudLensApp extends StatelessWidget {
  const FraudLensApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FraudLens Shield',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: const Color(0xFF00F0FF),
        scaffoldBackgroundColor: const Color(0xFF060913),
        cardColor: const Color(0xFF0C142C),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF00F0FF),
          secondary: Color(0xFF10B981),
          error: Color(0xFFEF4444),
        ),
        useMaterial3: true,
      ),
      home: const MainNavigationScreen(),
    );
  }
}

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    const DashboardScreen(),
    const ScanConsoleScreen(),
    const ScamHeatmapScreen(),
    const GuardianScreen(),
    const QuizAcademyScreen(),
    const EscalateScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(child: _screens[_currentIndex]),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.shifting,
        currentIndex: _currentIndex,
        selectedItemColor: const Color(0xFF00F0FF),
        unselectedItemColor: Colors.grey,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard_outlined),
            activeIcon: Icon(Icons.dashboard),
            label: 'Dashboard',
            backgroundColor: Color(0xFF050811),
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.security_outlined),
            activeIcon: Icon(Icons.security),
            label: 'Console',
            backgroundColor: Color(0xFF050811),
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.map_outlined),
            activeIcon: Icon(Icons.map),
            label: 'Scam Map',
            backgroundColor: Color(0xFF050811),
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.people_outline),
            activeIcon: Icon(Icons.people),
            label: 'Guardian',
            backgroundColor: Color(0xFF050811),
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.school_outlined),
            activeIcon: Icon(Icons.school),
            label: 'Quiz',
            backgroundColor: Color(0xFF050811),
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.gavel_outlined),
            activeIcon: Icon(Icons.gavel),
            label: 'Escalate',
            backgroundColor: Color(0xFF050811),
          ),
        ],
      ),
    );
  }
}
