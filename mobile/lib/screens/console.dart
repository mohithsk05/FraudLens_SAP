import 'package:flutter/material.dart';

class ScanConsoleScreen extends StatefulWidget {
  const ScanConsoleScreen({super.key});

  @override
  State<ScanConsoleScreen> createState() => _ScanConsoleScreenState();
}

class _ScanConsoleScreenState extends State<ScanConsoleScreen> {
  final TextEditingController _textController = TextEditingController();
  final TextEditingController _urlController = TextEditingController();
  final TextEditingController _upiController = TextEditingController();
  
  bool _scanning = false;
  String? _verdict;
  double _score = 0.0;
  String _explanation = '';

  void _simulateScan(String type, String value) {
    if (value.trim().isEmpty) return;
    setState(() {
      _scanning = true;
      _verdict = null;
    });

    Future.delayed(const Duration(milliseconds: 800), () {
      setState(() {
        _scanning = false;
        final cleanVal = value.toLowerCase();
        if (cleanVal.contains('block') || cleanVal.contains('kyc') || cleanVal.contains('power') || cleanVal.contains('lottery') || cleanVal.contains('cashback')) {
          _verdict = 'CRITICAL DANGER';
          _score = 92.4;
          _explanation = 'High probability of $type fraud detected. Keywords match blocklist signatures.';
        } else {
          _verdict = 'SAFE';
          _score = 4.2;
          _explanation = 'Parameters clear. No typosquatting, short url links, or suspicious solicitations found.';
        }
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Threat Scan Console'),
          backgroundColor: const Color(0xFF050811),
          bottom: const TabBar(
            tabs: [
              Tab(icon: Icon(Icons.message), text: 'SMS Text'),
              Tab(icon: Icon(Icons.link), text: 'URL Link'),
              Tab(icon: Icon(Icons.payment), text: 'UPI Handle'),
            ],
          ),
        ),
        body: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              Expanded(
                child: TabBarView(
                  children: [
                    // Text Tab
                    Column(
                      children: [
                        TextField(
                          controller: _textController,
                          maxLines: 4,
                          decoration: const InputDecoration(
                            border: OutlineInputBorder(),
                            hintText: 'Paste SMS, WhatsApp forwards, or DM messages here...',
                          ),
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: () => _simulateScan('Text', _textController.text),
                          child: const Text('Scan Message'),
                        )
                      ],
                    ),
                    // URL Tab
                    Column(
                      children: [
                        TextField(
                          controller: _urlController,
                          decoration: const InputDecoration(
                            border: OutlineInputBorder(),
                            hintText: 'Enter link (e.g. http://hdfcbank-kyc.net)',
                          ),
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: () => _simulateScan('URL Link', _urlController.text),
                          child: const Text('Analyze Link'),
                        )
                      ],
                    ),
                    // UPI Tab
                    Column(
                      children: [
                        TextField(
                          controller: _upiController,
                          decoration: const InputDecoration(
                            border: OutlineInputBorder(),
                            hintText: 'Enter Suspect UPI ID (e.g. cashback-gpay@okaxis)',
                          ),
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: () => _simulateScan('UPI Address', _upiController.text),
                          child: const Text('Verify UPI payee'),
                        )
                      ],
                    ),
                  ],
                ),
              ),
              
              // Result Panel
              if (_scanning)
                const CircularProgressIndicator()
              else if (_verdict != null)
                Card(
                  color: _verdict == 'SAFE' ? const Color(0x1010B981) : const Color(0x10EF4444),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                    side: BorderSide(color: _verdict == 'SAFE' ? const Color(0xFF10B981) : const Color(0xFFEF4444)),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.between,
                          children: [
                            Text(
                              _verdict!,
                              style: TextStyle(
                                fontSize: 18, 
                                fontWeight: FontWeight.bold,
                                color: _verdict == 'SAFE' ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                              ),
                            ),
                            Text(
                              '${_score.toString()}% Threat',
                              style: const TextStyle(fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(_explanation, style: const TextStyle(fontSize: 14)),
                      ],
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
