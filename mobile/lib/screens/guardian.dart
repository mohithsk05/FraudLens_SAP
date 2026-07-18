import 'package:flutter/material.dart';

class GuardianScreen extends StatelessWidget {
  const GuardianScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Family Guardian Dashboard'),
        backgroundColor: const Color(0xFF050811),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Linked Vulnerable Accounts',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),

            Card(
              color: Theme.of(context).cardColor,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: const BorderSide(color: Colors.white10),
              ),
              child: const ListTile(
                leading: CircleAvatar(
                  backgroundColor: Color(0x1000F0FF),
                  child: Icon(Icons.person, color: Color(0xFF00F0FF)),
                ),
                title: Text('Ramesh Kumar (Father)', style: TextStyle(fontWeight: FontWeight.bold)),
                subtitle: Text('Device: Samsung Galaxy M34 (Shield Core v1.2)'),
                trailing: Text('Protected', style: TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold)),
              ),
            ),
            const SizedBox(height: 24),

            const Text(
              'Recent Intercept Warnings',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),

            Expanded(
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.black25,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.white10),
                ),
                child: ListView(
                  children: const [
                    ListTile(
                      leading: Icon(Icons.warning, color: Color(0xFFEF4444)),
                      title: Text('Blocked KYC phishing SMS from AD-SBIKYC'),
                      subtitle: Text('Score: 92% Threat - Verification locked on parent device.'),
                      trailing: Text('10:45 AM', style: TextStyle(fontSize: 10, color: Colors.grey)),
                    ),
                    Divider(color: Colors.white10),
                    ListTile(
                      leading: Icon(Icons.warning, color: Color(0xFFEF4444)),
                      title: Text('Blocked electricity cutoff threat from MD-BESCOM'),
                      subtitle: Text('Score: 94% Threat - Automatic overlay warning triggered.'),
                      trailing: Text('Yesterday', style: TextStyle(fontSize: 10, color: Colors.grey)),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
