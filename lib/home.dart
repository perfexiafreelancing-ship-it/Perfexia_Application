import 'dart:ui';
import 'package:flutter/material.dart';
import 'colors/PerfixiaColors.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:flutter/foundation.dart' show kIsWeb;



class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen>
    with TickerProviderStateMixin {
  late final AnimationController _titleController;
  late final AnimationController _statusController;
  late final AnimationController _cardsController;

  late final Animation<Offset> _titleSlide;
  late final Animation<double> _statusFade;
  late final Animation<double> _cardsFade;

  bool _showIntro = true;

  @override
  void initState() {
    super.initState();

    _titleController =
        AnimationController(vsync: this, duration: const Duration(milliseconds: 900));
    _statusController =
        AnimationController(vsync: this, duration: const Duration(milliseconds: 600));
    _cardsController =
        AnimationController(vsync: this, duration: const Duration(milliseconds: 700));

    _titleSlide = Tween<Offset>(
      begin: Offset.zero,
      end: const Offset(0, -0.18),
    ).animate(
      CurvedAnimation(parent: _titleController, curve: Curves.easeInOutCubic),
    );

    _statusFade = CurvedAnimation(
      parent: _statusController,
      curve: Curves.easeOut,
    );

    _cardsFade = CurvedAnimation(
      parent: _cardsController,
      curve: Curves.easeIn,
    );

    _startFlow();

  }

  Future<void> _startFlow() async {
    await Future.delayed(const Duration(milliseconds: 600));
    setState(() => _showIntro = false);
    await _titleController.forward();
    await _statusController.forward();
    await _cardsController.forward();
  }

  Future<void> _openLink(String url) async {
    final uri = Uri.parse(url);
    await launchUrl(
      uri,
      mode: kIsWeb
          ? LaunchMode.platformDefault // REQUIRED for web
          : LaunchMode.externalApplication,
    );
  }




  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    final isMobile = width < 700;

    return Scaffold(
      backgroundColor: PerfexiaColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.fromLTRB(24, isMobile ? 40 : 60, 24, 40),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [

              /// -------- HERO --------
              Center(
                child: SlideTransition(
                  position: _titleSlide,
                  child: Column(
                    children: [
                      const Text(
                        "Welcome to Perfexia",
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 48,
                          fontWeight: FontWeight.bold,
                          height: 1.1,
                        ),
                      ),

                      /// ---- INTRO (REMOVED FROM TREE) ----
                      AnimatedSwitcher(
                        duration: const Duration(milliseconds: 400),
                        child: _showIntro
                            ? Column(
                          key: const ValueKey("intro"),
                          children: [
                            const SizedBox(height: 24),
                            const _SmartLoader(),
                            const SizedBox(height: 24),
                            Padding(
                              padding: EdgeInsets.symmetric(
                                horizontal: isMobile ? 24 : 140,
                              ),
                              child: const Text(
                                "When you need perfection and excellence together",
                                style: TextStyle(
                                    color: Colors.white70, fontSize: 18),
                                textAlign: TextAlign.center,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Padding(
                              padding: EdgeInsets.symmetric(
                                horizontal: isMobile ? 24 : 140,
                              ),
                              child: const Text(
                                "You're at the right place — welcome to the future.",
                                style: TextStyle(
                                    color: Colors.white54, fontSize: 16),
                                textAlign: TextAlign.center,
                              ),
                            ),
                          ],
                        )
                            : const SizedBox.shrink(),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 48),

              /// -------- STATUS --------
              FadeTransition(
                opacity: _statusFade,
                child: const Text(
                  "Our Status",
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),

              const SizedBox(height: 24),

              /// -------- CARDS --------
              FadeTransition(
                opacity: _cardsFade,
                child: isMobile ? _mobileLayout() : _desktopLayout(),
              ),

              const SizedBox(height: 72),

              /// -------- FOOTER --------
              _footerSection(isMobile),

              const SizedBox(height: 40),

            ],
          ),
        ),
      ),
    );
  }

  Widget _mobileLayout() {
    return Column(
      children: _cards
          .map((c) => SizedBox(
        width: double.infinity,
        child: _glassCard(c),
      ))
          .toList(),
    );
  }

  Widget _desktopLayout() {
    return Column(
      children: [
        Row(
          children: _cards.take(3).map((c) => Expanded(child: _glassCard(c))).toList(),
        ),
        const SizedBox(height: 24),
        Row(
          children: _cards.skip(3).map((c) => Expanded(child: _glassCard(c))).toList(),
        ),
      ],
    );
  }

  Widget _footerSection(bool isMobile) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Get in Touch",
          style: TextStyle(
            color: Colors.white,
            fontSize: 28,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 24),

        isMobile
            ? Column(
          children: [
            _contactCard(),
            _joinUsCard(),
            _careerCard(),
          ],
        )
            : Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(child: _contactCard()),
            Expanded(child: _joinUsCard()),
            Expanded(child: _careerCard()),
          ],
        ),
      ],
    );
  }

  Widget _contactCard() {
    return _glassContainer(
      title: "Contact Us",
      child: Column(
        children: [

          const SizedBox(height: 16),

          if (kIsWeb)
            Column(
              children: [
                _LinkRow(
                  icon: Icons.linked_camera_outlined,
                  text: "linkedin.com/in/perfexia-freelancing",
                  url: "https://www.linkedin.com/in/perfexia-freelancing",
                  onTap: () => _openLink("https://www.linkedin.com/in/perfexia-freelancing"),
                ),
                _LinkRow(
                  icon: Icons.code_outlined,
                  text: "github.com/perfexiafreelancing-ship-it",
                  url: "https://github.com/perfexiafreelancing-ship-it",
                  onTap: () => _openLink("https://github.com/perfexiafreelancing-ship-it"),
                ),
              ],
            )
          else
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _iconButton(
                  icon: Icons.linked_camera_outlined,
                  tooltip: "LinkedIn",
                  url: "https://www.linkedin.com/in/perfexia-freelancing",
                ),
                const SizedBox(width: 20),
                _iconButton(
                  icon: Icons.code_outlined,
                  tooltip: "GitHub",
                  url: "https://github.com/perfexiafreelancing-ship-it",
                ),
              ],
            ),
        ],
      ),
    );
  }



  Widget _iconButton({
    required IconData icon,
    required String tooltip,
    required String url,
  }) {
    return Tooltip(
      message: tooltip,
      child: InkWell(
        borderRadius: BorderRadius.circular(30),
        onTap: () => _openLink(url),
        child: Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(.12),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white24),
          ),
          child: Icon(
            icon,
            color: PerfexiaColors.accent,
            size: 24,
          ),
        ),
      ),
    );
  }



  Widget _joinUsCard() {
    return _glassContainer(
      title: "Join Us",
      child: Column(
        children: [
          const _InputField(hint: "Your Name"),
          const SizedBox(height: 12),
          const _InputField(hint: "Email Address"),
          const SizedBox(height: 12),
          const _InputField(
            hint: "Proposal / Collaboration Idea",
            maxLines: 3,
          ),
          const SizedBox(height: 20),

          /// ---- SEND BUTTON ----
          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton(
              onPressed: () {
                // TODO: connect API / email later
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text("Proposal sent successfully 🚀"),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: PerfexiaColors.accent,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(18),
                ),
              ),
              child: Text(
                "Send",
                style: TextStyle(
                  fontSize: 16,
                  color: PerfexiaColors.primary,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }



  Widget _careerCard() {
    return _glassContainer(
      title: "Career",
      child: const Text(
        "Looking to work with a passionate tech team?\n\n"
            "Send your resume or portfolio to:\n"
            "perfexiafreelancing@gmail.com",
        style: TextStyle(
          color: Colors.white70,
          height: 1.5,
          fontSize: 15,
        ),
        textAlign: TextAlign.center,
      ),
    );
  }

  Widget _glassContainer({
    required String title,
    required Widget child,
  }) {
    return Container(
      margin: const EdgeInsets.all(12),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.12),
        borderRadius: BorderRadius.circular(26),
        border: Border.all(color: Colors.white24),
      ),
      child: Column(
        children: [
          Text(
            title,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          child,
        ],
      ),
    );
  }


  Widget _glassCard(_Stat stat) {
    return GestureDetector(
      onTap: () => _showStatDetails(stat),
      child: Container(
        height: 150,
        margin: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.12),
          borderRadius: BorderRadius.circular(26),
          border: Border.all(color: Colors.white24),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(stat.icon, color: PerfexiaColors.accent, size: 34),
            const SizedBox(height: 16),
            Text(
              stat.value,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 34,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              stat.title,
              style: const TextStyle(
                color: Colors.white70,
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showStatDetails(_Stat stat) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (_) {
        return Container(
          padding: const EdgeInsets.fromLTRB(24, 20, 24, 32),
          decoration: BoxDecoration(
            color: PerfexiaColors.background,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(stat.icon, color: PerfexiaColors.accent, size: 40),
              const SizedBox(height: 16),
              Text(
                stat.title,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                stat.description,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: Colors.white70,
                  fontSize: 16,
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        );
      },
    );
  }


  final List<_Stat> _cards = const [
    _Stat(
      "Developers",
      "24",
      Icons.people_outline,
      "A strong in-house team of skilled Flutter, Web, Backend and UI engineers delivering high-quality solutions.",
    ),
    _Stat(
      "Ongoing Projects",
      "7",
      Icons.work_outline,
      "Currently active projects across mobile apps, websites, dashboards and enterprise systems.",
    ),
    _Stat(
      "Clients",
      "18",
      Icons.handshake_outlined,
      "Trusted partners from startups to established businesses across multiple industries.",
    ),
    _Stat(
      "Upcoming Queue",
      "5",
      Icons.schedule_outlined,
      "Confirmed projects scheduled to begin soon, ensuring a healthy and growing delivery pipeline.",
    ),
    _Stat(
      "Completed Projects",
      "42",
      Icons.check_circle_outline,
      "Successfully delivered projects with production-ready quality and long-term client satisfaction.",
    ),
  ];


  @override
  void dispose() {
    _titleController.dispose();
    _statusController.dispose();
    _cardsController.dispose();
    super.dispose();
  }
}

class _LinkRow extends StatelessWidget {
  final IconData icon;
  final String text;
  final String url;
  final VoidCallback? onTap; // NEW

  const _LinkRow({
    required this.icon,
    required this.text,
    required this.url,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap, // use the passed function
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: PerfexiaColors.accent, size: 20),
          const SizedBox(width: 10),
          Text(
            text,
            style: const TextStyle(
              color: Colors.white70,
              decoration: TextDecoration.underline,
            ),
          ),
        ],
      ),
    );
  }
}


class _InputField extends StatelessWidget {
  final String hint;
  final int maxLines;

  const _InputField({required this.hint, this.maxLines = 1});

  @override
  Widget build(BuildContext context) {
    return TextField(
      maxLines: maxLines,
      style: const TextStyle(color: Colors.white),
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: const TextStyle(color: Colors.white54),
        filled: true,
        fillColor: Colors.white.withOpacity(.08),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(18),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }
}


/// ---------------- LOADER ----------------
class _SmartLoader extends StatefulWidget {
  const _SmartLoader();

  @override
  State<_SmartLoader> createState() => _SmartLoaderState();
}

class _SmartLoaderState extends State<_SmartLoader>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller =
    AnimationController(vsync: this, duration: const Duration(seconds: 1))
      ..repeat();
  }

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      size: const Size(60, 60),
      painter: _RingPainter(_controller),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}

class _RingPainter extends CustomPainter {
  final Animation<double> animation;
  _RingPainter(this.animation) : super(repaint: animation);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..strokeWidth = 6
      ..style = PaintingStyle.stroke
      ..shader = SweepGradient(
        startAngle: 0,
        endAngle: 6.28,
        transform: GradientRotation(animation.value * 6.28),
        colors: [
          Colors.white.withOpacity(.1),
          PerfexiaColors.accent,
          Colors.white.withOpacity(.1),
        ],
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));

    canvas.drawCircle(size.center(Offset.zero), size.width / 2.4, paint);
  }

  @override
  bool shouldRepaint(_) => true;
}


class _Stat {
  final String title;
  final String value;
  final IconData icon;
  final String description;

  const _Stat(this.title, this.value, this.icon, this.description);
}
