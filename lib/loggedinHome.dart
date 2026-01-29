import 'dart:math';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'colors/PerfixiaColors.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _currentIndex = 0;

  final List<Widget> _pages = const [
    _DashboardHome(),
    _ProjectsPage(),
    _ProfilePage(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: PerfexiaColors.background,
      body: SafeArea(
        child: Stack(
          children: [
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 350),
              child: _pages[_currentIndex],
            ),

            Positioned(
              top: 16,
              right: 16,
              child: _notificationButton(count: 3),
            ),
          ],
        ),
      ),

      /// -------- BOTTOM NAV --------
      bottomNavigationBar: ClipRRect(
        borderRadius: const BorderRadius.vertical(top: Radius.circular(22)),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
          child: BottomNavigationBar(
            currentIndex: _currentIndex,
            onTap: (index) => setState(() => _currentIndex = index),
            backgroundColor: Colors.black.withOpacity(0.55),
            selectedItemColor: PerfexiaColors.accent,
            unselectedItemColor: Colors.white60,
            showUnselectedLabels: true,
            type: BottomNavigationBarType.fixed,
            items: const [
              BottomNavigationBarItem(
                icon: Icon(Icons.dashboard_outlined),
                label: "Dashboard",
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.work_outline),
                label: "Projects",
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.person_outline),
                label: "Profile",
              ),
            ],
          ),
        ),
      ),
    );
  }
}

Widget _notificationButton({required int count}) {
  return Stack(
    children: [
      ClipRRect(
        borderRadius: BorderRadius.circular(14),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
          child: IconButton(
            onPressed: () {},
            icon: const Icon(Icons.notifications_none, color: Colors.white),
          ),
        ),
      ),
      if (count > 0)
        Positioned(
          right: 6,
          top: 6,
          child: Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: Colors.redAccent,
              shape: BoxShape.circle,
            ),
            child: Text(
              count.toString(),
              style: const TextStyle(fontSize: 10, color: Colors.white),
            ),
          ),
        ),
    ],
  );
}


class _DashboardHome extends StatelessWidget {
  const _DashboardHome();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "Welcome back 👋",
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            "Let’s build something amazing today.",
            style: TextStyle(color: Colors.white70),
          ),
          const SizedBox(height: 32),

          /// Cards
          Expanded(
            child: Column(
              children: [
                Expanded(
                  child: GridView.count(
                    crossAxisCount:
                    MediaQuery.of(context).size.width > 800 ? 3 : 2,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                    children: const [
                      _StatCard("Active Projects", "12", Icons.work_outline),
                      _StatCard("Clients", "28", Icons.people_outline),
                      _StatCard("Revenue", "₹1.2L", Icons.trending_up),
                      _StatCard("Tasks", "34", Icons.check_circle_outline),
                    ],
                  ),
                ),
                const SizedBox(height: 18),
                _announcementCard(),
              ],
            ),
          ),

        ],
      ),
    );
  }
}

Widget _announcementCard() {
  return ClipRRect(
    borderRadius: BorderRadius.circular(20),
    child: BackdropFilter(
      filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.12),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.white.withOpacity(0.25)),
        ),
        child: Row(
          children: const [
            Icon(Icons.campaign_outlined, color: Colors.white70),
            SizedBox(width: 12),
            Expanded(
              child: Text(
                "📢 New enterprise projects launching this week. Stay tuned!",
                style: TextStyle(color: Colors.white),
              ),
            ),
          ],
        ),
      ),
    ),
  );
}


class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;

  const _StatCard(this.title, this.value, this.icon);

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(20),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 14, sigmaY: 14),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                PerfexiaColors.secondary.withOpacity(0.9),
                PerfexiaColors.primary.withOpacity(0.9),
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(icon, color: Colors.white70, size: 28),
              const Spacer(),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                title,
                style: const TextStyle(color: Colors.white70),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ProjectsPage extends StatelessWidget {
  const _ProjectsPage();

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _projectsHeader(),
          _searchBar(),
          const SizedBox(height: 16),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              children: const [
                _ProjectCard(
                  name: "Perfexia CRM",
                  description: "Enterprise client management platform",
                  progress: 0.72,
                  status: "In Progress",
                  developer: "Rohit",
                ),
                SizedBox(height: 16),
                _ProjectCard(
                  name: "FinTech App",
                  description: "Secure payments & analytics system",
                  progress: 0.45,
                  status: "Ongoing",
                  developer: "Ankit",
                ),
                SizedBox(height: 16),
                _ProjectCard(
                  name: "Healthcare Dashboard",
                  description: "Real-time analytics for hospitals",
                  progress: 0.9,
                  status: "Review",
                  developer: "Sneha",
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

Widget _projectsHeader() {
  return Padding(
    padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
    child: const Text(
      "Projects",
      style: TextStyle(
        fontSize: 28,
        fontWeight: FontWeight.bold,
        color: Colors.white,
      ),
    ),
  );
}

Widget _searchBar() {
  return Padding(
    padding: const EdgeInsets.symmetric(horizontal: 20),
    child: TextField(
      style: const TextStyle(color: Colors.white),
      decoration: InputDecoration(
        hintText: "Search projects...",
        hintStyle: const TextStyle(color: Colors.white60),
        prefixIcon: const Icon(Icons.search, color: Colors.white70),
        filled: true,
        fillColor: Colors.white.withOpacity(0.12),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide.none,
        ),
      ),
    ),
  );
}

class _ProjectCard extends StatelessWidget {
  final String name;
  final String description;
  final double progress;
  final String status;
  final String developer;

  const _ProjectCard({
    required this.name,
    required this.description,
    required this.progress,
    required this.status,
    required this.developer,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(22),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 14, sigmaY: 14),
        child: Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                PerfexiaColors.secondary.withOpacity(0.9),
                PerfexiaColors.primary.withOpacity(0.9),
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(22),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              /// TOP ROW
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.work_outline, color: Colors.white70),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          name,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          description,
                          style: const TextStyle(
                            color: Colors.white70,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                  ),
                  _statusBadge(status),
                ],
              ),

              const SizedBox(height: 16),

              /// PROGRESS
              Row(
                children: [
                  Expanded(
                    child: LinearProgressIndicator(
                      value: progress,
                      minHeight: 6,
                      backgroundColor: Colors.white24,
                      color: PerfexiaColors.accent,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Text(
                    "${(progress * 100).round()}%",
                    style: const TextStyle(color: Colors.white),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              /// DEVELOPER ACTION
              Align(
                alignment: Alignment.centerRight,
                child: ElevatedButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.message, size: 16),
                  label: Text(developer),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: PerfexiaColors.accent,
                    foregroundColor: Colors.black,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _statusBadge(String status) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: PerfexiaColors.accent,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        status,
        style: const TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.bold,
          color: Colors.black,
        ),
      ),
    );
  }
}

class _ProfilePage extends StatefulWidget {
  const _ProfilePage({super.key});

  @override
  State<_ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<_ProfilePage> {
  bool showBack = false;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final isMobile = constraints.maxWidth < 720;

        if (isMobile) {
          return _mobileFlipCard();
        }

        return _webDualCard();
      },
    );
  }

  // ================= MOBILE FLIP =================
  Widget _mobileFlipCard() {
    return Center(
      child: GestureDetector(
        onTap: () => setState(() => showBack = !showBack),
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 700),
          switchInCurve: Curves.easeInOut,
          switchOutCurve: Curves.easeInOut,
          transitionBuilder: (child, animation) {
            final rotate = Tween(begin: pi, end: 0.0).animate(animation);
            return AnimatedBuilder(
              animation: rotate,
              child: child,
              builder: (context, child) {
                final isUnder = (ValueKey(showBack) != child!.key);
                var tilt = isUnder ? min(rotate.value, pi / 2) : rotate.value;
                return Transform(
                  transform: Matrix4.rotationY(tilt),
                  alignment: Alignment.center,
                  child: child,
                );
              },
            );
          },
          child: showBack
              ? _backCard(key: const ValueKey(true))
              : _frontCard(key: const ValueKey(false)),
        ),
      ),
    );
  }

  // ================= WEB / TAB =================
  Widget _webDualCard() {
    return Center(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          _frontCard(),
          const SizedBox(width: 32),
          _backCard(),
        ],
      ),
    );
  }

  // ================= FRONT CARD =================
  Widget _frontCard({Key? key}) {
    return Container(
      key: key,
      width: 320,
      padding: const EdgeInsets.symmetric(vertical: 28, horizontal: 22),
      decoration: _cardDecoration(),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text(
            "Perfexia",
            style: TextStyle(
              fontSize: 34,
              fontWeight: FontWeight.w800,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            "Where perfection Meets Excellence",
            style: TextStyle(color: Colors.white70),
          ),

          const SizedBox(height: 28),

          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white, width: 4),
            ),
            child: const CircleAvatar(
              radius: 42,
              backgroundColor: Color(0xFFEDE7F6),
              child: Icon(Icons.person, size: 42, color: Color(0xFF7E57C2)),
            ),
          ),

          const SizedBox(height: 18),

          const Text(
            "Your Name",
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: Colors.black,
            ),
          ),
          const SizedBox(height: 4),
          const Text("Your Designation", style: TextStyle(color: Colors.black87)),

          const SizedBox(height: 18),

          const Text(
            "E002",
            style: TextStyle(
              fontSize: 38,
              fontWeight: FontWeight.bold,
              color: Colors.white38,
            ),
          ),

          const SizedBox(height: 28),

          const Text(
            "Slide To Back →",
            style: TextStyle(color: Colors.black),
          ),
        ],
      ),
    );
  }

  // ================= BACK CARD =================
  Widget _backCard({Key? key}) {
    return Container(
      key: key,
      width: 320,
      height: 500,
      padding: const EdgeInsets.all(24),
      decoration: _cardDecoration(),
      child: Column(
        children: [
          _infoRow("Email", "youremail@perfexia.com"),
          const SizedBox(height: 12),
          _infoRow("Contact", "+91 9876543210"),

          const SizedBox(height: 32),

          Row(
            children: [
              _projectStat("Completed\nProjects", "18"),
              Container(width: 1, height: 60, color: Colors.white54),
              _projectStat("Ongoing\nProjects", "4"),
            ],
          ),

          const SizedBox(height: 28),

          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: Colors.white),
              color: Colors.white.withOpacity(0.25),
            ),
            child: const Text(
              "Great products are built when vision meets flawless execution",
              style: TextStyle(color: Colors.white),
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    );
  }

  // ================= HELPERS =================
  BoxDecoration _cardDecoration() {
    return BoxDecoration(
      borderRadius: BorderRadius.circular(28),
      gradient: const LinearGradient(
        colors: [Color(0xFF4A148C), Color(0xFF8E5CFF)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
    );
  }

  Widget _infoRow(String label, String value) {
    return Row(
      children: [
        SizedBox(
          width: 80,
          child: Text(
            "$label :",
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
        Expanded(
          child: Text(value, style: const TextStyle(color: Colors.white)),
        ),
      ],
    );
  }

  Widget _projectStat(String title, String value) {
    return Expanded(
      child: Column(
        children: [
          Text(
            title,
            textAlign: TextAlign.center,
            style: const TextStyle(color: Colors.white),
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: const TextStyle(
              fontSize: 36,
              fontWeight: FontWeight.bold,
              color: Colors.white38,
            ),
          ),
        ],
      ),
    );
  }
}







