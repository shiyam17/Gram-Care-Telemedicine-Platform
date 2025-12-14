import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'GramCare',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.green),
        useMaterial3: true,
      ),
      home: const SymptomCheckerScreen(username: 'User'),
    );
  }
}

class SymptomCheckerScreen extends StatefulWidget {
  final String username;
  const SymptomCheckerScreen({super.key, required this.username});

  @override
  State<SymptomCheckerScreen> createState() => _SymptomCheckerScreenState();
}

class _SymptomCheckerScreenState extends State<SymptomCheckerScreen> {
  int _selectedIndex = 0; // Assuming Home is the first item

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F4F8),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF1F4F8),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF1B1B1B)),
          onPressed: () {
            print('Back button pressed');
          },
        ),
        title: const Text(
          'GramCare',
          style: TextStyle(
            color: Color(0xFF1B1B1B),
            fontSize: 20,
            fontWeight: FontWeight.w600,
          ),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              const AISymptomCheckerCard(),
              const SizedBox(height: 16),
              const LanguageSelectionCard(),
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: Colors.white,
        selectedItemColor: const Color(0xFF32AE4B),
        unselectedItemColor: Colors.grey.shade600,
        selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w600),
        unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w400),
        currentIndex: _selectedIndex,
        type: BottomNavigationBarType.fixed,
        onTap: (index) {
          setState(() {
            _selectedIndex = index;
          });
          print('Bottom nav item $index pressed');
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.calendar_today_outlined),
            label: 'Appointments',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            label: 'Profile',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings_outlined),
            label: 'Settings',
          ),
        ],
      ),
    );
  }
}

class AISymptomCheckerCard extends StatelessWidget {
  const AISymptomCheckerCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 5,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'AI Symptom Checker',
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w600,
              color: Color(0xFF1B1B1B),
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Describe your symptoms in your\npreferred language.',
            style: TextStyle(fontSize: 16, color: Color(0xFF666666)),
          ),
          const SizedBox(height: 24),
          const ModeSelectionTabs(),
          const SizedBox(height: 16),
          const SymptomInputBox(),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            height: 50,
            child: ElevatedButton.icon(
              onPressed: () {
                print('Send button pressed');
              },
              icon: const Icon(Icons.send, color: Colors.white),
              label: const Text(
                'Send',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF32AE4B),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(25),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class ModeSelectionTabs extends StatefulWidget {
  const ModeSelectionTabs({super.key});

  @override
  State<ModeSelectionTabs> createState() => _ModeSelectionTabsState();
}

class _ModeSelectionTabsState extends State<ModeSelectionTabs> {
  int _selectedIndex = 1; // Text is selected by default

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        _buildTab(context, 'Voice', Icons.mic, 0),
        _buildTab(context, 'Text', Icons.message, 1),
      ],
    );
  }

  Widget _buildTab(
    BuildContext context,
    String text,
    IconData icon,
    int index,
  ) {
    final bool isSelected = _selectedIndex == index;
    final Color selectedColor = const Color(0xFF32AE4B);
    final Color unselectedColor = Colors.grey.shade600;

    return InkWell(
      onTap: () {
        setState(() {
          _selectedIndex = index;
        });
        print('$text tab tapped');
      },
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0),
        child: Column(
          children: [
            Row(
              children: [
                Icon(icon, color: isSelected ? selectedColor : unselectedColor),
                const SizedBox(width: 8),
                Text(
                  text,
                  style: TextStyle(
                    color: isSelected ? selectedColor : unselectedColor,
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Container(
              height: 2,
              width: 60, // Approximate width
              color: isSelected ? selectedColor : Colors.transparent,
            ),
          ],
        ),
      ),
    );
  }
}

class SymptomInputBox extends StatelessWidget {
  const SymptomInputBox({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 150,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFF7F7F7),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade300),
      ),
      child: const TextField(
        maxLines: null,
        expands: true,
        decoration: InputDecoration(
          hintText: 'Describe your symptoms...',
          hintStyle: TextStyle(color: Color(0xFFA5A5A5), fontSize: 16),
          border: InputBorder.none,
        ),
      ),
    );
  }
}

class LanguageSelectionCard extends StatefulWidget {
  const LanguageSelectionCard({super.key});

  @override
  State<LanguageSelectionCard> createState() => _LanguageSelectionCardState();
}

class _LanguageSelectionCardState extends State<LanguageSelectionCard> {
  int _selectedLanguageIndex = 2; // English is selected by default

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 5,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Language Selection',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Color(0xFF1B1B1B),
            ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              _buildLanguageButton(context, 'Punjabi', 0),
              const SizedBox(width: 8),
              _buildLanguageButton(context, 'Hindi', 1),
              const SizedBox(width: 8),
              _buildLanguageButton(context, 'English', 2),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildLanguageButton(BuildContext context, String text, int index) {
    final bool isSelected = _selectedLanguageIndex == index;
    final Color selectedColor = const Color(0xFFEF5350); // Approximate
    final Color unselectedColor = Colors.white;

    return InkWell(
      onTap: () {
        setState(() {
          _selectedLanguageIndex = index;
        });
        print('Language button "$text" tapped');
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? selectedColor : unselectedColor,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? selectedColor : const Color(0xFFDEDEDE),
          ),
        ),
        child: Text(
          text,
          style: TextStyle(
            color: isSelected ? Colors.white : const Color(0xFF1B1B1B),
            fontSize: 16,
            fontWeight: FontWeight.w400,
          ),
        ),
      ),
    );
  }
}
