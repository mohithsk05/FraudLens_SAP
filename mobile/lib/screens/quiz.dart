import 'package:flutter/material.dart';

class QuizAcademyScreen extends StatefulWidget {
  const QuizAcademyScreen({super.key});

  @override
  State<QuizAcademyScreen> createState() => _QuizAcademyScreenState();
}

class _QuizAcademyScreenState extends State<QuizAcademyScreen> {
  int _xp = 0;
  int _currentIdx = 0;
  int? _selectedOpt;
  bool _answered = false;

  final questions = [
    {
      "scenario": "You receive an SMS: 'Dear customer, your BESCOM connection will be cut off at 9:30 PM due to unpaid bills. Call Electricity Officer on 9876543210.' What should you do?",
      "options": [
        "Call the number immediately and pay whatever outstanding they ask.",
        "Ignore it or call BESCOM's official toll-free helpline from their official website to verify.",
        "Forward the SMS to all your WhatsApp groups."
      ],
      "correct": 1,
      "explanation": "Official utilities never send personal mobile numbers for payment or threaten cutoffs within hours. Verify on official portals only."
    },
    {
      "scenario": "A WhatsApp user claims to be a customs officer. They show a photo of a package in your name and threaten legal action unless you transfer ₹50,000 for customs clearance via UPI. What is this?",
      "options": [
        "A legitimate customs warning. I must pay to clear my name.",
        "A 'Digital Arrest' impersonation scam. Customs/Police never verify or arrest people over WhatsApp and never ask for funds via UPI.",
        "A package shipping delay. I should ask for a discount."
      ],
      "correct": 1,
      "explanation": "No Indian law enforcement agency or department conducts 'Digital Arrests' or requests money over video/chat. Call 1930 immediately."
    }
  ];

  void _selectOption(int idx) {
    if (_answered) return;
    setState(() {
      _selectedOpt = idx;
      _answered = true;
      if (idx == questions[_currentIdx]['correct']) {
        _xp += 10;
      }
    });
  }

  void _nextQuestion() {
    setState(() {
      _selectedOpt = null;
      _answered = false;
      _currentIdx = (_currentIdx + 1) % questions.length;
    });
  }

  @override
  Widget build(BuildContext context) {
    final q = questions[_currentIdx];
    return Scaffold(
      appBar: AppBar(
        title: const Text('Digital Literacy Academy'),
        backgroundColor: const Color(0xFF050811),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.between,
              children: [
                const Text('🛡️ Safety Level: Cyber Aware', style: TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF00F0FF))),
                Chip(label: Text('🏆 $_xp XP'), backgroundColor: const Color(0xFF0C142C)),
              ],
            ),
            const SizedBox(height: 24),

            Text(
              q['scenario'] as String,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
            ),
            const SizedBox(height: 20),

            ...List.generate((q['options'] as List).length, (idx) {
              Color cardColor = Theme.of(context).cardColor;
              if (_answered) {
                if (idx == q['correct']) cardColor = const Color(0x3010B981);
                else if (idx == _selectedOpt) cardColor = const Color(0x30EF4444);
              }
              
              return GestureDetector(
                onTap: () => _selectOption(idx),
                child: Card(
                  color: cardColor,
                  margin: const EdgeInsets.only(bottom: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                    side: BorderSide(
                      color: _answered && idx == q['correct'] ? const Color(0xFF10B981) : Colors.white10
                    ),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Text((q['options'] as List)[idx] as String, style: const TextStyle(fontSize: 14)),
                  ),
                ),
              );
            }),

            if (_answered) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFF0C142C),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.white10),
                ),
                child: Text(q['explanation'] as String, style: const TextStyle(fontSize: 13, color: Colors.grey)),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _nextQuestion,
                child: const Text('Next Scenario'),
              ),
            ]
          ],
        ),
      ),
    );
  }
}
