import 'package:flutter/material.dart';

class EscalateScreen extends StatefulWidget {
  const EscalateScreen({super.key});

  @override
  State<EscalateScreen> createState() => _EscalateScreenState();
}

class _EscalateScreenState extends State<EscalateScreen> {
  final _senderController = TextEditingController();
  final _upiController = TextEditingController();
  final _lossController = TextEditingController();
  final _txController = TextEditingController();
  final _messageController = TextEditingController();

  void _trigger1930Dialer() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('🚨 Golden Hour Call Trigger'),
        content: const Text(
          'Simulating helpline dialer to freeze target transaction funds.\n\nHelpline: 1930\n\nInstructions: Report the Transaction ID and Suspect UPI address immediately to invoke emergency freezes.'
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Close Dialing Stream'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Golden-Hour Incident Escalate'),
        backgroundColor: const Color(0xFF050811),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Compile Scam Dossier',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),

            TextField(
              controller: _senderController,
              decoration: const InputDecoration(labelText: 'Suspect Sender Handle / No.', border: OutlineInputBorder()),
            ),
            const SizedBox(height: 12),

            TextField(
              controller: _upiController,
              decoration: const InputDecoration(labelText: 'Suspect UPI Payee ID', border: OutlineInputBorder()),
            ),
            const SizedBox(height: 12),

            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _lossController,
                    decoration: const InputDecoration(labelText: 'Loss Amount', border: OutlineInputBorder()),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: TextField(
                    controller: _txController,
                    decoration: const InputDecoration(labelText: 'Ref Transaction ID', border: OutlineInputBorder()),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            TextField(
              controller: _messageController,
              maxLines: 3,
              decoration: const InputDecoration(labelText: 'Evidentiary SMS / Message Text', border: OutlineInputBorder()),
            ),
            const SizedBox(height: 20),

            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF00F0FF), foregroundColor: Colors.black),
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Dossier generated. Exporting FraudLens_Evidence_Brief.txt...')),
                      );
                    },
                    icon: const Icon(Icons.download),
                    label: const Text('Save Dossier'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFEF4444), foregroundColor: Colors.white),
                    onPressed: _trigger1930Dialer,
                    icon: const Icon(Icons.phone),
                    label: const Text('Call 1930'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
